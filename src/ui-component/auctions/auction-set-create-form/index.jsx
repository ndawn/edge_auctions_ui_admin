import { Fragment, useEffect, useState } from 'react';

import { Box, Button, FormControl, Input, Paper, Skeleton, Slider, TextField, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import { useTheme } from '@mui/material/styles';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import dayjs from 'utils/dayjs';

import { useGetItemCountersQuery } from 'store/slices/api';
import { getOffsetString } from 'utils/auctions';
import config from 'config';

const AuctionSetCreateForm = ({ onChange }) => {
  const theme = useTheme();

  const { data: itemCounters, isLoading, isFetching, refetch } = useGetItemCountersQuery();

  const [dateDue, setDateDue] = useState(null);
  const [antiSniper, setAntiSniper] = useState(config.defaultAntiSniper.toString());
  const [counters, setCounters] = useState({});

  useEffect(() => {
    onChange?.({
      dateDue: dateDue ? dayjs.utc(dateDue) : null,
      antiSniper: (!antiSniper || isNaN(+antiSniper)) ? null : +antiSniper,
      counters,
    });
  }, [dateDue, antiSniper, counters]);

  useEffect(() => {
    if (!isLoading && itemCounters) {
      setCounters(Object.fromEntries(
        itemCounters.counters.map((counter) => [
          counter.itemType.id,
          Object.fromEntries(counter.prices.map((price) => [price.priceCategory.id, 0])),
        ])
      ));
    }
  }, [isLoading]);

  const setCounter = (itemTypeId, priceCategoryId, value) => {
    setCounters((previousValue) => ({
      ...previousValue,
      [itemTypeId]: {
        ...previousValue[itemTypeId],
        [priceCategoryId]: value,
      },
    }));
  };

  return (
    <Paper sx={{ p: 4, pt: 0, height: 'calc(100% - 175px)', overflowX: 'hidden', overflowY: 'scroll' }}>
      <FormControl fullWidth required sx={{ mt: 1 }}>
        <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="ru">
          <DateTimePicker
            renderInput={(props) => <TextField {...props} />}
            label={`Дата окончания (${getOffsetString()})`}
            value={dateDue}
            onChange={(value) => setDateDue(value)}
            ampm={false}
            ampmInClock={false}
            disablePast
            disableMaskedInput
            inputFormat="D.MM.YYYY HH:mm"
            minutesStep={5}
          />
        </LocalizationProvider>
      </FormControl>
      <TextField
        fullWidth
        required
        label="Анти-снайпер"
        value={antiSniper}
        onChange={(event) => setAntiSniper(event.target.value)}
        sx={{ mt: 2 }}
      />
      {itemCounters
        ? itemCounters.counters.map((counter) => (
          <Fragment key={counter.itemType.id}>
            <Paper variant="outlined" elevation={0} sx={{ position: 'relative', mt: 3 }}>
              <Typography
                variant="subtitle1"
                sx={{ position: 'absolute', top: -14, left: 14, px: '4px', backgroundColor: 'white' }}
              >{counter.itemType.name}</Typography>
              <Grid container spacing={4} p={3}>
                {counter.prices.map((price) => (
                  <Grid key={price.priceCategory.id} xs={12}>
                    <FormControl fullWidth>
                      <Typography variant="body1">{price.priceCategory.alias}</Typography>
                      <Box sx={{ display: 'flex', gap: 2 }}>
                        <Slider
                          marks
                          size="small"
                          valueLabelDisplay="auto"
                          min={0}
                          max={price.count}
                          value={counters?.[counter.itemType.id]?.[price.priceCategory.id] ?? 0}
                          onChange={(event) => setCounter(counter.itemType.id, price.priceCategory.id, event.target.value)}
                        />
                        <Input
                          value={counters?.[counter.itemType.id]?.[price.priceCategory.id] ?? 0}
                          size="small"
                          onChange={(event) => setCounter(counter.itemType.id, price.priceCategory.id, event.target.value)}
                          inputProps={{ min: 0, max: price.count, type: 'number' }}
                        />
                      </Box>
                    </FormControl>
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Fragment>
        )) : <Skeleton variant="rounded" sx={{ width: '100%', height: '56px' }} />}
    </Paper>
  );
};

export default AuctionSetCreateForm;
