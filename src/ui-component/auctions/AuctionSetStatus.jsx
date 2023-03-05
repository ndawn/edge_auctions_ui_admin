import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const statusColor = (theme, isPublished) => ({
  [true]: theme.palette.primary[800],
  [false]: theme.palette.dark.main,
}[isPublished]);

const AuctionSetStatus = ({ set, ...props }) => {
  const theme = useTheme();

  return (
    <Typography
      color={statusColor(theme, set.isPublished)}
      fontWeight={500}
      {...props}
    >
      {set.isPublished ? 'Опубликован' : 'Не опубликован'}
    </Typography>
  );
};

export default AuctionSetStatus;
