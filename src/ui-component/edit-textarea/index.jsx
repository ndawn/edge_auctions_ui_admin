import * as React from 'react';
import { useGridApiContext } from '@mui/x-data-grid';
import InputBase from '@mui/material/InputBase';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

const lines = [
  'Lorem ipsum dolor sit amet, consectetur adipiscing elit.',
  'Aliquam dapibus, lorem vel mattis aliquet, purus lorem tincidunt mauris, in blandit quam risus sed ipsum.',
  'Maecenas non felis venenatis, porta velit quis, consectetur elit.',
  'Vestibulum commodo et odio a laoreet.',
  'Nullam cursus tincidunt auctor.',
  'Sed feugiat venenatis nulla, sit amet dictum nulla convallis sit amet.',
  'Nulla venenatis justo non felis vulputate, eu mollis metus ornare.',
  'Nam ullamcorper ligula id consectetur auctor.',
  'Phasellus et ultrices dui.',
  'Fusce facilisis egestas massa, et eleifend magna imperdiet et.',
  'Pellentesque ac metus velit.',
  'Vestibulum in massa nibh.',
  'Vestibulum pulvinar aliquam turpis, ac faucibus risus varius a.',
];

const EditTextarea = (props) => {
  const { id, field, value, colDef } = props;
  const [valueState, setValueState] = React.useState(value);
  const [anchorEl, setAnchorEl] = React.useState();
  const apiRef = useGridApiContext();

  const handleRef = React.useCallback((el) => {
    setAnchorEl(el);
  }, []);

  const handleChange = React.useCallback(
    (event) => {
      const newValue = event.target.value;
      setValueState(newValue);
      apiRef.current.setEditCellValue(
        { id, field, value: newValue, debounceMs: 200 },
        event,
      );
    },
    [apiRef, field, id],
  );

  const handleKeyDown = React.useCallback(
    (event) => {
      if (
        event.key === 'Escape' ||
        (event.key === 'Enter' &&
          !event.shiftKey &&
          (event.ctrlKey || event.metaKey))
      ) {
        const params = apiRef.current.getCellParams(id, field);
        apiRef.current.publishEvent('cellKeyDown', params, event);
      }
    },
    [apiRef, id, field],
  );

  return (
    <div style={{ position: 'relative', alignSelf: 'flex-start' }}>
      <div
        ref={handleRef}
        style={{
          height: 1,
          width: colDef.computedWidth,
          display: 'block',
          position: 'absolute',
          top: 0,
        }}
      />
      {anchorEl && (
        <Popper open anchorEl={anchorEl} placement="bottom-start">
          <Paper elevation={1} sx={{ p: 1, minWidth: colDef.computedWidth }}>
            <InputBase
              multiline
              minRows={props.minRows ?? 6}
              maxRows={props.maxRows ?? 12}
              value={valueState}
              sx={{ textarea: { resize: 'both' }, width: '100%' }}
              inputProps={props.inputProps}
              onChange={handleChange}
              autoFocus
              onKeyDown={handleKeyDown}
            />
          </Paper>
        </Popper>
      )}
    </div>
  );
};

export default EditTextarea;
