import type React from 'react';
import { useMediaQuery, Box } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import Search from './Search';
import Profile from './Profile';
import MobileSection from './MobileSection';

const HeaderContent: React.FC = () => {
  const theme = useTheme();
  const downLG = useMediaQuery(theme.breakpoints.down('lg'));

  return (
    <Box sx={{ width: '100%' }} display="flex" alignItems="center">
      {!downLG && <Search />}
      {downLG && <Box sx={{ width: '100%', ml: 1 }} />}
      {!downLG && <Profile />}
      {downLG && <MobileSection />}
    </Box>
  );
};

export default HeaderContent;
