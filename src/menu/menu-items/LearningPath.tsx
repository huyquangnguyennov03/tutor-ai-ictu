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
  id: 'learningPath',
  title: '',
  type: 'group',
  children: [
    {
      id: 'learningPath',
      title: 'Lộ trình học',
      type: 'item',
      url: '/learning-path',
      icon: icons.ScheduleOutlined,
      breadcrumbs: true,
      // roles: [Roles.STUDENT],
    }
  ]
};

export default LearningPath;