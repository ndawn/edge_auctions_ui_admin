import { useEffect, useMemo, useState } from 'react';

import {
  Box,
  Button,
  Paper,
  Radio,
  Tooltip,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useToast } from 'use-toast-mui';

import { useJoinItemsMutation } from 'store/slices/api';
import SidebarForm from 'ui-component/sidebar-form';

const SupplyJoin = ({ items, onClose }) => {
  const theme = useTheme();
  const toast = useToast();

  const [ joinItems, joinItemsResult ] = useJoinItemsMutation();

  const [ formDrawerOpen, setFormDrawerOpen ] = useState(false);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ itemToKeep, setItemToKeep ] = useState(null);
  const [ imageIdsToKeep, setImageIdsToKeep ] = useState([]);
  const [ mainImage, setMainImage ] = useState(null);

  useEffect(() => {
    setFormDrawerOpen(items && items.length === 2);
  }, [items]);

  const images = useMemo(() => items?.[0]?.images?.concat(items?.[1]?.images ?? []) ?? [], [items]);

  const isSubmitButtonDisabled = useMemo(() => (
    itemToKeep === null
    || imageIdsToKeep.length === 0
    || mainImage === null
  ), [itemToKeep, imageIdsToKeep, mainImage]);

  const getImageIndex = (image) => {
    for (let i = 0; i < images.length; i++) {
      if (images[i].id === image.id) {
        return i;
      }
    }
  
    return -1;
  };

  const isImageSelected = (targetImage) => !!imageIdsToKeep.find((imageId) => imageId === targetImage.id);

  const toggleImage = (targetImage) => {
    const copy = imageIdsToKeep.slice();

    const imageIndex = copy.indexOf(targetImage.id);

    if (imageIndex !== -1) {
      copy.splice(copy.indexOf(targetImage.id), 1);

      if (mainImage?.id === targetImage.id) {
        setMainImage(null);
      }
    } else {
      copy.push(targetImage.id);
    }

    setImageIdsToKeep(copy);
  };

  const onMainImageButtonClick = (event, image) => {
    event.stopPropagation();
    selectMainImage(image);
  };

  const selectMainImage = (targetImage) => {
    setMainImage(targetImage);
  };

  const selectItem = (selectedItem) => {
    setItemToKeep(selectedItem);
  };

  const performJoinItems = () => {
    const formData = {
      itemToKeepId: itemToKeep.id,
      itemToDropId: items.find((item) => item.id !== itemToKeep.id).id,
      imageIds: imageIdsToKeep,
      mainImageId: mainImage.id,
    };

    setIsLoading(true);

    joinItems(formData).unwrap()
      .then((result) => {
        toast.success('Товары объединены');
        onClose?.(true);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при объединении товаров');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SidebarForm
      title="Объединение товаров"
      open={formDrawerOpen}
      isLoading={isLoading}
      onClose={() => onClose?.(false)}
      bottom={
        <Tooltip title={isSubmitButtonDisabled ? 'Для объединения товаров необходимо заполнить форму' : ''}>
          <span>
            <Button variant="contained" disableElevation disabled={isSubmitButtonDisabled} onClick={performJoinItems}>Объединить товары</Button>
          </span>
        </Tooltip>
      }
    >
      <div
        style={{
          marginBottom: '64px',
          height: '324px',
          overflowX: 'scroll',
          overflowY: 'visible',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '256px',
            gap: '16px',
            padding: '0 32px',
          }}
        >
          {images.map((image) => (
            <div
              key={image.id}
              onClick={() => toggleImage(image)}
              style={{ height: '100%', flexShrink: '0', flexGrow: '0' }}
            >
              <img
                src={`/${image.urls.full}`}
                style={{
                  display: 'block',
                  height: '100%',
                  borderRadius: '8px',
                  borderWidth: '2px',
                  borderStyle: 'solid',
                  borderColor: isImageSelected(image) ? theme.palette.primary.main : theme.palette.dark.light,
                  cursor: 'pointer',
                }}
              />
              {isImageSelected(image) && (
                <Button
                  sx={{ mt: 1 }}
                  fullWidth
                  disableElevation
                  variant={image.id === mainImage?.id ? 'contained' : 'outlined'}
                  onClick={(event) => onMainImageButtonClick(event, image)}
                >Главное</Button>
              )}
            </div>
          ))}
        </div>
      </div>
      {items && items.map((item) => (
        <Paper
          key={item.id}
          elevation={0}
          onClick={() => selectItem(item)}
          sx={{
            display: 'flex',
            mx: 4,
            my: 2,
            p: 2,
            border: `1px solid ${itemToKeep?.id === item.id ? theme.palette.primary.light : theme.palette.grey[200]}`,
            cursor: 'pointer',
          }}
        >
          <Radio
            checked={itemToKeep?.id === item.id}
            onChange={() => selectItem(item)}
            value={item.id}
            name="itemToKeep"
          />
          <Box>
            <Typography variant="h4">Название: {item.name || '—'}</Typography>
            <Typography variant="caption">UPC-A: {item.upca || '—'}; UPC-5: {item.upc5 || '—'}</Typography>
          </Box>
        </Paper>
      ))}
    </SidebarForm>
  );
};

export default SupplyJoin;
