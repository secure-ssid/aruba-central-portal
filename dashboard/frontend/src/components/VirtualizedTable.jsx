/**
 * VirtualizedTable - A reusable virtualized table component using react-window.
 *
 * Renders only visible rows for large datasets while preserving MUI table
 * styling. The header remains fixed (sticky) and the body scrolls via
 * react-window's List component.
 *
 * Props:
 *   rows        - array of data objects
 *   columns     - array of { key, header, render(row, index) }
 *   rowHeight   - pixel height per row (default 56)
 *   maxHeight   - max viewport height in px (default 600)
 *   onRowClick  - optional (row, index) => void
 *   rowKey      - optional (row, index) => unique key
 *   emptyMessage - string shown when rows is empty
 */

import React, { useCallback, useMemo } from 'react';
import { List } from 'react-window';
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableContainer,
  Typography,
  Box,
} from '@mui/material';

const VirtualizedTableRow = React.memo(function VirtualizedTableRow({
  index,
  style,
  data,
}) {
  const { rows, columns, onRowClick } = data;
  const row = rows[index];

  return (
    <div
      style={{
        ...style,
        display: 'flex',
        alignItems: 'center',
        borderBottom: '1px solid var(--border-subtle, rgba(224, 224, 224, 1))',
        cursor: onRowClick ? 'pointer' : 'default',
        boxSizing: 'border-box',
      }}
      role="row"
      onClick={onRowClick ? () => onRowClick(row, index) : undefined}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'transparent';
      }}
    >
      {columns.map((col) => (
        <div
          key={col.key}
          style={{
            flex: col.flex || 1,
            minWidth: col.minWidth || 0,
            maxWidth: col.maxWidth || 'none',
            width: col.width || 'auto',
            padding: '6px 16px',
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            boxSizing: 'border-box',
          }}
          role="cell"
        >
          {col.render ? col.render(row, index) : (row[col.key] ?? 'N/A')}
        </div>
      ))}
    </div>
  );
});

function VirtualizedTable({
  rows,
  columns,
  rowHeight = 56,
  maxHeight = 600,
  onRowClick,
  rowKey,
  emptyMessage = 'No data available',
}) {
  const itemData = useMemo(
    () => ({ rows, columns, onRowClick }),
    [rows, columns, onRowClick]
  );

  const itemKey = useCallback(
    (index, data) => {
      if (rowKey) return rowKey(data.rows[index], index);
      return index;
    },
    [rowKey]
  );

  const listHeight = Math.min(rows.length * rowHeight, maxHeight);

  if (rows.length === 0) {
    return (
      <Box sx={{ p: 4, textAlign: 'center' }}>
        <Typography color="text.secondary">{emptyMessage}</Typography>
      </Box>
    );
  }

  return (
    <TableContainer>
      {/* Sticky header */}
      <Table sx={{ tableLayout: 'fixed' }}>
        <TableHead>
          <TableRow>
            {columns.map((col) => (
              <TableCell
                key={col.key}
                sx={{
                  flex: col.flex || 1,
                  minWidth: col.minWidth || 0,
                  maxWidth: col.maxWidth || 'none',
                  width: col.width || 'auto',
                  fontWeight: 600,
                  position: 'sticky',
                  top: 0,
                  zIndex: 1,
                  backgroundColor: 'var(--bg-paper, #fff)',
                  ...(col.headerSx || {}),
                }}
                onClick={col.onHeaderClick}
              >
                {col.header}
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
      </Table>

      {/* Virtualized rows */}
      <List
        height={listHeight}
        itemCount={rows.length}
        itemSize={rowHeight}
        width="100%"
        itemData={itemData}
        itemKey={itemKey}
        overscanCount={10}
      >
        {VirtualizedTableRow}
      </List>
    </TableContainer>
  );
}

export default React.memo(VirtualizedTable);
