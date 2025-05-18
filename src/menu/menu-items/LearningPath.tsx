// assets
import { ScheduleOutlined  } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';
import { Roles } from "@/common/constants/roles"

// icons
const icons = {
  ScheduleOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const LearningPath: MenuItem = {
  id: 'chatTutor',
  title: '',
  type: 'group',
  children: [
    {
      id: 'chatTutor',
      title: 'Lộ trình học',
      type: 'item',
      url: '/learning-path',
      icon: icons.ScheduleOutlined,
      breadcrumbs: true,
      roles: [Roles.STUDENT],
    }
  ]
};

export default LearningPath;