import PropTypes from 'prop-types';
import { useEffect, useRef, useState } from "react"

// material-ui
import { useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import CardContent from '@mui/material/CardContent';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grid from '@mui/material/Grid2';
import Paper from '@mui/material/Paper';
import IconButton from '@mui/material/IconButton';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// project import
import ProfileTab from './ProfileTab';
// import SettingTab from './SettingTab';
import MainCard from '@/components/MainCard';
import Transitions from '@/components/@extended/Transitions';
import Avatar from '@/components/@extended/Avatar';

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import avatar1 from '@/assets/images/users/avatar-1.png';

// Keycloak
import { useKeycloak } from '@/contexts/keycloak/KeycloakProvider';
import Gravatar from "react-gravatar"
import { useAppSelector } from "@/redux/hooks"
import { selectUserInfo } from "@/redux/slices/authSlice"
import useMediaQuery from "@mui/material/useMediaQuery"


// TabPanel component type
interface TabPanelProps {
  children: React.ReactNode;
  value: number;
  index: number;
  dir: 'ltr' | 'rtl'; // Direction for the text
}

function TabPanel({ children, value, index, dir, ...other }: TabPanelProps) {
  return (
    <div role="tabpanel" hidden={value !== index} id={`profile-tabpanel-${index}`} aria-labelledby={`profile-tab-${index}`} {...other}>
      {value === index && children}
    </div>
  );
}

function a11yProps(index: number) {
  return {
    id: `profile-tab-${index}`,
    'aria-controls': `profile-tabpanel-${index}`,
  };
}

// ==============================|| HEADER CONTENT - PROFILE ||============================== //

const Profile: React.FC = () => {
  const theme = useTheme();

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

  const [value, setValue] = useState<number>(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const iconBackColorOpen = 'grey.100';

  const { keycloak } = useKeycloak();
  const [userInfo, setUserInfo] = useState<any>({});
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const handleLogout = () => {
    keycloak?.logout();
  };

  const userData = useAppSelector(selectUserInfo);
  useEffect(() => {
    if (userData) {
      setUserInfo(userData);
    }
  }, [userData])

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <ButtonBase
        sx={{
          p: 0.25,
          bgcolor: open ? iconBackColorOpen : 'transparent',
          borderRadius: 1,
          '&:hover': { bgcolor: 'secondary.lighter' },
          '&:focus-visible': { outline: `2px solid ${theme.palette.secondary.dark}`, outlineOffset: 2 },
        }}
        aria-label="open profile"
        ref={anchorRef}
        aria-controls={open ? 'profile-grow' : undefined}
        aria-haspopup="true"
        onClick={handleToggle}
      >
        <Stack direction="row" spacing={1.25} alignItems="center" sx={{ p: 0.5 }}>
          {userInfo.email &&
            <Gravatar email={userInfo.email} style={{
              height: 32,
              width: 32,
              borderRadius: '50%',
            }}/>
          }
          {!userInfo.email &&
            <Avatar alt="profile user" src={avatar1} size="sm" />
          }
          <Typography variant="subtitle1" sx={{ textTransform: 'capitalize' }}>
            {userInfo.name}
          </Typography>
        </Stack>
      </ButtonBase>
      <Popper
        placement="bottom-end"
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
        popperOptions={{
          modifiers: [
            {
              name: 'offset',
              options: {
                offset: [0, 9],
              },
            },
          ],
        }}
      >
        {({ TransitionProps }) => (
          <Transitions type="grow" position="top-right" in={open} {...TransitionProps}>
            <Paper sx={{ boxShadow: theme.customShadows.z1, width: 290, minWidth: 240, maxWidth: { xs: 250, md: 290 } }}>
              <ClickAwayListener onClickAway={handleClose}>
                <MainCard elevation={0} border={false} content={false}>
                  <CardContent sx={{ px: 2.5, pt: 3 }}>
                    <Grid container justifyContent="space-between" alignItems="center">
                      <Stack direction="row" spacing={1.25} alignItems="center">
                        {userInfo.email ? (
                          <Gravatar
                            email={userInfo.email}
                            style={{
                              height: 32,
                              width: 32,
                              borderRadius: '50%',
                            }}
                          />
                        ) : (
                          <Avatar alt="profile user" src={avatar1} size="sm" />
                        )}
                        <Stack>
                          <Typography variant="h6">{userInfo.name}</Typography>
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{
                              maxWidth: isMobile ? 100 : 150,
                              overflow: 'hidden',
                              textOverflow: 'ellipsis',
                              whiteSpace: 'nowrap',
                            }}
                          >
                            {userInfo.email}
                          </Typography>
                        </Stack>
                      </Stack>
                      <Tooltip title="Đăng xuất">
                        <IconButton
                          size="large"
                          onClick={handleLogout}
                          sx={{ color: 'text.primary' }}
                        >
                          <LogoutOutlined />
                        </IconButton>
                      </Tooltip>
                    </Grid>
                  </CardContent>
                  <TabPanel value={value} index={0} dir={theme.direction}>
                    <ProfileTab handleLogout={handleLogout} />
                  </TabPanel>
                </MainCard>
              </ClickAwayListener>
            </Paper>
          </Transitions>
        )}
      </Popper>
    </Box>
  );
};

export default Profile;

TabPanel.propTypes = { children: PropTypes.node, value: PropTypes.number, index: PropTypes.number, other: PropTypes.any };
