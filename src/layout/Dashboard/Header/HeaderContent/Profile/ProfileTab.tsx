import PropTypes from 'prop-types';
import { useState } from 'react';

// material-ui
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { HomeOutlined } from "@ant-design/icons"

// assets
import LogoutOutlined from '@ant-design/icons/LogoutOutlined';
import UserOutlined from '@ant-design/icons/UserOutlined';

// ==============================|| HEADER PROFILE - PROFILE TAB ||============================== //

interface ProfileTabProps {
  handleLogout?: () => void;
}

const ProfileTab: React.FC<ProfileTabProps> = ({ handleLogout }) => {
  const [selectedIndex, setSelectedIndex] = useState<number>(0);

  const handleListItemClick = (index: number, path: string) => {
    setSelectedIndex(index);
    // You can use `path` here to navigate or handle the action for the click
    // For example: navigate(path)
  };

  const navigateToHome = () => {
    window.location.href = "https://saleup.vn/";
  };

  return (
    <List component="nav" sx={{ p: 0, '& .MuiListItemIcon-root': { minWidth: 32 } }}>
      <ListItemButton selected={selectedIndex === 0} onClick={navigateToHome}>
        <ListItemIcon>
          <HomeOutlined />
        </ListItemIcon>
        <ListItemText primary="Trang chủ" />
      </ListItemButton>

      <ListItemButton selected={selectedIndex === 1} onClick={() => window.location.href = '/profile'}>
        <ListItemIcon>
          <UserOutlined />
        </ListItemIcon>
        <ListItemText primary="Cài đặt tài khoản" />
      </ListItemButton>
      
      <ListItemButton selected={selectedIndex === 2} onClick={handleLogout}>
        <ListItemIcon>
          <LogoutOutlined />
        </ListItemIcon>
        <ListItemText primary="Đăng xuất" />
      </ListItemButton>
    </List>
  );
}

ProfileTab.propTypes = {
  handleLogout: PropTypes.func
};

export default ProfileTab;
