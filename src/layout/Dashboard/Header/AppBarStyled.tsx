import { styled, type Theme } from "@mui/material/styles"
import AppBar from '@mui/material/AppBar';

// project import
import { drawerWidth } from '@/themes/config';

// ==============================|| HEADER - APP BAR STYLED ||============================== //

// Define the interface directly above or within the file scope
interface AppBarStyledProps {
  open?: boolean;
}

const AppBarStyled = styled(AppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarStyledProps>(({ theme, open }: { theme: Theme; open?: boolean }) => ({
  zIndex: theme.zIndex.drawer + 1,
  left: 0,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(!open && {
    width: `calc(100% - 60px)`,
    left: `60px`,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

export default AppBarStyled;
