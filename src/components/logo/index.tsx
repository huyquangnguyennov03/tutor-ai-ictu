// import { Link } from 'react-router-dom';
//
// // material-ui
// import { ButtonBase } from '@mui/material';
// import Stack from '@mui/material/Stack';
//
// // project import
// import Logo from './LogoMain';
// import config from '@/themes/config';
//
// // ==============================|| MAIN LOGO ||============================== //
//
// type LogoSectionProps = {
//   sx?: object;
//   to?: string;
// };
//
// const LogoSection: React.FC<LogoSectionProps> = ({ sx, to }) => {
//   return (
//     <ButtonBase disableRipple component={Link} to={"/"} sx={sx}>
//       <Stack direction="row" spacing={1} alignItems="center">
//         <Logo />
//       </Stack>
//     </ButtonBase>
//   );
// };
//
// export default LogoSection;
// material-ui
import { useTheme } from "@mui/material/styles"
import { Box, Typography, Stack } from "@mui/material"

/**
 * Import your logo image
 */
import logoImage from '@/assets/images/logoictu.png';

// ==============================|| LOGO WITH TEXT ||============================== //

const Logo = () => {
  const theme = useTheme()

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <img
        src={logoImage}
        alt="ICTU Logo"
        width="60"
        height="60"
        style={{ objectFit: 'contain' }}
      />
      <Typography
        variant="h6"
        sx={{
          fontWeight: 600,
          color: theme.palette.mode === 'dark' ? 'white' : 'primary.dark'
        }}
      >
        ICTU Learning Progress
      </Typography>
    </Stack>
  )
}

export default Logo