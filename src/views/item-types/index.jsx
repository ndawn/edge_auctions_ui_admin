import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, ruRU } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useToast } from 'use-toast-mui';

import {
  useDeleteItemTypeMutation,
  useListItemTypesQuery,
  useListPriceCategoriesQuery,
  useListTemplatesQuery,
  useUpdateItemTypeMutation,
} from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';
import ItemTypeCreateForm from 'ui-component/item-types/item-type-create-form';

const ItemTypesView = () => {
  const theme = useTheme();
  const toast = useToast();

  const { data: itemTypes, isFetching, refetch } = useListItemTypesQuery();
  const { data: priceCategories, isPriceCategoriesFetching } = useListPriceCategoriesQuery();
  const { data: templates, isTemplatesFetching } = useListTemplatesQuery();
  const [ updateItemType, updateItemTypeResult ] = useUpdateItemTypeMutation();
  const [ deleteItemType, deleteItemTypeResult ] = useDeleteItemTypeMutation();

  const [ isCreateMenuOpen, setIsCreateMenuOpen ] = useState(false);
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
  const [ itemTypesToDelete, setItemTypesToDelete ] = useState([]);
  const [ selection, setSelection ] = useState([]);
  const [ isDeleting, setIsDeleting ] = useState(false);

  const updateableFields = [
    'name',
    'priceCategory',
    'wrapTo',
  ];

  const onRowUpdate = async (newRow, oldRow) => {
    const changedFields = updateableFields.filter((field) => oldRow[field] !== newRow[field]);
    const updateBody = Object.fromEntries(changedFields.map((field) => [field, newRow[field]]));

    if ('priceCategory' in updateBody) {
      updateBody.priceCategoryId = updateBody.priceCategory;
      delete updateBody.priceCategory;
    }

    if ('wrapTo' in updateBody) {
      updateBody.wrapToId = updateBody.wrapTo;
      delete updateBody.wrapTo;
    }

    const itemType = await updateItemType({ id: newRow.id, ...updateBody }).unwrap();

    refetch();

    return {
      priceCategoryId: itemType.priceCategory?.id,
      priceCategory: itemType.priceCategory?.id,
      wrapToId: itemType.wrapTo?.id,
      wrapTo: itemType.wrapTo?.id,
      ...itemType,
    };
  };

  const openCreateMenu = () => {
    setIsCreateMenuOpen(true);
  };

  const onCreateMenuClose = (result) => {
    setIsCreateMenuOpen(false);

    result && refetch();
  };

  const onSelectChange = (newSelection) => {
    setSelection(newSelection.map((id) => itemTypes.find((itemType) => itemType.id === id)));
  };

  const onDeleteButtonClick = (item) => {
    setItemTypesToDelete([item]);+
    setIsDeleteModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setItemTypesToDelete([]);
    setIsDeleteModalOpen(false);
  };

  const performDeleteItemType = () => {
    setIsDeleting(true);

    deleteItemType(itemTypesToDelete.map((itemType) => itemType.id)).unwrap()
      .then(() => {
        toast.success('Категории удалены');
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении категорий');
      })
      .finally(() => {
        setIsDeleting(false);
        onDeleteModalClose();
      });
  };

  const columns = [
    {
      field: 'id',
      headerName: 'ID',
      width: 40,
    },
    {
      field: 'name',
      headerName: 'Название',
      flex: 1,
      editable: true,
    },
    {
      field: 'priceCategory',
      headerName: 'Ценовая категория по умолчанию',
      flex: 0.5,
      type: 'singleSelect',
      valueOptions: priceCategories?.map((priceCategory) => ({
        value: priceCategory.id,
        label: priceCategory.alias,
      }) ?? []),
      valueFormatter: ({ value }) => priceCategories?.find((priceCategory) => priceCategory.id === value)?.alias ?? '—',
      renderCell: (isPriceCategoriesFetching ? (() => <Skeleton variant="rounded" width="100%" height={42} />) : ((params) => params.value?.alias)),
      editable: true,
    },
    {
      field: 'wrapTo',
      headerName: 'Шаблон по умолчанию',
      flex: 0.5,
      type: 'singleSelect',
      disabled: true,
      valueOptions: templates?.map((template) => ({
        value: template.id,
        label: template.alias,
      }) ?? []),
      valueFormatter: ({ value }) => templates?.find((template) => template.id === value)?.alias ?? '—',
      renderCell: (isTemplatesFetching ? (() => <Skeleton variant="rounded" width="100%" height={42} />) : ((params) => params.value?.alias)),
      editable: true,
    },
    {
      field: 'actions',
      type: 'actions',
      width: 40,
      getActions: ({ row }) => [
        <GridActionsCellItem icon={<DeleteOutlinedIcon />} onClick={() => onDeleteButtonClick(row)} label="Удалить" color="error" />,
      ]
    },
  ];

  return (
    <MainCard
      title="Категории"
      headerSX={{ height: '77px' }}
      contentSX={{ height: 'calc(100vh - 210px)' }}
      secondary={[
        selection.length > 0 && <Button key="delete" color="error" onClick={onDeleteButtonClick} sx={{ mr: 1 }}>Удалить выбранные</Button>,
        <Button key="create" disableElevation onClick={openCreateMenu}>Создать</Button>,
      ]}
    >
      <DataGrid
        rows={itemTypes ?? []}
        columns={columns}
        disableColumnMenu
        loading={isFetching}
        experimentalFeatures={{ newEditingApi: true }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        processRowUpdate={onRowUpdate}
        onProcessRowUpdateError={(err) => console.error(err)}
        onSelectionModelChange={onSelectChange}
      />
      <ItemTypeCreateForm
        priceCategories={priceCategories}
        templates={templates}
        open={isCreateMenuOpen}
        onClose={onCreateMenuClose}
      />
      <Dialog open={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <DialogTitle fontSize={24}>Удалить категории?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить категории? Все товары в этих категориях также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteModalClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={performDeleteItemType}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default ItemTypesView;
