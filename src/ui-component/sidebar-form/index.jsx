import {
  Box,
  CircularProgress,
  Drawer,
  IconButton,
  Paper,
  Toolbar,
  Typography,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { useTheme } from '@mui/material/styles';

const SidebarForm = ({
  title = '',
  isLoading = false,
  open = false,
  bottom = null,
  loadingLayout = null,
  onClose = () => {},
  children = [],
}) => {
  const theme = useTheme();

  return (
    <Drawer
      anchor="right"
      open={open}
      PaperProps={{
        sx: { width: '30vw', overflow: 'hidden' }
      }}
    >
      <Toolbar disableGutters sx={{ padding: '32px' }}>
        <Typography variant="h2" color="#323648" sx={{ flexGrow: 1 }}>{title}</Typography>
        <IconButton disabled={isLoading} color="dark" onClick={() => onClose?.()}>
          <CloseIcon />
        </IconButton>
      </Toolbar>

      {children}

      <Paper elevation={10} sx={{ position: 'absolute', top: 'auto', bottom: 0, width: '100%', borderRadius: 0 }}>
        {!isLoading && (
          <Toolbar>
            {bottom}
          </Toolbar>
        )}
      </Paper>
      {isLoading && (
        loadingLayout ?? (
          <Box
            sx={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'absolute',
              top: '0',
              left: '0',
              zIndex: theme.zIndex.drawer + 1,
              width: '100%',
              height: '100%',
              backdropFilter: 'blur(8px)',
            }}
          >
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress size={64} />
            </Box>
          </Box>
        )
      )}
    </Drawer>
  );
};

export default SidebarForm;
