import { useMemo, useState } from 'react';

import { Box, Button, CircularProgress, Tooltip, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@mui/material/styles';
import { useToast } from 'use-toast-mui';

import FullPageMessage from 'ui-component/full-page-message';
import SidebarForm from 'ui-component/sidebar-form';
import SupplyCreateForm from 'ui-component/supply/supply-create-form';
import { useBulkCreateImagesMutation, useCreateSupplySessionMutation } from 'store/slices/api';

const SupplyCreate = ({ onCreated }) => {
  const theme = useTheme();
  const toast = useToast();

  const [ bulkCreateImages, bulkCreateImagesResult ] = useBulkCreateImagesMutation();
  const [ createSupplySession, createSupplySessionResult ] = useCreateSupplySessionMutation();

  const [ formDrawerOpen, setFormDrawerOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ formData, setFormData ] = useState(null);
  const [ uploadedFilesCount, setUploadedFilesCount ] = useState(null);

  const openFormDrawer = () => {
    setFormDrawerOpen(true);
  };

  const closeFormDrawer = () => {
    setFormDrawerOpen(false);
  };

  const onFormChange = (data) => {
    setFormData(data);
  };

  const isSubmitButtonDisabled = useMemo(() => !(
    formData?.itemTypeId !== null
    && formData?.files?.length > 0
  ), [formData]);

  const uploadProgress = useMemo(() => (
    uploadedFilesCount !== null
    ? Math.round(100 * uploadedFilesCount / (formData?.files?.length ?? 1))
    : null
  ), [uploadedFilesCount, formData]);

  const uploadSingleFile = (file) => {
    return new Promise((resolve, reject) => {
      bulkCreateImages([file]).unwrap()
        .then((result) => {
          setUploadedFilesCount(uploadedFilesCount + 1);
          resolve(result);
        })
        .catch((err) => reject(err));
    });
  };

  const handleCreateSession = (images) =>
    createSupplySession({
      itemTypeId: formData.itemTypeId,
      imageIds: images.map((image) => image[0].id),
    }).unwrap()
      .then((response) => {
        toast.success('Сессия создана');
        onCreated?.(response);
      })
      .catch((error) => console.error(error))
      .finally(() => {
        setIsLoading(false);
        setUploadedFilesCount(null);
      });

  const createSession = () => {
    setIsLoading(true);

    Promise.all(formData.files.map(uploadSingleFile))
      .then((images) => handleCreateSession(images))
      .catch((err) => {
        console.error(err);
        toast.error('При загрузке изображений произошла ошибка');
        setIsLoading(false);
      })
      .finally(() => setUploadedFilesCount(null));
  };

  return <>
    <FullPageMessage
      title="Нет активной сессии"
      description="Текущая активная сессия отсутствует, но вы можете создать новую, нажав на кнопку ниже"
      button={
        <Button variant="contained" disableElevation onClick={openFormDrawer}>
          <AddIcon />
          Создать новую сессию
        </Button>
      }
    />
    <SidebarForm
      title="Создание новой сессии"
      open={formDrawerOpen}
      isLoading={isLoading}
      onClose={closeFormDrawer}
      bottom={
        <Tooltip title={isSubmitButtonDisabled ? 'Для создания сессии необходимо заполнить форму' : ''}>
          <span>
            <Button variant="contained" disableElevation disabled={isSubmitButtonDisabled} onClick={createSession}>Создать</Button>
          </span>
        </Tooltip>
      }
      loadingLayout={
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'absolute',
            top: '0',
            left: '0',
            zIndex: theme.zIndex.drawer + 1,
            width: '100%',
            height: '100%',
            backdropFilter: 'blur(8px)',
          }}
        >
          <Box sx={{ position: 'relative', display: 'inline-flex' }}>
            <CircularProgress
              size={64}
              variant={uploadProgress !== null ? 'determinate' : 'indeterminate'}
              value={uploadProgress ?? 0}
            />
            <Box
              sx={{
                top: 0,
                left: 0,
                bottom: 0,
                right: 0,
                position: 'absolute',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {uploadProgress !== null && (
                <Typography variant="subtitle1" component="div" color="text.secondary">
                  {`${uploadProgress}%`}
                </Typography>
              )}
            </Box>
          </Box>
        </Box>
      }
    >
      <SupplyCreateForm onChange={onFormChange} />
    </SidebarForm>
  </>;
};

export default SupplyCreate;
