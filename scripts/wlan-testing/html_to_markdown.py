#!/usr/bin/env python3
"""
Convert HTML documentation to clean Markdown
"""
import re
import os
from pathlib import Path
from html.parser import HTMLParser


class HTMLToMarkdown(HTMLParser):
    def __init__(self):
        super().__init__()
        self.markdown = []
        self.current_tag = []
        self.list_level = 0
        self.in_pre = False
        self.in_code = False
        self.in_table = False
        self.table_rows = []
        self.current_row = []
        self.skip_content = False
        self.heading_level = 0
        self.link_text = []
        self.link_href = None

    def handle_starttag(self, tag, attrs):
        attrs_dict = dict(attrs)

        # Skip navigation, headers, footers, scripts, styles
        if tag in ['script', 'style', 'nav', 'header', 'footer']:
            self.skip_content = True
            return

        if self.skip_content:
            return

        self.current_tag.append(tag)

        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            self.heading_level = int(tag[1])
            self.markdown.append('\n' + '#' * self.heading_level + ' ')

        elif tag == 'p':
            self.markdown.append('\n\n')

        elif tag == 'br':
            self.markdown.append('  \n')

        elif tag == 'strong' or tag == 'b':
            self.markdown.append('**')

        elif tag == 'em' or tag == 'i':
            self.markdown.append('*')

        elif tag == 'code':
            if not self.in_pre:
                self.markdown.append('`')
                self.in_code = True

        elif tag == 'pre':
            self.in_pre = True
            self.markdown.append('\n```\n')

        elif tag == 'a':
            self.link_href = attrs_dict.get('href', '')
            self.link_text = []

        elif tag == 'img':
            alt = attrs_dict.get('alt', '')
            src = attrs_dict.get('src', '')
            self.markdown.append(f'\n![{alt}]({src})\n')

        elif tag in ['ul', 'ol']:
            self.markdown.append('\n')
            self.list_level += 1

        elif tag == 'li':
            indent = '  ' * (self.list_level - 1)
            parent_tag = self.current_tag[-2] if len(self.current_tag) > 1 else None
            if parent_tag == 'ol':
                self.markdown.append(f'{indent}1. ')
            else:
                self.markdown.append(f'{indent}- ')

        elif tag == 'table':
            self.in_table = True
            self.table_rows = []

        elif tag == 'tr':
            self.current_row = []

        elif tag in ['th', 'td']:
            pass

        elif tag == 'blockquote':
            self.markdown.append('\n> ')

        elif tag == 'hr':
            self.markdown.append('\n\n---\n\n')

    def handle_endtag(self, tag):
        if tag in ['script', 'style', 'nav', 'header', 'footer']:
            self.skip_content = False
            return

        if self.skip_content:
            return

        if self.current_tag and self.current_tag[-1] == tag:
            self.current_tag.pop()

        if tag in ['h1', 'h2', 'h3', 'h4', 'h5', 'h6']:
            self.markdown.append('\n')
            self.heading_level = 0

        elif tag == 'p':
            self.markdown.append('\n')

        elif tag == 'strong' or tag == 'b':
            self.markdown.append('**')

        elif tag == 'em' or tag == 'i':
            self.markdown.append('*')

        elif tag == 'code':
            if not self.in_pre:
                self.markdown.append('`')
                self.in_code = False

        elif tag == 'pre':
            self.in_pre = False
            self.markdown.append('\n```\n')

        elif tag == 'a':
            if self.link_text:
                text = ''.join(self.link_text)
                if self.link_href and self.link_href != text:
                    self.markdown.append(f'[{text}]({self.link_href})')
                else:
                    self.markdown.append(text)
            self.link_text = []
            self.link_href = None

        elif tag in ['ul', 'ol']:
            self.list_level -= 1
            self.markdown.append('\n')

        elif tag == 'li':
            self.markdown.append('\n')

        elif tag == 'tr':
            if self.in_table:
                self.table_rows.append(self.current_row[:])
                self.current_row = []

        elif tag == 'table':
            if self.in_table:
                self.render_table()
                self.in_table = False
                self.table_rows = []

    def handle_data(self, data):
        if self.skip_content:
            return

        # Clean up whitespace
        if not self.in_pre:
            data = re.sub(r'\s+', ' ', data)

        if self.link_text is not None and self.current_tag and self.current_tag[-1] == 'a':
            self.link_text.append(data)
        elif self.in_table and self.current_tag and self.current_tag[-1] in ['th', 'td']:
            self.current_row.append(data.strip())
        else:
            self.markdown.append(data)

    def render_table(self):
        if not self.table_rows:
            return

        self.markdown.append('\n\n')

        # Render header
        if self.table_rows:
            header = self.table_rows[0]
            self.markdown.append('| ' + ' | '.join(header) + ' |\n')
            self.markdown.append('|' + '|'.join(['---' for _ in header]) + '|\n')

            # Render rows
            for row in self.table_rows[1:]:
                # Pad row if needed
                while len(row) < len(header):
                    row.append('')
                self.markdown.append('| ' + ' | '.join(row) + ' |\n')

        self.markdown.append('\n')

    def get_markdown(self):
        md = ''.join(self.markdown)

        # Clean up excessive newlines
        md = re.sub(r'\n{4,}', '\n\n\n', md)

        # Clean up whitespace
        md = re.sub(r' +', ' ', md)

        # Remove leading/trailing whitespace
        md = md.strip()

        return md


