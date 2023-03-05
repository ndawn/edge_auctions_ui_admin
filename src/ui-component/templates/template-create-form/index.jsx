import { useMemo, useState } from 'react';

import { Button, Paper, TextField, Tooltip } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { useToast } from 'use-toast-mui';

import { useCreateTemplateMutation } from 'store/slices/api';
import SidebarForm from 'ui-component/sidebar-form';

const TemplateCreateForm = ({ open, onClose }) => {
  const theme = useTheme();
  const toast = useToast();

  const [ createTemplate, createTemplateResult ] = useCreateTemplateMutation();

  const [ isLoading, setIsLoading ] = useState(false);
  const [ alias, setAlias ] = useState('');
  const [ text, setText ] = useState('');

  const createBody = useMemo(() => ({ alias, text }), [alias, text]);

  const isSubmitButtonDisabled = useMemo(() => (alias === '' || text === ''), [alias, text]);

  const onCloseSelf = (result) => {
    setAlias('');
    setText('');
    onClose?.(result);
  };

  const performCreateTemplate = () => {
    setIsLoading(true);

    createTemplate(createBody).unwrap()
      .then((result) => {
        toast.success('Шаблон создан');
        onCloseSelf(result);
      })
      .catch((err) => {
        console.error(err);
        toast.error('Ошибка при создании шаблона');
      })
      .finally(() => setIsLoading(false));
  };

  return (
    <SidebarForm
      title="Создание шаблона"
      open={open}
      isLoading={isLoading}
      onClose={onCloseSelf}
      bottom={
        <Tooltip title={isSubmitButtonDisabled ? 'Для создания шаблона необходимо заполнить форму' : ''}>
          <span>
            <Button variant="contained" disableElevation disabled={isSubmitButtonDisabled} onClick={performCreateTemplate}>Создать</Button>
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
          label="Текст шаблона"
          value={text}
          required
          multiline
          minRows={12}
          maxRows={24}
          onChange={(event) => setText(event.target.value)}
          sx={{ mt: 2 }}
          inputProps={{ style: { fontFamily: 'monospace' } }}
        />
      </Paper>
    </SidebarForm>
  );
};

export default TemplateCreateForm;
