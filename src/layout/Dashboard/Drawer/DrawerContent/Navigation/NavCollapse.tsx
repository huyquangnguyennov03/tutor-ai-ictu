import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useTheme } from '@mui/material/styles';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Collapse from '@mui/material/Collapse';
import ExpandMore from '@mui/icons-material/ExpandMore';
import ExpandLess from '@mui/icons-material/ExpandLess';
import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Paper from '@mui/material/Paper';

import { useGetMenuMaster } from '@/menu/api';
import NavItem from './NavItem';
import type { MenuChildrenType } from "@/menu/type";
import { handlerActiveItem } from '@/menu/api';

interface NavCollapseProps {
  item: MenuChildrenType;
  level: number;
}

const NavCollapse: React.FC<NavCollapseProps> = ({ item, level }) => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const { menuMaster } = useGetMenuMaster();
  const drawerOpen = menuMaster?.isDashboardDrawerOpened ?? false;
  const openItem = menuMaster?.openedItem ?? '';
  const { pathname } = useLocation();

  // Check if any child is active
  const isChildrenSelected = item.children?.some(
    (child) => child.url === pathname || openItem === child.id
  );

  useEffect(() => {
    if (isChildrenSelected && drawerOpen) {
      setOpen(true);
    }
  }, [isChildrenSelected, drawerOpen]);

  const handleClick = () => {
    if (drawerOpen) {
      setOpen(!open);
    }
    handlerActiveItem(item.id);
  };

  const handleMouseEnter = (event: React.MouseEvent<HTMLDivElement>) => {
    if (!drawerOpen) {
      setAnchorEl(event.currentTarget);
    }
  };

  const handleMouseLeave = () => {
    if (!drawerOpen) {
      setAnchorEl(null);
    }
  };

  const Icon = item.icon;
  const itemIcon = Icon ? <Icon style={{ fontSize: drawerOpen ? '1rem' : '1.25rem' }} /> : null;

  const textColor = 'text.primary';
  const iconSelectedColor = 'primary.main';

  const menus = item.children?.map((menuItem) => {
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} item={menuItem} level={level + 1} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} level={level + 1} />;
      default:
        return null;
    }
  });

  const menuContent = (
    <List component="div" disablePadding>
      {menus}
    </List>
  );

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <ListItemButton
        onClick={handleClick}
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
              color: isChildrenSelected ? iconSelectedColor : textColor,
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
                isChildrenSelected && {
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
              <Typography
                variant="h6"
                sx={{
                  color: isChildrenSelected ? iconSelectedColor : textColor
                }}
              >
                {item.title}
              </Typography>
            }
          />
        )}
        {drawerOpen && (open ? <ExpandLess /> : <ExpandMore />)}
      </ListItemButton>

      {drawerOpen ? (
        <Collapse in={open} timeout="auto" unmountOnExit>
          {menuContent}
        </Collapse>
      ) : (
        <Popper
          open={Boolean(anchorEl)}
          anchorEl={anchorEl}
          placement="right-start"
          sx={{ zIndex: 1300 }}
        >
          <Paper
            elevation={4}
            sx={{
              minWidth: 180,
              backgroundColor: 'background.paper',
              borderRadius: 1,
              boxShadow: theme.shadows[4],
              overflow: 'hidden',
              '& .MuiList-root': {
                padding: '4px 0',
              },
            }}
          >
            {menuContent}
          </Paper>
        </Popper>
      )}
    </div>
  );
};

export default NavCollapse;