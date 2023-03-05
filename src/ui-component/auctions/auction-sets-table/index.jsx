import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from '@mui/material';

import Link from 'ui-component/Link';
import { getSetName, getDateDue, getTotalIncome } from 'utils/auctions';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import VisibilityOffOutlinedIcon from '@mui/icons-material/VisibilityOffOutlined';
import VisibilityOutlinedIcon from '@mui/icons-material/VisibilityOutlined';

const AuctionSetsTable = ({ auctionSets, onPublishToggle, onDelete }) => (
  <TableContainer component={Paper} sx={{ height: '100%' }}>
    <Table stickyHeader>
      <TableHead>
        <TableRow>
          <TableCell>ID</TableCell>
          <TableCell>Название</TableCell>
          <TableCell>Статус</TableCell>
          <TableCell>Дата завершения</TableCell>
          <TableCell>Количество аукционов</TableCell>
          <TableCell>Общая прибыль</TableCell>
          <TableCell />
        </TableRow>
      </TableHead>
      <TableBody>{auctionSets?.map((set) => (
        <TableRow key={set.id}>
          <TableCell>
            <Link to={`/auctions/set/${set.id}`}>{set.id}</Link>
          </TableCell>
          <TableCell>
            <Link to={`/auctions/set/${set.id}`}>{getSetName(set)}</Link>
          </TableCell>
          <TableCell>{set.isPublished ? 'Опубликован' : 'Не опубликован'}</TableCell>
          <TableCell>{getDateDue(set.dateDue)}</TableCell>
          <TableCell>{set.auctions.length}</TableCell>
          <TableCell>{getTotalIncome(set)} ₽</TableCell>
          <TableCell>
            <Tooltip title={set.isPublished ? 'Снять с публикации' : 'Опубликовать'}>
              <IconButton color="primary" onClick={() => onPublishToggle?.(set)}>
                {set.isPublished ? <VisibilityOffOutlinedIcon /> : <VisibilityOutlinedIcon />}
              </IconButton>
            </Tooltip>
            <IconButton color="error" onClick={() => onDelete?.(set)}>
              <DeleteOutlinedIcon />
            </IconButton>
          </TableCell>
        </TableRow>
      ))}</TableBody>
    </Table>
  </TableContainer>
);

export default AuctionSetsTable;
