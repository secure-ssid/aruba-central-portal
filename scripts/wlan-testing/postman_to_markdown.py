#!/usr/bin/env python3
"""
Convert Postman Collection JSON to Markdown Documentation
"""
import json
import os
import re
from pathlib import Path
from typing import Dict, List, Any


class PostmanToMarkdown:
    def __init__(self, json_file: str, output_dir: str):
        self.json_file = json_file
        self.output_dir = Path(output_dir)
        self.collection_data = None

    def load_collection(self):
        """Load Postman collection JSON file"""
        with open(self.json_file, 'r', encoding='utf-8') as f:
            self.collection_data = json.load(f)
        print(f"Loaded collection: {self.collection_data['info']['name']}")

    def sanitize_filename(self, name: str) -> str:
        """Convert name to valid filename"""
        # Remove special characters and replace spaces with hyphens
        name = re.sub(r'[^\w\s-]', '', name)
        name = re.sub(r'[-\s]+', '-', name)
        return name.strip('-').lower()

    def format_code_block(self, content: str, language: str = '') -> str:
        """Format content as markdown code block"""
        if not content:
            return ''
        return f"```{language}\n{content}\n```\n"

    def format_json(self, data: Any) -> str:
        """Format JSON data with pretty printing"""
        if isinstance(data, str):
            try:
                data = json.loads(data)
            except:
                return data
        return json.dumps(data, indent=2)

    def process_request_body(self, body: Dict) -> str:
        """Process and format request body"""
        if not body:
            return ''

        md = "### Request Body\n\n"
        mode = body.get('mode', '')

        if mode == 'raw':
            raw_content = body.get('raw', '')
            language = body.get('options', {}).get('raw', {}).get('language', 'json')
            md += self.format_code_block(raw_content, language)
        elif mode == 'formdata':
            md += "**Form Data:**\n\n"
            for item in body.get('formdata', []):
                md += f"- **{item.get('key')}**: {item.get('value', item.get('description', ''))}\n"
            md += "\n"
        elif mode == 'urlencoded':
            md += "**URL Encoded:**\n\n"
            for item in body.get('urlencoded', []):
                md += f"- **{item.get('key')}**: {item.get('value', '')}\n"
            md += "\n"

        return md

    def process_request_headers(self, headers: List[Dict]) -> str:
        """Process and format request headers"""
        if not headers:
            return ''

        md = "### Headers\n\n"
        md += "| Key | Value | Description |\n"
        md += "|-----|-------|-------------|\n"

        for header in headers:
            if header.get('disabled'):
                continue
            key = header.get('key', '')
            value = header.get('value', '')
            description = header.get('description', '')
            md += f"| {key} | {value} | {description} |\n"

        md += "\n"
        return md

    def process_query_params(self, params: List[Dict]) -> str:
        """Process and format query parameters"""
        if not params:
            return ''

        md = "### Query Parameters\n\n"
        md += "| Parameter | Value | Description |\n"
        md += "|-----------|-------|-------------|\n"

        for param in params:
            if param.get('disabled'):
                continue
            key = param.get('key', '')
            value = param.get('value', '')
            description = param.get('description', '')
            md += f"| {key} | {value} | {description} |\n"

        md += "\n"
        return md

    def process_response_examples(self, responses: List[Dict]) -> str:
        """Process and format response examples"""
        if not responses:
            return ''

        md = "### Response Examples\n\n"

        for idx, response in enumerate(responses, 1):
            name = response.get('name', f'Example {idx}')
            status = response.get('status', '')
            code = response.get('code', '')

            md += f"#### {name}\n\n"
            if status and code:
                md += f"**Status:** {code} {status}\n\n"

            # Response headers
            headers = response.get('header', [])
            if headers:
                md += "**Response Headers:**\n\n"
                for header in headers[:5]:  # Limit to first 5 headers
                    md += f"- `{header.get('key')}`: {header.get('value')}\n"
                md += "\n"

            # Response body
            body = response.get('body', '')
            if body:
                md += "**Response Body:**\n\n"
                try:
                    formatted_body = self.format_json(body)
                    md += self.format_code_block(formatted_body, 'json')
                except:
                    md += self.format_code_block(body, 'text')

            md += "---\n\n"

        return md

    def process_request(self, item: Dict) -> str:
        """Process a single request and convert to markdown"""
        request = item.get('request', {})
        name = item.get('name', 'Untitled Request')
        description = item.get('description', '')

        # Build markdown
        md = f"# {name}\n\n"

        if description:
            md += f"{description}\n\n"

        # Method and URL
        method = request.get('method', 'GET')
        url_obj = request.get('url', {})

        if isinstance(url_obj, str):
            url = url_obj
        else:
            url = url_obj.get('raw', '')

        md += f"## Request\n\n"
        md += f"**Method:** `{method}`\n\n"
        md += f"**URL:** `{url}`\n\n"

        # Query parameters
        if isinstance(url_obj, dict) and url_obj.get('query'):
            md += self.process_query_params(url_obj['query'])

        # Headers
        headers = request.get('header', [])
        if headers:
            md += self.process_request_headers(headers)

        # Body
        body = request.get('body')
        if body:
            md += self.process_request_body(body)

        # Response examples
        responses = item.get('response', [])
        if responses:
            md += self.process_response_examples(responses)

        return md

    def process_folder(self, folder: Dict, parent_path: Path):
        """Recursively process folders and items"""
        folder_name = folder.get('name', 'Untitled Folder')
        folder_description = folder.get('description', '')
        items = folder.get('item', [])

        # Create folder directory
        folder_dir = parent_path / self.sanitize_filename(folder_name)
        folder_dir.mkdir(parents=True, exist_ok=True)

        # Create README for folder
        readme_content = f"# {folder_name}\n\n"
        if folder_description:
            readme_content += f"{folder_description}\n\n"

        readme_content += "## Contents\n\n"

        request_count = 0
        subfolder_count = 0

        for item in items:
            if 'request' in item:
                # It's a request
                request_name = item.get('name', 'Untitled')
                request_file = self.sanitize_filename(request_name) + '.md'
                readme_content += f"- [{request_name}](./{request_file})\n"

                # Process and save request
                request_md = self.process_request(item)
                with open(folder_dir / request_file, 'w', encoding='utf-8') as f:
                    f.write(request_md)

                request_count += 1
            elif 'item' in item:
                # It's a subfolder
                subfolder_name = item.get('name', 'Untitled')
                subfolder_path = self.sanitize_filename(subfolder_name)
                readme_content += f"- [{subfolder_name}](./{subfolder_path}/)\n"

                # Recursively process subfolder
                self.process_folder(item, folder_dir)
                subfolder_count += 1

        # Save folder README
        with open(folder_dir / 'README.md', 'w', encoding='utf-8') as f:
            f.write(readme_content)

        print(f"  Processed folder: {folder_name} ({request_count} requests, {subfolder_count} subfolders)")

    def convert(self):
        """Convert entire collection to markdown"""
        if not self.collection_data:
            self.load_collection()

        collection_name = self.collection_data['info']['name']
        collection_description = self.collection_data['info'].get('description', '')

        # Create output directory
        collection_dir = self.output_dir / self.sanitize_filename(collection_name)
        collection_dir.mkdir(parents=True, exist_ok=True)

        print(f"Converting '{collection_name}' to markdown...")
        print(f"Output directory: {collection_dir}")

        # Create main README
        main_readme = f"# {collection_name}\n\n"
        if collection_description:
            main_readme += f"{collection_description}\n\n"

        main_readme += "## API Documentation\n\n"

        # Process all items
        items = self.collection_data.get('item', [])
        for item in items:
            if 'request' in item:
                # Top-level request
                request_name = item.get('name', 'Untitled')
                request_file = self.sanitize_filename(request_name) + '.md'
                main_readme += f"- [{request_name}](./{request_file})\n"

                # Process and save request
                request_md = self.process_request(item)
                with open(collection_dir / request_file, 'w', encoding='utf-8') as f:
                    f.write(request_md)

                print(f"  Processed request: {request_name}")
            elif 'item' in item:
                # Folder
                folder_name = item.get('name', 'Untitled')
                folder_path = self.sanitize_filename(folder_name)
                main_readme += f"- [{folder_name}](./{folder_path}/)\n"

                # Process folder
                self.process_folder(item, collection_dir)

        # Save main README
        with open(collection_dir / 'README.md', 'w', encoding='utf-8') as f:
            f.write(main_readme)

        print(f"\n✓ Conversion complete!")
        print(f"Documentation saved to: {collection_dir}")


def main():
    import sys

    if len(sys.argv) < 3:
        print("Usage: python postman_to_markdown.py <json_file> <output_dir>")
        sys.exit(1)

    json_file = sys.argv[1]
    output_dir = sys.argv[2]

    if not os.path.exists(json_file):
        print(f"Error: File '{json_file}' not found")
        sys.exit(1)

    converter = PostmanToMarkdown(json_file, output_dir)
    converter.convert()


if __name__ == '__main__':
    main()
