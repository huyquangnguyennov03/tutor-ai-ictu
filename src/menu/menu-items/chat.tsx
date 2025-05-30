// assets
import { CommentOutlined  } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';
import { Roles } from "@/common/constants/roles";
// icons
const icons = {
  CommentOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const chat: MenuItem = {
  id: 'chat',
  title: '',
  type: 'group',
  children: [
    {
      id: 'chat',
      title: 'Tin nhắn',
      type: 'item',
      url: '/chat',
      icon: icons.CommentOutlined,
      breadcrumbs: false,
      roles: [Roles.TEACHER, Roles.STUDENT]
    }
  ]
};

export default chat;