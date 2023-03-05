import { useEffect, useMemo, useState } from 'react';

import {
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  TextField,
  Typography,
} from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { useToast } from 'use-toast-mui';

import { useListPriceCategoriesQuery, useListTemplatesQuery, useUpdateItemMutation } from 'store/slices/api';
import SidebarForm from 'ui-component/sidebar-form';

const SupplyDetails = ({ item, onClose, onDelete }) => {
  const theme = useTheme();
  const toast = useToast();

  const { data: priceCategories, isFetching: isPriceCategoriesFetching } = useListPriceCategoriesQuery();
  const { data: templates, isFetching: isTemplatesFetching } = useListTemplatesQuery();
  const [ updateItem, updateItemResult ] = useUpdateItemMutation();

  const [ isLoading, setIsLoading ] = useState(false);

  const [ name, setName ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ priceCategoryId, setPriceCategoryId ] = useState(0);
  const [ upca, setUpca ] = useState('');
  const [ upc5, setUpc5 ] = useState('');

  const isDetailsDrawerOpen = useMemo(() => item !== null, [item]);
  const isSubmitButtonDisabled = useMemo(() => false, [item]);

  const updateArgs = useMemo(() => {    
    if (item === null) {
      return {};
    }

    const args = { id: item.id };

    for (let [ field, value ] of Object.entries({ name, description, upca, upc5 })) {
      if (item[field] !== value) {
        args[field] = value;
      }
    }

    if (priceCategoryId === 0 && item.priceCategory !== null) {
      args.priceCategoryId = null;
    } else if (priceCategoryId !== 0 && priceCategoryId !== item.priceCategory?.id) {
      args.priceCategoryId = priceCategoryId;
    }

    return args;
  }, [item, name, description, priceCategoryId, upca, upc5]);

  useEffect(() => {
    if (item !== null) {
      setName(item.name);
      setDescription(item.description);
      setPriceCategoryId(item.priceCategory?.id || 0);
      setUpca(item.upca);
      setUpc5(item.upc5);
    } else {
      setName('');
      setDescription('');
      setPriceCategoryId(0);
      setUpca('');
      setUpc5('');
    }
  }, [item]);

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const onPriceCategoryChange = (event) => {
    setPriceCategoryId(event.target.value);
  };

  const onUpcaChange = (event) => {
    setUpca(event.target.value);
  };

  const onUpc5Change = (event) => {
    setUpc5(event.target.value);
  };

  const performUpdateItem = () => {
    setIsLoading(true);

    updateItem(updateArgs).unwrap()
      .then((result) => toast.success('Товар обновлен'))
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при обновлении товара');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SidebarForm
      title="Детали товара"
      open={isDetailsDrawerOpen}
      isLoading={isLoading}
      onClose={() => onClose?.(false)}
      bottom={[
        <Button key="update" variant="contained" disableElevation disabled={isSubmitButtonDisabled} onClick={performUpdateItem}>Обновить</Button>,
        <Button key="delete" color="error" disableElevation onClick={() => onDelete?.()} sx={{ ml: 2 }}>Удалить</Button>,
      ]}
    >
      <div
        style={{
          marginBottom: '32px',
          height: '256px',
          overflowX: 'scroll',
          overflowY: 'visible',
        }}
      >
        <div
          style={{
            display: 'flex',
            height: '100%',
            gap: '16px',
            padding: '0 32px 8px',
          }}
        >
          {item && item.images.map((image) => (
            <img
              key={image.id}
              src={`/${image.urls.full}`}
              style={{
                display: 'block',
                height: '100%',
                flexShrink: '0',
                flexGrow: '0',
                borderRadius: '8px',
              }}
            />
          ))}
        </div>
      </div>
      <Grid container spacing={2} px={4}>
        <Grid xs={12}>
          <FormControl fullWidth required>
            <TextField id="name" label="Название" variant="outlined" required value={name} onChange={onNameChange} />
          </FormControl>
        </Grid>
        <Grid xs={6}>
          <Typography variant="caption">Категория</Typography>
          <Typography variant="body1">{item?.type?.name || '—'}</Typography>
        </Grid>
        <Grid xs={6}>
          {!isPriceCategoriesFetching && priceCategories !== undefined ? (
            <FormControl fullWidth required>
              <InputLabel id="price-category-id">Ценовая категория</InputLabel>
              <Select labelId="price-category-id" label="Ценовая категория" required value={priceCategoryId} onChange={onPriceCategoryChange}>
                <MenuItem value={0}>-----------</MenuItem>
                {priceCategories.map((priceCategory) => <MenuItem value={priceCategory.id} key={priceCategory.id}>{priceCategory.alias}</MenuItem>)}
              </Select>
            </FormControl>
          ): <Skeleton variant="rounded" height={50} />}
        </Grid>
        <Grid xs={6}>
          <FormControl fullWidth>
            <TextField id="upca" label="UPC-A" variant="outlined" value={upca} onChange={onUpcaChange} />
          </FormControl>
        </Grid>
        <Grid xs={6}>
          <FormControl fullWidth>
            <TextField id="upc5" label="UPC-5" variant="outlined" value={upc5} onChange={onUpc5Change} />
          </FormControl>
        </Grid>
        <Grid xs={12}>
          <FormControl fullWidth>
            <TextField
              id="description"
              multiline
              minRows={3}
              maxRows={6}
              label="Описание"
              variant="outlined"
              value={description}
              onChange={onDescriptionChange}
              inputProps={{
                style: { fontFamily: 'monospace' }
              }}
            />
          </FormControl>
        </Grid>
      </Grid>
    </SidebarForm>
  );
};

export default SupplyDetails;
