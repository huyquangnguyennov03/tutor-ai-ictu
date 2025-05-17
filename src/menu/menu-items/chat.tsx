// assets
import { MessageOutlined  } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';

// icons
const icons = {
  MessageOutlined
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
      icon: icons.MessageOutlined,
      breadcrumbs: false
    }
  ]
};

export default chat;