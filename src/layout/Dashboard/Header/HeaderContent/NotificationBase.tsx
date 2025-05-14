import { useRef, useState } from 'react';

// material-ui
import useMediaQuery from '@mui/material/useMediaQuery';
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import List from '@mui/material/List';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project imports
import MainCard from '@/components/MainCard';
import IconButton from '@/components/@extended/IconButton';
import Transitions from '@/components/@extended/Transitions';

// assets
import CheckCircleOutlined from '@ant-design/icons/CheckCircleOutlined';

// types
import { Theme } from '@mui/material/styles';
import { ReactNode } from 'react';

interface NotificationBaseProps {
  icon: ReactNode;
  unreadCount: number;
  title: string;
  children: ReactNode;
  badgeColor?: 'default' | 'primary' | 'secondary' | 'error' | 'info' | 'success' | 'warning';
  onMarkAllRead?: () => void;
  viewAllAction?: () => void;
  viewAllText?: string;
}

const NotificationBase = ({
                            icon,
                            unreadCount,
                            title,
                            children,
                            badgeColor = 'error',
                            onMarkAllRead,
                            viewAllAction,
                            viewAllText = 'Xem tất cả'
                          }: NotificationBaseProps) => {
  const downMD = useMediaQuery((theme: Theme) => theme.breakpoints.down('md'));

  const anchorRef = useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = useState<boolean>(false);

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: MouseEvent | TouchEvent) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as Node)) {
      return;
    }
    setOpen(false);
  };

  const handleViewAll = () => {
    setOpen(false);
    if (viewAllAction) {
      viewAllAction();
    }
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <IconButton
        color="secondary"
        variant="light"
        sx={(theme: Theme) => ({
          color: 'text.primary',
          bgcolor: open ? 'grey.100' : 'transparent',
          ...theme.applyStyles?.('dark', { bgcolor: open ? 'background.default' : 'transparent' })
        })}
        aria-label={`open ${title.toLowerCase()}`}
        ref={anchorRef}
        aria-controls={open ? 'notification-popper' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Badge badgeContent={unreadCount} color={badgeColor}>
          {icon}
        </Badge>
      </IconButton>
      <Popper
        placement={downMD ? 'bottom' : 'bottom-end'}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [{ name: 'offset', options: { offset: [downMD ? -5 : 0, 9] } }]
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position={downMD ? 'top' : 'top-right'} in={open} {...TransitionProps}>
            <Paper sx={(theme: Theme) => ({
              boxShadow: theme.customShadows?.z1,
              width: '100%',
              minWidth: 285,
              maxWidth: { xs: 285, md: 420 },
              maxHeight: { xs: '80vh', md: '80vh' },
              overflow: 'auto'
            })}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard
                  title={title}
                  elevation={0}
                  border={false}
                  content={false}
                  secondary={
                    unreadCount > 0 && onMarkAllRead && (
                      <Tooltip title="Đánh dấu đã đọc tất cả">
                        <IconButton color="success" size="small" onClick={onMarkAllRead}>
                          <CheckCircleOutlined style={{ fontSize: '1.15rem' }} />
                        </IconButton>
                      </Tooltip>
                    )
                  }
                >
                  <List
                    component="nav"
                    sx={{
                      p: 0,
                      '& .MuiListItemButton-root': {
                        py: 1.5,
                        px: 2,
                        '&.Mui-selected': { bgcolor: 'grey.50', color: 'text.primary' }
                      }
                    }}
                  >
                    {children}

                    {viewAllAction && (
                      <Box
                        sx={{
                          textAlign: 'center',
                          py: 1.5,
                          borderTop: '1px solid',
                          borderColor: 'divider',
                          cursor: 'pointer'
                        }}
                        onClick={handleViewAll}
                      >
                        <Typography variant="h6" color="primary">
                          {viewAllText}
                        </Typography>
                      </Box>
                    )}
                  </List>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default NotificationBase;