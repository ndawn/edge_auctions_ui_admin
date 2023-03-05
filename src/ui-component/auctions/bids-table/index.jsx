import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import { getDateDue } from 'utils/auctions';

const BidsTable = ({ bids }) => {
  return (
    <TableContainer component={Paper} sx={{ height: '100%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>Пользователь</TableCell>
            <TableCell>Сумма</TableCell>
            <TableCell>Дата</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>{bids.map((bid) => (
          <TableRow key={bid.id}>
            <TableCell>{`${bid.user.firstName} ${bid.user.lastName}`}</TableCell>
            <TableCell>{bid.value}</TableCell>
            <TableCell>{getDateDue(bid.createdAt)}</TableCell>
          </TableRow>
        ))}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default BidsTable;
