import { Box, Divider, Typography } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';

const ItemDetails = ({ item }) => (
  <Box sx={{ margin: 1 }}>
    <Grid container spacing={2} px={4}>
      <Grid xs={6}>
        <div
          style={{
            marginBottom: '32px',
            height: '320px',
            overflowX: 'scroll',
            overflowY: 'visible',
          }}
        >
          <div
            style={{
              display: 'flex',
              height: '100%',
              gap: '16px',
              paddingBottom: '8px',
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
      </Grid>
      <Grid xs={6} alignSelf="center">
        <Typography variant="h1">{item.name}</Typography>
        <Divider light sx={{ my: 2 }} />
        <Typography variant="caption">Описание</Typography>
        <Typography variant="body1" component="pre" sx={{ fontFamily: 'monospace' }}>{item.description}</Typography>
        <Grid container spacing={4} px={0} py={4}>
          <Grid>
            <Typography variant="caption">Категория</Typography>
            <Typography variant="body1">{item.type.name}</Typography>
          </Grid>
          <Grid>
            <Typography variant="caption">Ценовая категория</Typography>
            <Typography variant="body1">{item.priceCategory?.alias || '—'}</Typography>
          </Grid>
          <Grid>
            <Typography variant="caption">Обернуть в</Typography>
            <Typography variant="body1">{item.wrapTo?.alias || '—'}</Typography>
          </Grid>
          <Grid>
            <Typography variant="caption">UPC-A</Typography>
            <Typography variant="body1">{item.upca || '—'}</Typography>
          </Grid>
          <Grid>
            <Typography variant="caption">UPC-5</Typography>
            <Typography variant="body1">{item.upc5 || '—'}</Typography>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  </Box>
);

export default ItemDetails;
