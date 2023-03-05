import { useMemo, useState } from 'react';

import { Checkbox, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';

import ItemsTableRow from './ItemsTableRow';

const ItemsTable = ({ items, onSelectChange }) => {
  const [ selectedItems, setSelectedItems ] = useState([]);

  const itemCount = useMemo(() => items?.length ?? 0, [items]);

  const onSelectAllClick = () => {
    setSelectedItems((previousValue) => {
      if (previousValue.length === itemCount) {
        onSelectChange?.([]);
        return [];
      }

      const newValue = items.map((item) => item.id);
      onSelectChange?.(newValue);
      return newValue;
    });
  };

  const toggleItem = (item) => {
    setSelectedItems((previousValue) => {
      const copy = previousValue.slice();

      const itemIndex = copy.indexOf(item.id);

      if (itemIndex !== -1) {
        copy.splice(itemIndex, 1);
      } else {
        copy.push(item.id);
      }

      onSelectChange?.(copy);
      return copy;
    });
  };

  const isItemSelected = (item) => selectedItems.indexOf(item.id) !== -1;

  return (
    <TableContainer component={Paper} sx={{ height: '100%' }}>
      <Table stickyHeader>
        <TableHead>
          <TableRow>
            <TableCell padding="checkbox">
              <Checkbox
                indeterminate={selectedItems.length > 0 && selectedItems.length < itemCount}
                checked={itemCount > 0 && selectedItems.length === itemCount}
                onChange={onSelectAllClick}
              />
            </TableCell>
            <TableCell>ID</TableCell>
            <TableCell></TableCell>
            <TableCell>Название</TableCell>
            <TableCell>Категория</TableCell>
            <TableCell>Ценовая категория</TableCell>
            <TableCell />
          </TableRow>
        </TableHead>
        <TableBody>{items?.map((item) => (
          <ItemsTableRow key={item.id} row={item} isSelected={isItemSelected(item)} onToggle={() => toggleItem(item)} />
        ))}</TableBody>
      </Table>
    </TableContainer>
  );
};

export default ItemsTable;
