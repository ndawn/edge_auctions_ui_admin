import { useMemo, useState } from 'react';

import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import RemoveRedEyeOutlinedIcon from '@mui/icons-material/RemoveRedEyeOutlined';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, ruRU } from '@mui/x-data-grid';

import { useDeleteItemMutation, useListPriceCategoriesQuery, useUpdateItemMutation } from 'store/slices/api';
import ImageCell from 'ui-component/supply/image-cell';
import StatusBadge from 'ui-component/supply/status-badge';
import { useToast } from 'use-toast-mui';
import SupplyDetails from 'ui-component/supply/supply-details';

const SupplySession = ({ session, isUpdating, onSelectChange, onItemUpdated, onItemDeleted }) => {
  const theme = useTheme();
  const toast = useToast();

  const { data: priceCategories, isFetching, error } = useListPriceCategoriesQuery();
  const [ updateItem, updateItemResult ] = useUpdateItemMutation();
  const [ deleteItem, deleteItemResult ] = useDeleteItemMutation();

  const [ isDeleteItemModalOpen, setIsDeleteItemModalOpen ] = useState(false);
  const [ itemToDelete, setItemToDelete ] = useState(null);
  const [ isDeleting, setIsDeleting ] = useState(false);
  const [ detailsItem, setDetailsItem ] = useState(null);

  const updateableFields = [
    'name',
    'priceCategory',
    'upca',
    'upc5',
  ];

  const items = useMemo(() => session.items.map((item) => ({
    priceCategoryId: item.priceCategory?.id,
    priceCategory: item.priceCategory?.id,
    ...item,
  })), [session]);

  const onRowUpdate = async (newRow, oldRow) => {
    const changedFields = updateableFields.filter((field) => oldRow[field] !== newRow[field]);
    const updateBody = Object.fromEntries(changedFields.map((field) => [field, newRow[field]]));

    if ('priceCategory' in updateBody) {
      updateBody.priceCategoryId = updateBody.priceCategory;
      delete updateBody.priceCategory;
    }

    const item = await updateItem({ id: newRow.id, ...updateBody }).unwrap();

    onItemUpdated?.(item);

    return {
      priceCategoryId: item.priceCategory?.id,
      priceCategory: item.priceCategory?.id,
      ...item,
    };
  };

  const onSelectChangeSelf = (newSelection) => {
    onSelectChange?.(newSelection.map((id) => items.find((item) => item.id === id)));
  };

  const onDeleteItemButtonClick = (item) => {
    setItemToDelete(item);
    setIsDeleteItemModalOpen(true);
  };

  const onDeleteItemModalClose = () => {
    setItemToDelete(null);
    setIsDeleteItemModalOpen(false);
    setDetailsItem(null);
  };

  const showDetails = (item) => {
    setDetailsItem(item);
  };

  const performDeleteItem = () => {
    setIsDeleting(true);
    deleteItem([itemToDelete.id]).unwrap()
      .then(() => {
        toast.success('Товар удален');
        onItemDeleted?.(itemToDelete);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении товара');
      })
      .finally(() => {
        setIsDeleting(false);
        onDeleteItemModalClose();
      });
  };

  const columns = [
    {
      field: 'images',
      headerName: '',
      width: 40,
      renderCell: (params) => <ImageCell images={params.value} />,
    },
    {
      field: 'name',
      headerName: 'Название',
      flex: 1,
      editable: true,
    },
    {
      field: 'priceCategory',
      headerName: 'Ценовая категория',
      flex: 0.5,
      type: 'singleSelect',
      valueOptions: priceCategories?.map((priceCategory) => ({
        value: priceCategory.id,
        label: priceCategory.alias,
      }) ?? []),
      valueFormatter: ({ value }) => priceCategories?.find((priceCategory) => priceCategory.id === value)?.alias ?? '',
      renderCell: (isFetching ? (() => <Skeleton variant="rounded" width="100%" height={42} />) : ((params) => params.value?.alias)),
      editable: true,
    },
    {
      field: 'upca',
      headerName: 'UPC-A',
      width: 150,
      editable: true,
    },
    {
      field: 'upc5',
      headerName: 'UPC-5',
      width: 150,
      editable: true,
    },
    {
      field: 'parseStatus',
      headerName: 'Статус',
      width: 90,
      renderCell: (params) => <StatusBadge theme={theme} status={params.value} />,
    },
    {
      field: 'createdAt',
      hide: true,
    },
    {
      field: 'actions',
      type: 'actions',
      width: 40,
      getActions: ({ row }) => [
        <GridActionsCellItem icon={<RemoveRedEyeOutlinedIcon />} onClick={() => showDetails(row)} label="Детали" showInMenu />,
        <GridActionsCellItem icon={<DeleteOutlinedIcon />} onClick={() => onDeleteItemButtonClick(row)} label="Удалить" showInMenu color="error" />,
      ]
    },
  ];

  return (
    <Box sx={{ position: 'relative', width: '100%', height: 'calc(100vh - 260px)' }}>
      {isUpdating && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          backdropFilter: 'blur(8px)',
        }}></div>
      )}
      <DataGrid
        initialState={{
          sorting: {
            sortModel: [{ field: 'createdAt', sort: 'desc' }]
          }
        }}
        rows={items}
        columns={columns}
        checkboxSelection
        disableSelectionOnClick
        disableColumnMenu
        loading={isUpdating}
        experimentalFeatures={{ newEditingApi: true }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        processRowUpdate={onRowUpdate}
        onSelectionModelChange={onSelectChangeSelf}
      />
      <SupplyDetails
        item={detailsItem}
        onClose={() => setDetailsItem(null)}
        onDelete={() => onDeleteItemButtonClick(detailsItem)}
      />
      <Dialog open={isDeleteItemModalOpen} onClose={onDeleteItemModalClose}>
        <DialogTitle fontSize={24}>Удалить товар?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить товар? Все загруженные изображения и связанная с ними информация также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteItemModalClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={performDeleteItem}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default SupplySession;
