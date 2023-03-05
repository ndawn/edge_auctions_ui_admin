import { useState } from 'react';

import { Badge, Box, Popover } from '@mui/material';
import { styled, useTheme } from '@mui/material/styles';

const ContainedImage = styled('img')(({ height, theme }) => ({
  '&': {
    objectFit: 'contain',
    width: '100%',
    height,
  },
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    top: 17,
    right: 20,
    border: `1px solid ${theme.palette.background.paper}`,
    padding: '0 4px',
  },
}));

const ImageCell = ({ images, height = '100%' }) => {
  const theme = useTheme();

  const [ anchor, setAnchor ] = useState(null);
  const [ isPopoverOpen, setIsPopoverOpen ] = useState(false);

  const onImageMouseEnter = (event) => {
    setAnchor(event.currentTarget);
    setIsPopoverOpen(true);
  };

  const onImageMouseLeave = (event) => {
    setAnchor(null);
    setIsPopoverOpen(false);
  };

  const getFullImageSrc = (url) => `/${url}`;

  return (
    <>
      <ContainedImage
        src={getFullImageSrc(images.find((image) => image.isMain)?.urls?.small ?? '')}
        onMouseEnter={onImageMouseEnter}
        onMouseLeave={onImageMouseLeave}
        height={height}
      />
      <Popover
        open={isPopoverOpen}
        anchorEl={anchor}
        anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
        sx={{ pointerEvents: 'none', marginLeft: '8px' }}
      >
        <Box sx={{ backgroundColor: theme.palette.background.default }}>
          <StyledBadge color="primary" badgeContent={images.length > 1 ? images.length : undefined}>
            <ContainedImage src={getFullImageSrc(images.find((image) => image.isMain)?.urls?.medium ?? '')} />
          </StyledBadge>
        </Box>
      </Popover>
    </>
  );
};

export default ImageCell;
