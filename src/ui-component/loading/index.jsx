import { CircularProgress, Backdrop } from '@mui/material';

const Loading = ({ isLoading = true }) => (
    <Backdrop open={isLoading} sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <CircularProgress color="inherit" />
    </Backdrop>
);

export default Loading;
