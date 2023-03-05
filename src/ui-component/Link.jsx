import { Link as DefaultLink } from 'react-router-dom';

import { styled } from '@mui/material/styles';

const Link = styled(DefaultLink)(({ theme }) => ({
  textDecoration: 'none',
  color: theme.palette.primary.main,
  fontWeight: '500',
  '&:hover': {
    textDecoration: 'underline',
  },
}));

export default Link;
