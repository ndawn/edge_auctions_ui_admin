import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import Link from 'ui-component/Link';
import { getDateDue, getMaxBid } from 'utils/auctions';
import AuctionStatus from 'ui-component/auctions/AuctionStatus';
import ImageCell from 'ui-component/supply/image-cell';

const AuctionsTable = ({ auctions, isActive = false }) => {
  return (
    <TableContainer component={Paper} sx={{ height: '100%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell>ID</TableCell>
            <TableCell></TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Статус</TableCell>
            <TableCell>Дата завершения</TableCell>
            <TableCell>Количество ставок</TableCell>
            <TableCell>Прибыль</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>{auctions.map((auction) => (
          <TableRow key={auction.id}>
            <TableCell>
              <Link to={isActive ? `/auctions/active/${auction.id}` : `/auctions/archive/auction/${auction.id}`}>{auction.id}</Link>
            </TableCell>
            <TableCell padding="none" sx={{ lineHeight: 1 }}>
              <ImageCell images={auction.item.images} height="48px" />
            </TableCell>
            <TableCell>
              <Link to={isActive ? `/auctions/active/${auction.id}` : `/auctions/archive/auction/${auction.id}`}>{auction.item.name}</Link>
            </TableCell>
            <TableCell>
              <AuctionStatus auction={auction} />
            </TableCell>
            <TableCell>{getDateDue(auction.endedAt ?? auction.dateDue)}</TableCell>
            <TableCell>{auction.bids.length}</TableCell>
            <TableCell>{getMaxBid(auction)} ₽</TableCell>
          </TableRow>
        ))}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default AuctionsTable;
