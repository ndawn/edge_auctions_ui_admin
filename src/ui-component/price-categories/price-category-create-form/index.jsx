import { useMemo, useState } from 'react';

import { Button, Paper, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useToast } from 'use-toast-mui';
import * as yup from 'yup';

import { useCreatePriceCategoryMutation } from 'store/slices/api';
import SidebarForm from 'ui-component/sidebar-form';

const PriceCategoryCreateForm = ({ open, onClose }) => {
  const theme = useTheme();
  const toast = useToast();

  const [ createPriceCategory, createPriceCategoryResult ] = useCreatePriceCategoryMutation();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ alias, setAlias ] = useState('');
  const [ usd, setUsd ] = useState('');
  const [ rub, setRub ] = useState('');
  const [ buyNowPrice, setBuyNowPrice ] = useState('');
  const [ buyNowExpires, setBuyNowExpires ] = useState('');
  const [ bidStartPrice, setBidStartPrice ] = useState('');
  const [ bidMinStep, setBidMinStep ] = useState('');
  const [ bidMultipleOf, setBidMultipleOf ] = useState('');

  const [ usdError, setUsdError ] = useState(undefined);
  const [ rubError, setRubError ] = useState(undefined);
  const [ buyNowPriceError, setBuyNowPriceError ] = useState(undefined);
  const [ buyNowExpiresError, setBuyNowExpiresError ] = useState(undefined);
  const [ bidStartPriceError, setBidStartPriceError ] = useState(undefined);
  const [ bidMinStepError, setBidMinStepError ] = useState(undefined);
  const [ bidMultipleOfError, setBidMultipleOfError ] = useState(undefined);

  const usdSchema = yup.string().matches(/^([1-9][0-9]*)|0(\.[0-9]+)?$/).required();
  const rubSchema = yup.string().matches(/^[1-9][0-9]*$/).required();
  const buyNowPriceSchema = yup.string().matches(/^[1-9][0-9]*$/);
  const buyNowExpiresSchema = yup.string().matches(/^[1-9][0-9]*$/);
  const bidStartPriceSchema = yup.string().matches(/^[1-9][0-9]*$/).required();
  const bidMinStepSchema = yup.string().matches(/^[1-9][0-9]*$/).required();
  const bidMultipleOfSchema = yup.string().matches(/^[1-9][0-9]*$/).required();

  const createBody = useMemo(() => ({
    alias,
    usd: +usd,
    rub: +rub,
    buyNowPrice: +buyNowPrice || null,
    buyNowExpires: +buyNowExpires || null,
    bidStartPrice: +bidStartPrice,
    bidMinStep: +bidMinStep,
    bidMultipleOf: +bidMultipleOf,
  }), [alias, usd, rub, buyNowPrice, buyNowExpires, bidStartPrice, bidMinStep, bidMultipleOf]);

  const isSubmitButtonDisabled = useMemo(() => (
    alias === ''
    || usd === ''
    || rub === ''
    || bidStartPrice === ''
    || bidMinStep === ''
    || bidMultipleOf === ''
    || usdError !== undefined
    || rubError !== undefined
    || buyNowPriceError !== undefined
    || buyNowExpiresError !== undefined
    || bidStartPriceError !== undefined
    || bidMinStepError !== undefined
    || bidMultipleOfError !== undefined
  ), [
    alias,
    usd,
    rub,
    bidStartPrice,
    bidMinStep,
    bidMultipleOf,
    usdError,
    rubError,
    buyNowPriceError,
    buyNowExpiresError,
    bidStartPriceError,
    bidMinStepError,
    bidMultipleOfError,
  ]);

  const onCloseSelf = (result) => {
    setAlias('');
    setUsd('');
    setRub('');
    setBuyNowPrice('');
    setBuyNowExpires('');
    setBidStartPrice('');
    setBidMinStep('');
    setBidMultipleOf('');

    setUsdError(undefined);
    setRubError(undefined);
    setBuyNowPriceError(undefined);
    setBuyNowExpiresError(undefined);
    setBidStartPriceError(undefined);
    setBidMinStepError(undefined);
    setBidMultipleOfError(undefined);

    onClose?.(result);
  };

  const performCreatePriceCategory = () => {
    setIsLoading(true);

    createPriceCategory(createBody).unwrap()
      .then((result) => {
        toast.success('Ценовая категория создана');
        onCloseSelf(result);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при создании ценовой категории');
      })
      .finally(() => setIsLoading(false));
  };

  const onFieldChange = async (value, schema, setState, setError) => {
    setState(value);

    const isValid = schema.isValidSync(value);
    console.log(isValid);
    if (isValid) {
      setError(undefined);
    } else {
      setError('Неверное значение поля');
    }
  };

  return (
    <SidebarForm
      title="Создание ценовой категории"
      open={open}
      isLoading={isLoading}
      onClose={onCloseSelf}
      bottom={
        <Tooltip title={isSubmitButtonDisabled ? 'Для создания ценовой категории необходимо заполнить форму' : ''}>
          <span>
            <Button variant="contained" disableElevation disabled={isSubmitButtonDisabled} onClick={performCreatePriceCategory}>Создать</Button>
          </span>
        </Tooltip>
      }
    >
      <Paper elevation={0} sx={{ px: 4 }}>
        <TextField
          fullWidth
          label="Название"
          value={alias}
          required
          onChange={(event) => setAlias(event.target.value)}
        />
        <TextField
          fullWidth
          label="Цена в долларах"
          value={usd}
          required
          error={usdError !== undefined}
          onChange={(event) => onFieldChange(event.target.value, usdSchema, setUsd, setUsdError)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Цена в рублях"
          value={rub}
          required
          error={rubError !== undefined}
          onChange={(event) => onFieldChange(event.target.value, rubSchema, setRub, setRubError)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Стоимость выкупа"
          value={buyNowPrice}
          error={buyNowPriceError !== undefined}
          onChange={(event) => onFieldChange(event.target.value, buyNowPriceSchema, setBuyNowPrice, setBuyNowPriceError)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Выкуп доступен до"
          value={buyNowExpires}
          error={buyNowExpiresError !== undefined}
          onChange={(event) => onFieldChange(event.target.value, buyNowExpiresSchema, setBuyNowExpires, setBuyNowExpiresError)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Начальная ставка"
          value={bidStartPrice}
          required
          error={bidStartPriceError !== undefined}
          onChange={(event) => onFieldChange(event.target.value, bidStartPriceSchema, setBidStartPrice, setBidStartPriceError)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Минимальный шаг ставки"
          value={bidMinStep}
          required
          error={bidMinStepError !== undefined}
          onChange={(event) => onFieldChange(event.target.value, bidMinStepSchema, setBidMinStep, setBidMinStepError)}
          sx={{ mt: 2 }}
        />
        <TextField
          fullWidth
          label="Кратность ставки"
          value={bidMultipleOf}
          required
          error={bidMultipleOfError !== undefined}
          onChange={(event) => onFieldChange(event.target.value, bidMultipleOfSchema, setBidMultipleOf, setBidMultipleOfError)}
          sx={{ mt: 2 }}
        />
      </Paper>
    </SidebarForm>
  );
};

export default PriceCategoryCreateForm;
