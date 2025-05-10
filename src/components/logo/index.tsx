import { Link } from 'react-router-dom';

// material-ui
import { ButtonBase } from '@mui/material';
import Stack from '@mui/material/Stack';

// project import
import Logo from './LogoMain';
import config from '@/themes/config';

// ==============================|| MAIN LOGO ||============================== //

type LogoSectionProps = {
  sx?: object;
  to?: string;
};

const LogoSection: React.FC<LogoSectionProps> = ({ sx, to }) => {
  return (
    <ButtonBase disableRipple component={Link} to={"/"} sx={sx}>
      <Stack direction="row" spacing={1} alignItems="center">
        <Logo />
      </Stack>
    </ButtonBase>
  );
};

export default LogoSection;
