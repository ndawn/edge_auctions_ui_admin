import { useMemo, useState } from 'react';

import { Button, FormControl, InputLabel, MenuItem, Paper, Select, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useToast } from 'use-toast-mui';

import { useCreateItemTypeMutation } from 'store/slices/api';
import SidebarForm from 'ui-component/sidebar-form';

const ItemTypeCreateForm = ({ priceCategories, templates, open, onClose }) => {
  const theme = useTheme();
  const toast = useToast();

  const [ createItemType, createItemTypeResult ] = useCreateItemTypeMutation();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ name, setName ] = useState('');
  const [ priceCategoryId, setPriceCategoryId ] = useState(0);
  const [ wrapToId, setWrapToId ] = useState(0);

  const createBody = useMemo(() => ({
    name,
    priceCategoryId: priceCategoryId !== 0 ? priceCategoryId : null,
    wrapToId: wrapToId !== 0 ? wrapToId : null,
  }), [name, priceCategoryId, wrapToId]);

  const isSubmitButtonDisabled = useMemo(() => name === '', [name]);

  const onCloseSelf = (result) => {
    setName('');
    setPriceCategoryId(0);
    setWrapToId(0);
    onClose?.(result);
  };

  const performCreateItemType = () => {
    setIsLoading(true);

    createItemType(createBody).unwrap()
      .then((result) => {
        toast.success('Категория создана');
        onCloseSelf(result);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при создании категории');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SidebarForm
      title="Создание категории"
      open={open}
      isLoading={isLoading}
      onClose={onCloseSelf}
      bottom={
        <Tooltip title={isSubmitButtonDisabled ? 'Для создания категории необходимо заполнить форму' : ''}>
          <span>
            <Button variant="contained" disableElevation disabled={isSubmitButtonDisabled} onClick={performCreateItemType}>Создать</Button>
          </span>
        </Tooltip>
      }
    >
      <Paper elevation={0} sx={{ px: 4 }}>
        <TextField fullWidth label="Название" value={name} required onChange={(event) => setName(event.target.value)} />
        <FormControl fullWidth sx={{ mt: 4 }}>
          <InputLabel id="price-category-id">Ценовая категория</InputLabel>
          <Select labelId="price-category-id" label="Ценовая категория" value={priceCategoryId}>
            <MenuItem value={0} onClick={() => setPriceCategoryId(0)}>--------</MenuItem>
            {priceCategories?.map((priceCategory) => (
              <MenuItem key={priceCategory.id} value={priceCategory.id} onClick={() => setPriceCategoryId(priceCategory.id)}>{priceCategory.alias}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl fullWidth sx={{ mt: 4 }}>
          <InputLabel id="wrap-to-id">Шаблон по умолчанию</InputLabel>
          <Select labelId="wrap-to-id" label="Шаблон по умолчанию" value={wrapToId}>
            <MenuItem value={0} onClick={() => setWrapToId(0)}>--------</MenuItem>
            {templates?.map((template) => (
              <MenuItem key={template.id} value={template.id} onClick={() => setWrapToId(template.id)}>{template.alias}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Paper>
    </SidebarForm>
  );
};

export default ItemTypeCreateForm;
