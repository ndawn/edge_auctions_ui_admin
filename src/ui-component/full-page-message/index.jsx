import PropTypes from 'prop-types';
import { Stack, Typography } from '@mui/material';
import styled from '@emotion/styled';

import LogoIcon from 'assets/logo_icon.png';

const FilteredImage = styled.img`
  filter: saturate(0.1) hue-rotate(250deg) brightness(1.4) opacity(0.6);
`;

const FullPageMessage = ({ title, description, button }) => (
  <Stack spacing={2} alignItems="center" justifyContent="center" sx={{ py: 16 }}>
    <FilteredImage src={LogoIcon} />
    <Typography variant="h3" color="#323648">{title}</Typography>
    <Typography variant="body1" maxWidth={400} align="center" color="#171a21">{description}</Typography>
    {button}
  </Stack>
);

FullPageMessage.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  button: PropTypes.node,
};

export default FullPageMessage;
