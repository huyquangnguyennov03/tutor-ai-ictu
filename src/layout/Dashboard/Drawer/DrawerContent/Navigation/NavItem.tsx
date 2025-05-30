import type React from 'react';
import { forwardRef, useEffect } from 'react';
import { Link, useLocation, matchPath } from 'react-router-dom';

// material-ui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';

// project import
import { handlerActiveItem, useGetMenuMaster } from '@/menu/api';
import type { MenuChildrenType } from '@/menu/type';
import { useAuthStore } from '@/store/auth';

interface NavItemProps {
  item: MenuChildrenType;
  level: number;
}

const NavItem: React.FC<NavItemProps> = ({ item, level }) => {
  const theme = useTheme();
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;
  const openItem = menuMaster?.openedItem ?? '';
  const { user } = useAuthStore();
  const userRole = user?.role || null;

  const { pathname } = useLocation();
  const isSelected = !!matchPath({ path: item.url ?? '', end: false }, pathname) || openItem === item.id;

  // active menu item on page load
  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id);
  }, [pathname, item.id]);

  if (item.roles && userRole && !item.roles.includes(userRole)) {
    return null;
  }

  const itemTarget = item.target ? '_blank' : '_self';

  const listItemProps =
    item.external
      ? { component: 'a', href: item.url, target: itemTarget }
      : {
        component: forwardRef<HTMLAnchorElement, any>((props, ref) => (
          <Link ref={ref} {...props} to={item.url ?? '#'} target={itemTarget} />
        )),
      };

  const Icon = item.icon;
  const itemIcon = Icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : null;

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  return (
    <ListItemButton
      {...listItemProps}
      disabled={item.disabled}
      onClick={() => handlerActiveItem(item.id)}
      selected={isSelected}
      sx={{
        zIndex: 1201,
        pl: drawerOpen ? `${level * 28}px` : 1.5,
        py: !drawerOpen && level === 1 ? 1.25 : 1,
        ...(drawerOpen && {
          '&:hover': {
            bgcolor: 'primary.lighter',
          },
          '&.Mui-selected': {
            bgcolor: 'primary.lighter',
            borderRight: `2px solid ${theme.palette.primary.main}`,
            color: iconSelectedColor,
            '&:hover': {
              color: iconSelectedColor,
              bgcolor: 'primary.lighter',
            },
          },
        }),
        ...(!drawerOpen && {
          '&:hover': {
            bgcolor: 'transparent',
          },
          '&.Mui-selected': {
            '&:hover': {
              bgcolor: 'transparent',
            },
            bgcolor: 'transparent',
          },
        }),
      }}
    >
      {itemIcon && (
        <ListItemIcon
          sx={{
            minWidth: 28,
            color: isSelected ? iconSelectedColor : textColor,
            ...(!drawerOpen && {
              borderRadius: 1.5,
              width: 36,
              height: 36,
              alignItems: 'center',
              justifyContent: 'center',
              '&:hover': {
                bgcolor: 'secondary.lighter',
              },
            }),
            ...(!drawerOpen &&
              isSelected && {
                bgcolor: 'primary.lighter',
                '&:hover': {
                  bgcolor: 'primary.lighter',
                },
              }),
          }}
        >
          {itemIcon}
        </ListItemIcon>
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && (
        <ListItemText
          primary={
            <Typography variant="h6" sx={{ color: isSelected ? iconSelectedColor : textColor }}>
              {item.title}
            </Typography>
          }
        />
      )}
      {(drawerOpen || (!drawerOpen && level !== 1)) && item.chip && (
        <Chip
          color={item.chip.color}
          variant={item.chip.variant}
          size={item.chip.size}
          label={item.chip.label}
          avatar={item.chip.avatar ? <Avatar>{item.chip.avatar}</Avatar> : undefined}
        />
      )}
    </ListItemButton>
  );
};

export default NavItem;