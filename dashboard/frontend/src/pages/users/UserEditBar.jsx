import {
  Box,
  Button,
  TextField,
  MenuItem,
} from '@mui/material';

function UserEditBar({
  users,
  selectedUserId,
  onSelectUser,
  updateGiven,
  onUpdateGiven,
  updateFamily,
  onUpdateFamily,
  updateDisplay,
  onUpdateDisplay,
  onUpdate,
  onDelete,
}) {
  return (
    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap', alignItems: 'center' }}>
      <TextField
        select
        label="Select User"
        value={selectedUserId}
        onChange={(e) => onSelectUser(e.target.value)}
        size="small"
        sx={{ minWidth: 260 }}
      >
        <MenuItem value="">
          <em>None</em>
        </MenuItem>
        {users.map((u) => (
          <MenuItem key={u.id} value={u.id}>
            {u.userName || u.username}
          </MenuItem>
        ))}
      </TextField>
      <TextField
        label="Given Name"
        size="small"
        value={updateGiven}
        onChange={(e) => onUpdateGiven(e.target.value)}
      />
      <TextField
        label="Family Name"
        size="small"
        value={updateFamily}
        onChange={(e) => onUpdateFamily(e.target.value)}
      />
      <TextField
        label="Display Name"
        size="small"
        value={updateDisplay}
        onChange={(e) => onUpdateDisplay(e.target.value)}
      />
      <Button variant="outlined" onClick={onUpdate} disabled={!selectedUserId}>
        Update
      </Button>
      <Button variant="outlined" color="error" onClick={onDelete} disabled={!selectedUserId}>
        Delete
      </Button>
    </Box>
  );
}

export default UserEditBar;
