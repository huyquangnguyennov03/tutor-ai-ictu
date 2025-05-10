// assets
import { FundOutlined  } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';

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
      url: '/tien-do-hoc-tap/:studentId',
      icon: icons.FundOutlined,
      breadcrumbs: true
    }
  ]
};

export default LearningProcess;