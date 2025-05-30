// assets
import { MessageOutlined } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';
import { Roles } from "@/common/constants/roles"

// icons
const icons = {
  MessageOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const chatTutor: MenuItem = {
  id: 'chatTutor',
  title: '',
  type: 'group',
  children: [
    {
      id: 'chatTutor',
      title: 'Trợ Giảng AI - Lập Trình C',
      type: 'item',
      url: '/chat-tutor',
      icon: icons.MessageOutlined,
      breadcrumbs: true,
      roles: [Roles.STUDENT],
    }
  ]
};

export default chatTutor;