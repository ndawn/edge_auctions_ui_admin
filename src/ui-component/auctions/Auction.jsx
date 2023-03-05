import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { getDateDue, getMaxBid, getOffsetString } from 'utils/auctions';
import AuctionStatus from 'ui-component/auctions/AuctionStatus';
import BidsTable from 'ui-component/auctions/bids-table';

const Auction = ({ auction }) => (
  <Box>
    <Typography color="inherit" variant="h2">{auction.item.name}</Typography>
    <AuctionStatus auction={auction} sx={{ mt: 1 }} />

    <Grid container spacing={4} sx={{ my: 1 }}>
      <Grid>
        <Typography variant="caption">Дата окончания</Typography>
        <Typography variant="body1">{getDateDue(auction.endedAt ?? auction.dateDue)} ({getOffsetString()})</Typography>
      </Grid>
      <Grid>
        <Typography variant="caption">Количество ставок</Typography>
        <Typography variant="body1">{auction.bids.length}</Typography>
      </Grid>
      <Grid>
        <Typography variant="caption">Прибыль</Typography>
        <Typography variant="body1">{getMaxBid(auction)} рублей</Typography>
      </Grid>
    </Grid>

    <BidsTable bids={auction.bids} />
  </Box>
);

export default Auction;
