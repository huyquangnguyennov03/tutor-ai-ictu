// assets
import { FundOutlined  } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';
import { Roles } from "@/common/constants/roles"

// icons
const icons = {
  FundOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const LearningProcess: MenuItem = {
  id: 'learning-process',
  title: '',
  type: 'group',
  children: [
    {
      id: 'learning-process',
      title: 'Tiến độ học tập',
      type: 'item',
      // url: '/tien-do-hoc-tap/:studentId',
      url: '/tien-do-hoc-tap/:dtc21h48020103',
      icon: icons.FundOutlined,
      breadcrumbs: true,
      roles: [Roles.STUDENT],
    }
  ]
};

export default LearningProcess;