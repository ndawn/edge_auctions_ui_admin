import { Box, IconButton, Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import AutorenewIcon from '@mui/icons-material/Autorenew';
import { useTheme } from '@mui/material/styles';

import ImageCell from 'ui-component/supply/image-cell';
import { getDateDue, getSetName, getOffsetString } from 'utils/auctions';

const AuctionSetPreview = ({ dateDue, antiSniper, items, onReroll }) => {
  const theme = useTheme();

  return (
    <Paper sx={{ p: 4, pt: 0, height: 'calc(100% - 175px)', overflowX: 'hidden', overflowY: 'scroll' }}>
      <Typography variant="h3" color="inherit">{getSetName({ dateDue })}</Typography>
      <Grid container spacing={4} sx={{ mt: 4, mb: 1 }}>
        <Grid>
          <Typography variant="caption">Дата окончания</Typography>
          <Typography variant="body1">{getDateDue(dateDue)} ({getOffsetString()})</Typography>
        </Grid>
        <Grid>
          <Typography variant="caption">Количество аукционов</Typography>
          <Typography variant="body1">{items.length}</Typography>
        </Grid>
        <Grid>
          <Typography variant="caption">Анти-снайпер</Typography>
          <Typography variant="body1">{antiSniper} минут</Typography>
        </Grid>
      </Grid>

      <Table>
        <TableHead>
          <TableCell>ID</TableCell>
          <TableCell></TableCell>
          <TableCell>Название</TableCell>
          <TableCell></TableCell>
        </TableHead>
        <TableBody>
          {items.map((item, index) => (
            <TableRow key={item.id}>
              <TableCell>{item.id}</TableCell>
              <TableCell padding="none" sx={{ lineHeight: 1 }}>
                <ImageCell images={item.images} height="48px" />
              </TableCell>
              <TableCell>{item.name}</TableCell>
              <TableCell>
                <Box sx={{ display: 'flex' }}>
                  <IconButton color="dark" onClick={() => onReroll?.(item, index)}>
                    <AutorenewIcon />
                  </IconButton>
                </Box>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Paper>
  );
};

export default AuctionSetPreview;
