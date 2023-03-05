import { useState } from 'react';

import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { LoadingButton } from '@mui/lab';
import { useTheme } from '@mui/material/styles';
import { DataGrid, GridActionsCellItem, ruRU } from '@mui/x-data-grid';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import { useToast } from 'use-toast-mui';

import {
  useDeleteTemplateMutation,
  useListTemplatesQuery,
  useUpdateTemplateMutation,
} from 'store/slices/api';
import MainCard from 'ui-component/cards/MainCard';
import TemplateCreateForm from 'ui-component/templates/template-create-form';
import EditTextarea from 'ui-component/edit-textarea';

const TemplatesView = () => {
  const theme = useTheme();
  const toast = useToast();

  const { data: templates, isFetching, refetch } = useListTemplatesQuery();
  const [ updateTemplate, updateTemplateResult ] = useUpdateTemplateMutation();
  const [ deleteTemplate, deleteTemplateResult ] = useDeleteTemplateMutation();

  const [ isCreateMenuOpen, setIsCreateMenuOpen ] = useState(false);
  const [ isDeleteModalOpen, setIsDeleteModalOpen ] = useState(false);
  const [ templatesToDelete, setTemplatesToDelete ] = useState([]);
  const [ selection, setSelection ] = useState([]);
  const [ isDeleting, setIsDeleting ] = useState(false);

  const updateableFields = [
    'alias',
    'text',
  ];

  const onRowUpdate = async (newRow, oldRow) => {
    const changedFields = updateableFields.filter((field) => oldRow[field] !== newRow[field]);
    const updateBody = Object.fromEntries(changedFields.map((field) => [field, newRow[field]]));

    let template;

    try {
      template = await updateTemplate({ id: newRow.id, ...updateBody }).unwrap();
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

    return template;
  };

  const openCreateMenu = () => {
    setIsCreateMenuOpen(true);
  };

  const onCreateMenuClose = (result) => {
    setIsCreateMenuOpen(false);

    result && refetch();
  };

  const onSelectChange = (newSelection) => {
    setSelection(newSelection.map((id) => templates.find((template) => template.id === id)));
  };

  const onDeleteButtonClick = (item) => {
    setTemplatesToDelete([item]);
    setIsDeleteModalOpen(true);
  };

  const onDeleteModalClose = () => {
    setTemplatesToDelete([]);
    setIsDeleteModalOpen(false);
  };

  const performDeleteTemplate = () => {
    setIsDeleting(true);

    deleteTemplate(templatesToDelete.map((template) => template.id)).unwrap()
      .then(() => {
        toast.success('Шаблоны удалены');
        refetch();
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при удалении шаблонов');
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
      flex: 0.5,
      editable: true,
    },
    {
      field: 'text',
      headerName: 'Текст шаблона',
      flex: 1,
      editable: true,
      renderEditCell: (params) => (
        <EditTextarea
          {...params}
          minRows={6}
          maxRows={12}
          inputProps={{ style: { fontFamily: 'monospace' } }}
        />
      ),
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
      title="Шаблоны"
      headerSX={{ height: '77px' }}
      contentSX={{ height: 'calc(100vh - 210px)' }}
      secondary={[
        selection.length > 0 && <Button key="delete" color="error" onClick={onDeleteButtonClick} sx={{ mr: 1 }}>Удалить выбранные</Button>,
        <Button key="create" disableElevation onClick={openCreateMenu}>Создать</Button>,
      ]}
    >
      <DataGrid
        rows={templates ?? []}
        columns={columns}
        disableColumnMenu
        loading={isFetching}
        experimentalFeatures={{ newEditingApi: true }}
        localeText={ruRU.components.MuiDataGrid.defaultProps.localeText}
        processRowUpdate={onRowUpdate}
        onProcessRowUpdateError={(err) => console.error(err)}
        onSelectionModelChange={onSelectChange}
      />

      <TemplateCreateForm open={isCreateMenuOpen} onClose={onCreateMenuClose} />

      <Dialog open={isDeleteModalOpen} onClose={onDeleteModalClose}>
        <DialogTitle fontSize={24}>Удалить шаблоны?</DialogTitle>
        <DialogContent>
          <DialogContentText>Вы действительно хотите удалить выбранные шаблоны?</DialogContentText>
        </DialogContent>
        <DialogActions sx={{ padding: '0 24px 20px' }}>
          <Button variant="contained" onClick={onDeleteModalClose} autoFocus>Отменить</Button>
          <LoadingButton color="error" loading={isDeleting} onClick={performDeleteTemplate}>Удалить</LoadingButton>
        </DialogActions>
      </Dialog>
    </MainCard>
  );
};

export default TemplatesView;
