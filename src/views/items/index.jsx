import { useEffect, useState } from 'react';

import {
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Popover,
  Select,
  Skeleton,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { LoadingButton } from '@mui/lab';
import KeyboardArrowDownOutlined from '@mui/icons-material/KeyboardArrowDownOutlined';
import { useToast } from 'use-toast-mui';

import MainCard from 'ui-component/cards/MainCard';

import {
  useDeleteItemMutation,
  useListItemsQuery,
  useListItemTypesQuery,
  useListPriceCategoriesQuery,
} from 'store/slices/api';

import ItemsTable from 'ui-component/items/items-table';

const ItemsView = () => {
  const toast = useToast();

  const [ itemTypeId, setItemTypeId ] = useState(0);
  const [ priceCategoryId, setPriceCategoryId ] = useState(0);

  const { data: items, isFetching, refetch } = useListItemsQuery({
    itemTypeId,
    priceCategoryId,
  }, { refetchOnMountOrArgChange: true });
  const { data: itemTypes } = useListItemTypesQuery();
  const { data: priceCategories } = useListPriceCategoriesQuery();
  const [ deleteItem, deleteItemResult ] = useDeleteItemMutation();

  const [ selection, setSelection ] = useState([]);
  const [ isDeleteDialogOpen, setIsDeleteDialogOpen ] = useState(false);
  const [ isDeleting, setIsDeleting ] = useState(false);

  const [ filtersRef, setFiltersRef ] = useState(null);

  const isFiltersMenuOpen = Boolean(filtersRef);

  const openFilters = (event) => {
    setFiltersRef(event.currentTarget);
  };

  const closeFilters = (event) => {
    setFiltersRef(null);
  };

  const resetFilters = (event) => {
    setItemTypeId(0);
    setPriceCategoryId(0);
  };

  const onDeleteButtonClick = () => {
    setIsDeleteDialogOpen(true);
  };

  const performDeleteItems = () => {
    setIsDeleting(true);

    deleteItem(selection).unwrap()
      .then((result) => {
        toast.success('Товары удалены');
        setSelection([]);
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении товаров');
      })
      .finally(() => {
        setIsDeleteDialogOpen(false);
        setIsDeleting(false);
      });
  };

  return (
    <MainCard
      title={[
        <Typography key="title" variant="header">Товары</Typography>,
        (itemTypeId !== 0) && (
          <Chip
            key="itemType"
            sx={{ ml: 1 }}
            variant="outlined"
            label={`Категория: ${itemTypes.find((itemType) => itemType.id === itemTypeId)?.name}`}
            onDelete={() => setItemTypeId(0)}
          />
        ),
        (priceCategoryId !== 0) && (
          <Chip
            key="priceCategory"
            sx={{ ml: 1 }}
            variant="outlined"
            label={`Ценовая категория: ${priceCategories.find((priceCategory) => priceCategory.id === priceCategoryId)?.alias}`}
            onDelete={() => setPriceCategoryId(0)}
          />
        ),
      ]}
      headerSX={{ height: '77px' }}
      contentSX={{ height: 'calc(100vh - 210px)' }}
      secondary={[
        selection.length > 0 && <Button key="delete" color="error" onClick={onDeleteButtonClick}>Удалить выбранные</Button>,
        <Button
          key="filters"
          disableElevation
          onClick={openFilters}
          endIcon={<KeyboardArrowDownOutlined />}
          ref={filtersRef}
        >Фильтры</Button>,
      ]}
    >
      {!isFetching
        ? <ItemsTable items={items} onSelectChange={setSelection} />
        : (
          <Grid container spacing={1}>
            {[...Array(16).keys()].map((index1) =>
              [1, 1, 6, 2, 2].map((size, index2) =>
                <Grid key={`${index1}${index2}`} xs={size}>
                  <Skeleton variant="rounded" height={42} />
                </Grid>
              )
            )}
          </Grid>
        )
      }

      <Popover
        anchorEl={filtersRef}
        open={isFiltersMenuOpen}
        onClose={closeFilters}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
      >
        <Paper sx={{ p: 2 }}>
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="item-type-id">Категория</InputLabel>
            <Select labelId="item-type-id" label="Категория" value={itemTypeId} size="small">
              <MenuItem value={0} onClick={(event) => setItemTypeId(event.target.value)}>--------</MenuItem>
              {itemTypes?.map((itemType) => (
                <MenuItem key={itemType.id} value={itemType.id} onClick={(event) => setItemTypeId(itemType.id)}>{itemType.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth sx={{ my: 1 }}>
            <InputLabel id="price-category-id">Ценовая категория</InputLabel>
            <Select labelId="price-category-id" label="Ценовая категория" value={priceCategoryId} size="small">
              <MenuItem value={0} onClick={(event) => setPriceCategoryId(event.target.value)}>--------</MenuItem>
              {priceCategories?.map((priceCategory) => (
                <MenuItem key={priceCategory.id} value={priceCategory.id} onClick={(event) => setPriceCategoryId(priceCategory.id)}>{priceCategory.alias}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button fullWidth color="dark" onClick={resetFilters}>Сбросить фильтры</Button>
        </Paper>
      </Popover>

      <Dialog open={isDeleteDialogOpen} onClose={() => setIsDeleteDialogOpen(false)}>
        <DialogTitle fontSize={24}>Удалить товары?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить товары? Все загруженные изображения и связанная с ними информация также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={() => setIsDeleteDialogOpen(false)} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={performDeleteItems}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default ItemsView;
