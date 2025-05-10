// material-ui
import type { Theme, CSSObject } from "@mui/material/styles";
import { styled } from "@mui/material/styles";
import type { DrawerProps } from "@mui/material/Drawer";
import Drawer from "@mui/material/Drawer";

// project import
import { drawerWidth } from '@/themes/config';

const openedMixin = (theme: Theme): CSSObject => ({
  width: drawerWidth,
  borderRight: '1px solid',
  borderRightColor: theme.palette.divider,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
  boxShadow: 'none',
});

const closedMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: 60, // Fixed width for the collapsed drawer
  borderRight: '1px solid',
  borderRightColor: theme.palette.divider,
  '& .MuiListItemText-root': {
    display: 'none',
  },

  '& .MuiBox-root': {
    padding: '0',
    margin: '0',
  },

  '& .MuiListItemIcon-root': {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    margin: '0',
  },
  '& .MuiListItemButton-root': {
    justifyContent: 'center',
    padding: 0,
    height: 50,
    minHeight: 50,
    width: '100%',
  }
});

interface MiniDrawerStyledProps extends DrawerProps {
  open?: boolean;
}

const MiniDrawerStyled = styled(Drawer, {
  shouldForwardProp: (prop) => prop !== 'open',
})<MiniDrawerStyledProps>(({ theme, open }: { theme: Theme; open?: boolean }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: 'nowrap',
  boxSizing: 'border-box',
  ...(open
    ? {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }
    : {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
}));

export default MiniDrawerStyled;