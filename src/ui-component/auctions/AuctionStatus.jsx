import { Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const getStatus = (auction) => {
  if (auction.endedAt === null) {
    return 'inProcess';
  }

  return 'completed';
};

const statusText = {
  inProcess: 'В процессе',
  completed: 'Завершен',
};

const statusColor = (theme, status) => ({
  inProcess: theme.palette.primary[800],
  completed: theme.palette.dark.main,
}[status]);

const AuctionStatus = ({ auction, ...props }) => {
  const theme = useTheme();

  return (
    <Typography
      color={statusColor(theme, getStatus(auction))}
      fontWeight={500}
      {...props}
    >
      {statusText[getStatus(auction)]}
    </Typography>
  );
};

export default AuctionStatus;
