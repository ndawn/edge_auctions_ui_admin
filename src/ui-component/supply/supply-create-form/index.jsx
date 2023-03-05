import { useEffect, useMemo, useRef, useState } from 'react';

import { Box, Chip, FormControl, InputLabel, MenuItem, Paper, Select, Skeleton, Stack, Typography } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import plural from 'plural-ru';

import { useListItemTypesQuery } from 'store/slices/api';

const SupplyCreateForm = ({ onChange, disabled }) => {
  const theme = useTheme();

  const { data: itemTypes, error, isLoading } = useListItemTypesQuery();

  const [itemTypeId, setItemTypeId] = useState('');
  const [files, setFiles] = useState([]);
  const [isDraggingOver, setIsDraggingOver] = useState(false);

  const fileField = useRef(null);

  useEffect(() => {
    onChange?.({ itemTypeId: itemTypeId || null, files });
  }, [itemTypeId, files]);

  const pluralSelected = useMemo(() => plural(
    files.length,
    'Выбран',
    'Выбрано',
    'Выбрано',
  ), [files]);

  const pluralFiles = useMemo(() => plural(
    files.length,
    'файл',
    'файла',
    'файлов',
  ), [files]);

  const onItemTypeChange = (event) => {
    setItemTypeId(event.target.value);
  };

  const onFileFieldClick = () => {
    fileField.current?.click();
  };

  const onFileFieldChange = (event) => {
    setFiles(Array.from(event.target.files));
  };
  
  const onFileFieldDragEnter = (event) => {
    event.preventDefault();
    setIsDraggingOver(true);
  };
  
  const onFileFieldDragOver = (event) => {
    event.stopPropagation();
    event.preventDefault();
  };

  const onFileFieldDragLeave = (event) => {
    event.preventDefault();
    setIsDraggingOver(false);
  };
  
  const onFileFieldDrop = (event) => {
    event.preventDefault();

    setIsDraggingOver(false);
    setFiles(Array.from(event.dataTransfer.files));
  };

  const deleteFile = (index) => {
    const filesCopy = files.slice(0);
    filesCopy.splice(index, 1);
    setFiles(filesCopy);
  };

  return (
    <Paper sx={{ padding: '32px', overflow: 'hidden' }}>
      {!isLoading ? (
        <FormControl fullWidth required>
          <InputLabel id="item-type-id">Категория</InputLabel>
          <Select labelId="item-type-id" label="Категория" required value={itemTypeId} onChange={onItemTypeChange}>
            <MenuItem value="">-----------</MenuItem>
            {itemTypes.map((itemType) => <MenuItem value={itemType.id} key={itemType.id}>{itemType.name}</MenuItem>)}
          </Select>
        </FormControl>
      ) : <Skeleton variant="rounded" height={50} />}
      <Paper
        variant="outlined"
        sx={{
          width: '100%',
          marginTop: '32px',
          cursor: 'pointer',
          borderColor: isDraggingOver ? theme.palette.primary.main : '',
          borderStyle: 'dashed',
        }}
        onClick={onFileFieldClick}
        onDragEnter={onFileFieldDragEnter}
        onDragOver={onFileFieldDragOver}
        onDragLeave={onFileFieldDragLeave}
        onMouseLeave={onFileFieldDragLeave}
        onDrop={onFileFieldDrop}
      >
        <Stack alignItems="center" padding={8} sx={{ pointerEvents: 'none' }}>
          <input hidden type="file" accept="image/jpeg" multiple ref={fileField} onChange={onFileFieldChange} />
          <Typography align="center">
            {
              files.length === 0
              ? 'Перетащите файлы в это поле, либо нажмите для выбора'
              : `${pluralSelected} ${files.length} ${pluralFiles}`
            }
          </Typography>
        </Stack>
      </Paper>
      <Box mt={4} width="100%" display="flex" flexWrap="wrap" sx={{ gap: '8px' }}>
        {files?.map?.((file, index) => <Chip label={file.name} key={index} onDelete={() => deleteFile(index)} />)}
      </Box>
    </Paper>
  );
};

export default SupplyCreateForm;
