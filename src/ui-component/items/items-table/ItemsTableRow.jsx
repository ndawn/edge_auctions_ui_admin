import { useState } from 'react';

import { Box, Checkbox, Collapse, IconButton, TableCell, TableRow, Typography } from '@mui/material';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import KeyboardArrowUpOutlined from '@mui/icons-material/KeyboardArrowUpOutlined';

import ItemDetails from './ItemDetails';
import ImageCell from 'ui-component/supply/image-cell';

const ItemsTableRow = ({ row, isSelected, onToggle }) => {
  const [ open, setOpen ] = useState(false);

  return (
    <>
      <TableRow sx={{ '& > *': { borderBottom: 'unset !important' } }}>
        <TableCell padding="checkbox">
          <Checkbox
            checked={isSelected}
            onChange={() => onToggle?.(row)}
          />
        </TableCell>
        <TableCell>{row.id}</TableCell>
        <TableCell padding="none" sx={{ lineHeight: 1 }}>
          <ImageCell images={row.images} height="48px" />
        </TableCell>
        <TableCell>{row.name}</TableCell>
        <TableCell>{row.type?.name || '—'}</TableCell>
        <TableCell>{row.priceCategory?.alias || '—'}</TableCell>
        <TableCell>
          <IconButton
            size="small"
            onClick={() => setOpen((previousValue) => !previousValue)}
          >
            {open ? <KeyboardArrowUpOutlined /> : <KeyboardArrowDownOutlined />}
          </IconButton>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <ItemDetails item={row} />
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default ItemsTableRow;
