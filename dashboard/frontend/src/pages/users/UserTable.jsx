import {
  Box,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  TableContainer,
  Paper,
  Pagination,
  Skeleton,
} from '@mui/material';

const SORT_COLUMNS = [
  { key: 'username',  label: 'Email' },
  { key: 'status',    label: 'Status' },
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName',  label: 'Last Name' },
  { key: 'lastLogin', label: 'Last Login' },
  { key: 'createdAt', label: 'Created' },
];

function SortableHeader({ column, sortBy, sortDir, onSort }) {
  const indicator = sortBy === column ? (sortDir === 'asc' ? ' \u25B2' : ' \u25BC') : '';
  return (
    <TableCell
      onClick={() => onSort(column)}
      sx={{
        cursor: 'pointer',
        fontWeight: 600,
        userSelect: 'none',
        '&:hover': { color: 'var(--color-primary)' },
      }}
    >
      {SORT_COLUMNS.find((c) => c.key === column)?.label}{indicator}
    </TableCell>
  );
}

function UserTable({ users, loading, total, page, limit, sortBy, sortDir, onSort, onPageChange }) {
  const pageCount = Math.max(1, Math.ceil(total / limit));

  return (
    <>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              {SORT_COLUMNS.map((col) => (
                <SortableHeader
                  key={col.key}
                  column={col.key}
                  sortBy={sortBy}
                  sortDir={sortDir}
                  onSort={onSort}
                />
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {loading && users.length === 0 && (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={`skel-${i}`}>
                  {SORT_COLUMNS.map((col) => (
                    <TableCell key={col.key}>
                      <Skeleton variant="text" width="80%" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
            {!loading && users.length === 0 && (
              <TableRow>
                <TableCell colSpan={6} sx={{ py: 6, textAlign: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
                    <Typography variant="h6" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                      No users found
                    </Typography>
                    <Typography variant="body2" color="text.disabled">
                      Try adjusting your search or invite a new user to get started.
                    </Typography>
                  </Box>
                </TableCell>
              </TableRow>
            )}
            {users.map((u) => (
              <TableRow
                key={u.id}
                sx={{ '&:hover': { bgcolor: 'rgba(255,102,0,0.04)' } }}
              >
                <TableCell>{u.userName || u.username}</TableCell>
                <TableCell>
                  {u['urn:ietf:params:scim:schemas:extensions:hpe-greenlake:2.0:User']?.status || '-'}
                </TableCell>
                <TableCell>{u.name?.givenName || '-'}</TableCell>
                <TableCell>{u.name?.familyName || '-'}</TableCell>
                <TableCell>{u.meta?.lastLogin || '-'}</TableCell>
                <TableCell>{u.meta?.created || '-'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
        <Pagination
          count={pageCount}
          page={page}
          onChange={(_, p) => onPageChange(p)}
          color="primary"
          size="small"
        />
      </Box>
    </>
  );
}

export default UserTable;
