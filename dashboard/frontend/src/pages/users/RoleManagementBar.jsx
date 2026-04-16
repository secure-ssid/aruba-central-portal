import {
  Box,
  Button,
  Chip,
  TextField,
  MenuItem,
  Typography,
} from '@mui/material';

function RoleManagementBar({
  groups,
  userGroups,
  roleToAdd,
  onRoleToAddChange,
  selectedUserId,
  onAddRole,
  onRemoveRole,
}) {
  return (
    <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
        Roles
      </Typography>
      <TextField
        select
        size="small"
        label="Add to role"
        sx={{ minWidth: 260 }}
        value={roleToAdd}
        onChange={(e) => onRoleToAddChange(e.target.value)}
        disabled={!selectedUserId}
      >
        {groups.map((g) => (
          <MenuItem key={g.id} value={g.id}>
            {g.displayName || g.id}
          </MenuItem>
        ))}
      </TextField>
      <Button
        variant="outlined"
        onClick={onAddRole}
        disabled={!selectedUserId || !roleToAdd}
      >
        Add Role
      </Button>
      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {userGroups.length === 0 && selectedUserId && (
          <Typography variant="caption" color="text.disabled" sx={{ alignSelf: 'center' }}>
            No roles assigned
          </Typography>
        )}
        {userGroups.map((g) => (
          <Chip
            key={g.id}
            label={g.displayName || g.id}
            size="small"
            onDelete={() => onRemoveRole(g.id)}
            sx={{
              bgcolor: 'rgba(255,102,0,0.10)',
              color: 'rgba(255,255,255,0.85)',
              border: '1px solid rgba(255,102,0,0.25)',
              '& .MuiChip-deleteIcon': { color: 'rgba(255,255,255,0.5)' },
            }}
          />
        ))}
      </Box>
    </Box>
  );
}

export default RoleManagementBar;
