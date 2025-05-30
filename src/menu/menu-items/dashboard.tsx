// assets
import { HomeOutlined } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';
import { Roles } from "@/common/constants/roles";

// icons
const icons = {
  HomeOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const dashboard: MenuItem = {
  id: 'group-dashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'dashboard',
      title: 'Trang chủ',
      type: 'item',
      url: '/trang-chu',
      icon: icons.HomeOutlined,
      breadcrumbs: false,
      roles: [Roles.TEACHER, Roles.STUDENT]
    }
  ]
};

export default dashboard;