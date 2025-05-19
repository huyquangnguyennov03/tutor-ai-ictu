
import { ReadOutlined  } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';
import { Roles } from "@/common/constants/roles"
// icons
const icons = {
  ReadOutlined
};

// ==============================|| MENU ITEMS - GAMEFI ||============================== //

const gameFi: MenuItem = {
  id: 'game-fi',
  title: '',
  type: 'group',
  children: [
    {
      id: 'game-fi',
      title: 'Học tập qua trò chơi',
      type: 'item',
      url: '/game-fi',
      icon: icons.ReadOutlined,
      breadcrumbs: false
    }
  ]
};

export default gameFi;