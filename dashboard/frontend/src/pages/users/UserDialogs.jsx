import {
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  TextField,
  Typography,
} from '@mui/material';

/** Dialog for inviting a new user via SCIM */
export function InviteUserDialog({ open, onClose, email, onEmailChange, onInvite }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Invite User</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Email"
          type="email"
          fullWidth
          variant="standard"
          value={email}
          onChange={(e) => onEmailChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onInvite} disabled={!email} variant="contained">
          Send Invite
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Dialog for creating a new SCIM group / role */
export function CreateGroupDialog({ open, onClose, groupName, onGroupNameChange, onCreate }) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Create Role (Group)</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Group Name"
          fullWidth
          variant="standard"
          value={groupName}
          onChange={(e) => onGroupNameChange(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onCreate} disabled={!groupName} variant="contained">
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}

/** Dialog for renaming, deleting, or cloning a SCIM group / role */
export function ManageGroupDialog({
  open,
  onClose,
  groups,
  selectedGroupId,
  onSelectGroup,
  renameGroupName,
  onRenameGroupNameChange,
  onDelete,
  onRename,
  onClone,
}) {
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Manage Role (Group)</DialogTitle>
      <DialogContent sx={{ display: 'grid', gap: 2, mt: 1 }}>
        <TextField
          select
          label="Select Group"
          value={selectedGroupId}
          onChange={(e) => onSelectGroup(e.target.value)}
          fullWidth
        >
          {groups.map((g) => (
            <MenuItem key={g.id} value={g.id}>
              {g.displayName || g.id}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          label="New Name"
          value={renameGroupName}
          onChange={(e) => onRenameGroupNameChange(e.target.value)}
          fullWidth
        />
        <Typography variant="caption" color="text.secondary">
          Use &quot;Clone&quot; to duplicate a role with the same members.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          color="error"
          onClick={onDelete}
          disabled={!selectedGroupId}
        >
          Delete
        </Button>
        <Button
          onClick={onRename}
          disabled={!selectedGroupId || !renameGroupName}
        >
          Rename
        </Button>
        <Button
          onClick={onClone}
          disabled={!selectedGroupId || !renameGroupName}
          variant="contained"
        >
          Clone
        </Button>
      </DialogActions>
    </Dialog>
  );
}
