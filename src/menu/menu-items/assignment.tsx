// assets
import { BookOutlined } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';
import { Roles } from "@/common/constants/roles"

// icons
const icons = {
  BookOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const chatTutor: MenuItem = {
  id: 'assignment',
  title: '',
  type: 'group',
  children: [
    {
      id: 'assignment',
      title: 'Trợ Giảng AI - Lập Trình C',
      type: 'item',
      url: '/assignment',
      icon: icons.BookOutlined,
      breadcrumbs: true,
      // roles: [Roles.STUDENT],
    }
  ]
};

export default chatTutor;