def convert_html_to_markdown(html_file: str, output_file: str):
    """Convert HTML file to Markdown"""

    print(f"Converting: {html_file}")

    with open(html_file, 'r', encoding='utf-8', errors='ignore') as f:
        html_content = f.read()

    # Extract main content if possible
    # Try to find main content area
    main_patterns = [
        r'<main[^>]*>(.*?)</main>',
        r'<article[^>]*>(.*?)</article>',
        r'<div[^>]*class="[^"]*content[^"]*"[^>]*>(.*?)</div>',
        r'<div[^>]*id="[^"]*content[^"]*"[^>]*>(.*?)</div>',
    ]

    extracted = False
    for pattern in main_patterns:
        match = re.search(pattern, html_content, re.DOTALL | re.IGNORECASE)
        if match:
            html_content = match.group(1)
            extracted = True
            break

    if not extracted:
        # Remove common unwanted sections
        html_content = re.sub(r'<nav[^>]*>.*?</nav>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<header[^>]*>.*?</header>', '', html_content, flags=re.DOTALL | re.IGNORECASE)
        html_content = re.sub(r'<footer[^>]*>.*?</footer>', '', html_content, flags=re.DOTALL | re.IGNORECASE)

    # Parse HTML to Markdown
    parser = HTMLToMarkdown()
    parser.feed(html_content)
    markdown = parser.get_markdown()

    # Save to file
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(markdown)

    print(f"  → Saved to: {output_file}")
    print(f"  → Size: {len(markdown)} characters\n")


def process_directory(input_dir: str, output_dir: str):
    """Process all HTML files in a directory"""

    input_path = Path(input_dir)
    output_path = Path(output_dir)
    output_path.mkdir(parents=True, exist_ok=True)

    # Find all HTML files (excluding _files directories)
    html_files = []
    for html_file in input_path.glob('*.html'):
        html_files.append(html_file)

    if not html_files:
        print("No HTML files found in the directory")
        return

    print(f"Found {len(html_files)} HTML file(s)\n")

    for html_file in html_files:
        # Create output filename
        base_name = html_file.stem
        # Clean up filename
        base_name = re.sub(r'[_\s]+Validated Solution Guide', '', base_name)
        base_name = re.sub(r'[^\w\s-]', '', base_name)
        base_name = re.sub(r'[-\s]+', '-', base_name).strip('-').lower()

        output_file = output_path / f"{base_name}.md"

        convert_html_to_markdown(str(html_file), str(output_file))

    print(f"\n✓ Conversion complete!")
    print(f"  Converted {len(html_files)} file(s)")
    print(f"  Output directory: {output_path}")


def main():
    import sys

    if len(sys.argv) < 3:
        print("Usage: python html_to_markdown.py <input_dir> <output_dir>")
        sys.exit(1)

    input_dir = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(input_dir):
        print(f"Error: Input directory '{input_dir}' not found")
        sys.exit(1)

    process_directory(input_dir, output_dir)


if __name__ == '__main__':
    main()
