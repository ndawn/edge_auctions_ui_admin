import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Skeleton } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, ruRU } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useToast } from 'use-toast-mui';

import {
  useDeletePriceCategoryMutation,
  useListPriceCategoriesQuery,
  useUpdatePriceCategoryMutation,
} from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';
import PriceCategoryCreateForm from 'ui-component/price-categories/price-category-create-form';

const PriceCategoriesView = () => {
  const theme = useTheme();
  const toast = useToast();

  const { data: priceCategories, isFetching, refetch } = useListPriceCategoriesQuery();
  const [ updatePriceCategory, updatePriceCategoryResult ] = useUpdatePriceCategoryMutation();
  const [ deletePriceCategory, deletePriceCategoryResult ] = useDeletePriceCategoryMutation();

  const [ isCreateMenuOpen, setIsCreateMenuOpen ] = useState(false);
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
  const [ priceCategoriesToDelete, setPriceCategoriesToDelete ] = useState([]);
  const [ selection, setSelection ] = useState([]);
  const [ isDeleting, setIsDeleting ] = useState(false);

  const updateableFields = [
    'alias',
    'usd',
    'rub',
    'buyNowPrice',
    'buyNowExpires',
    'bidStartPrice',
    'bidMinStep',
    'bidMultipleOf',
  ];

  const onRowUpdate = async (newRow, oldRow) => {
    const changedFields = updateableFields.filter((field) => oldRow[field] !== newRow[field]);
    const updateBody = Object.fromEntries(changedFields.map((field) => [field, newRow[field]]));

    let priceCategory;

    try {
      priceCategory = await updatePriceCategory({ id: newRow.id, ...updateBody }).unwrap();
    } catch (err) {
      console.error(err);
      if (err.status === 422) {
        toast.error(`Ошибка при обновлении значения: ${err?.data?.message ?? ''}`);
      } else {
        toast.error('Ошибка при обновлении значения');
      }
      return oldRow;
    }

    refetch();

    return priceCategory;
  };

  const openCreateMenu = () => {
    setIsCreateMenuOpen(true);
  };

  const onCreateMenuClose = (result) => {
    setIsCreateMenuOpen(false);

    result && refetch();
  };

  const onSelectChange = (newSelection) => {
    setSelection(newSelection.map((id) => priceCategories.find((priceCategory) => priceCategory.id === id)));
  };

  const onDeleteButtonClick = (item) => {
    setPriceCategoriesToDelete([item]);
    setIsDeleteModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setPriceCategoriesToDelete([]);
    setIsDeleteModalOpen(false);
  };

  const performDeletePriceCategory = () => {
    setIsDeleting(true);

    deletePriceCategory(priceCategoriesToDelete.map((priceCategory) => priceCategory.id)).unwrap()
      .then(() => {
        toast.success('Ценовые категории удалены');
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении ценовых категорий');
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
      field: 'alias',
      headerName: 'Название',
      flex: 1,
      editable: true,
    },
    {
      field: 'usd',
      headerName: 'Цена в долларах',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'rub',
      headerName: 'Цена в рублях',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'buyNowPrice',
      headerName: 'Стоимость выкупа',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'buyNowExpires',
      headerName: 'Выкуп доступен до',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'bidStartPrice',
      headerName: 'Начальная ставка',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'bidMinStep',
      headerName: 'Минимальный шаг ставки',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'bidMultipleOf',
      headerName: 'Кратность ставки',
      flex: 0.5,
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
      title="Ценовые категории"
      headerSX={{ height: '77px' }}
      contentSX={{ height: 'calc(100vh - 210px)' }}
      secondary={[
        selection.length > 0 && <Button key="delete" color="error" onClick={onDeleteButtonClick} sx={{ mr: 1 }}>Удалить выбранные</Button>,
        <Button key="create" disableElevation onClick={openCreateMenu}>Создать</Button>,
      ]}
    >
      <DataGrid
        rows={priceCategories ?? []}
        columns={columns}
        disableColumnMenu
        loading={isFetching}
        experimentalFeatures={{ newEditingApi: true }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        processRowUpdate={onRowUpdate}
        onProcessRowUpdateError={(err) => console.error(err)}
        onSelectionModelChange={onSelectChange}
      />

      <PriceCategoryCreateForm open={isCreateMenuOpen} onClose={onCreateMenuClose} />

      <Dialog open={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <DialogTitle fontSize={24}>Удалить ценовые категории?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить ценовые категории? Все связанные с ними данные также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteModalClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={performDeletePriceCategory}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default PriceCategoriesView;
