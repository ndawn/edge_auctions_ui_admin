import { Box, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

import { getDateDue, getOffsetString, getSetName, getTotalIncome } from 'utils/auctions';
import AuctionSetStatus from 'ui-component/auctions/AuctionSetStatus';
import AuctionsTable from 'ui-component/auctions/auctions-table';

const AuctionSet = ({ set }) => (
  <Box>
    <Typography color="inherit" variant="h2">{getSetName(set)}</Typography>
    <AuctionSetStatus set={set} sx={{ mt: 1 }} />

    <Grid container spacing={4} sx={{ my: 1 }}>
      <Grid>
        <Typography variant="caption">Дата окончания</Typography>
        <Typography variant="body1">{getDateDue(set.dateDue)} ({getOffsetString()})</Typography>
      </Grid>
      <Grid>
        <Typography variant="caption">Количество аукционов</Typography>
        <Typography variant="body1">{set.auctions.length}</Typography>
      </Grid>
      <Grid>
        <Typography variant="caption">Анти-снайпер</Typography>
        <Typography variant="body1">{set.antiSniper} минут</Typography>
      </Grid>
      <Grid>
        <Typography variant="caption">Общая прибыль</Typography>
        <Typography variant="body1">{getTotalIncome(set)} рублей</Typography>
      </Grid>
    </Grid>

    <AuctionsTable auctions={set.auctions} isActive={set.endedAt === null} />
  </Box>
);

export default AuctionSet;
