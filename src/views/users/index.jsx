import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, ruRU } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useToast } from 'use-toast-mui';

import {
  useDeleteUserMutation,
  useListUsersQuery,
  useUpdateUserMutation,
} from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';

const UsersView = () => {
  const theme = useTheme();
  const toast = useToast();

  const { data: users, isFetching, refetch } = useListUsersQuery();
  const [ updateUser, updateUserResult ] = useUpdateUserMutation();
  const [ deleteUser, deleteUserResult ] = useDeleteUserMutation();

  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
  const [ usersToDelete, setUsersToDelete ] = useState([]);
  const [ selection, setSelection ] = useState([]);
  const [ isDeleting, setIsDeleting ] = useState(false);

  const updateableFields = [
    'shopId',
    'email',
    'firstName',
    'lastName',
    'isAdmin',
    'isBanned',
  ];

  const onRowUpdate = async (newRow, oldRow) => {
    const changedFields = updateableFields.filter((field) => oldRow[field] !== newRow[field]);
    const updateBody = Object.fromEntries(changedFields.map((field) => [field, newRow[field]]));

    let user;

    try {
      user = await updateUser({ id: newRow.id, ...updateBody }).unwrap();
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

    return user;
  };

  const onSelectChange = (newSelection) => {
    setSelection(newSelection.map((id) => users.find((user) => user.id === id)));
  };

  const onDeleteButtonClick = (item) => {
    setUsersToDelete([item]);
    setIsDeleteModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setUsersToDelete([]);
    setIsDeleteModalOpen(false);
  };

  const performDeleteUser = () => {
    setIsDeleting(true);

    deleteUser(usersToDelete.map((user) => user.id)).unwrap()
      .then(() => {
        toast.success('Пользователь удален');
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении пользователя');
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
      flex: 0.4,
    },
    {
      field: 'shopId',
      headerName: 'ID в магазине',
      editable: true,
      flex: 0.2,
    },
    {
      field: 'email',
      headerName: 'Почта',
      editable: true,
      flex: 0.5,
    },
    {
      field: 'firstName',
      headerName: 'Имя',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'lastName',
      headerName: 'Фамилия',
      flex: 0.5,
      editable: true,
    },
    {
      field: 'isAdmin',
      headerName: 'Администратор',
      flex: 0.3,
      type: 'boolean',
      editable: true,
    },
    {
      field: 'isBanned',
      headerName: 'Забанен',
      flex: 0.2,
      type: 'boolean',
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
      title="Пользователи"
      headerSX={{ height: '77px' }}
      contentSX={{ height: 'calc(100vh - 210px)' }}
      secondary={[
        selection.length > 0 && <Button key="delete" color="error" onClick={onDeleteButtonClick} sx={{ mr: 1 }}>Удалить выбранные</Button>,
      ]}
    >
      <DataGrid
        rows={users ?? []}
        columns={columns}
        disableColumnMenu
        loading={isFetching}
        experimentalFeatures={{ newEditingApi: true }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        processRowUpdate={onRowUpdate}
        onProcessRowUpdateError={(err) => console.error(err)}
        onSelectionModelChange={onSelectChange}
      />

      <Dialog open={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <DialogTitle fontSize={24}>Удалить пользователя?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить пользователя? Все связанные с ним данные также будут удалены.</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteModalClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={performDeleteUser}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default UsersView;
