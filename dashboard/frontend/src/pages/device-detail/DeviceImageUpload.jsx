/**
 * Device Image Upload Component with Background Removal
 * Handles uploading device images with optional background removal via @imgly/background-removal
 */

import { useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Alert,
  CircularProgress,
  FormControlLabel,
  Switch,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import apiClient from '../../services/api';

function DeviceImageUpload({ partNumber, onUploadSuccess }) {
  const [uploading, setUploading] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [removeBg, setRemoveBg] = useState(true); // Toggle for background removal

  const handleFileSelect = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      setError('Please select an image file');
      return;
    }

    setError('');
    setProcessing(true);
    setUploading(true);

    try {
      let processedFile;

      // Try to use background removal if enabled and available
      if (removeBg) {
        try {
          // Dynamically import background removal library
          // @vite-ignore tells Vite to skip analysis of this import
          const moduleName = '@imgly/background-removal';
          const bgRemovalModule = await import(/* @vite-ignore */ moduleName);
          const removeBackground = bgRemovalModule.removeBackground;

          // Read file as blob
          const imageBlob = await file.arrayBuffer();

          // Remove background with conservative settings to preserve device details
          // Using 'medium' model which is less aggressive than 'full'
          const processedBlob = await removeBackground(imageBlob, {
            model: 'medium', // Less aggressive model - preserves more foreground details
          });

          // Convert blob to File
          processedFile = new File([processedBlob], `${partNumber}.png`, {
            type: 'image/png',
          });
        } catch (importError) {
          // Fallback: upload original file without background removal
          console.warn('Background removal not available, uploading original image:', importError);
          processedFile = file;
        }
      } else {
        // Background removal disabled - use original file
        processedFile = file;
      }

      // Upload to backend
      const formData = new FormData();
      formData.append('image', processedFile);
      formData.append('partNumber', partNumber);

      // Use apiClient which includes session headers
      // For FormData, we need to let axios set Content-Type automatically (with boundary)
      // So we override the default 'application/json' header
      const response = await apiClient.post('/devices/upload-image', formData, {
        headers: {
          'Content-Type': undefined, // Let axios set it automatically for FormData
        },
      });

      if (response.data.success) {
        if (onUploadSuccess) {
          onUploadSuccess();
        }
        // Refresh page to show new image
        window.location.reload();
      } else {
        setError(response.data.error || 'Upload failed');
      }
    } catch (err) {
      console.error('Error processing/uploading image:', err);
      setError(err.response?.data?.error || err.message || 'Failed to process and upload image');
    } finally {
      setUploading(false);
      setProcessing(false);
      // Reset file input
      event.target.value = '';
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <FormControlLabel
        control={
          <Switch
            checked={removeBg}
            onChange={(e) => setRemoveBg(e.target.checked)}
            disabled={uploading || processing}
            size="small"
          />
        }
        label={
          <Typography variant="caption">
            Remove background {removeBg ? '(enabled)' : '(disabled)'}
          </Typography>
        }
        sx={{ mb: 1 }}
      />
      <input
        accept="image/*"
        style={{ display: 'none' }}
        id={`image-upload-${partNumber}`}
        type="file"
        onChange={handleFileSelect}
        disabled={uploading || processing}
      />
      <label htmlFor={`image-upload-${partNumber}`}>
        <Button
          variant="outlined"
          component="span"
          startIcon={<CloudUploadIcon />}
          disabled={uploading || processing}
          fullWidth
        >
          {processing ? (removeBg ? 'Removing Background...' : 'Processing...') : uploading ? 'Uploading...' : 'Upload Device Image'}
        </Button>
      </label>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>
          {error}
        </Alert>
      )}
      {processing && (
        <Box sx={{ mt: 1 }}>
          <CircularProgress size={24} />
          <Typography variant="caption" sx={{ ml: 1 }}>
            Processing image...
          </Typography>
        </Box>
      )}
    </Box>
  );
}

export default DeviceImageUpload;
