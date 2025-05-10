// assets
import { LineChartOutlined } from '@ant-design/icons';
import type { MenuItem } from '@/menu/type';

// icons
const icons = {
  LineChartOutlined
};

// ==============================|| MENU ITEMS - DASHBOARD ||============================== //

const cdashboard: MenuItem = {
  id: 'cdashboard',
  title: '',
  type: 'group',
  children: [
    {
      id: 'cdashboard',
      title: 'Tổng quan tiến độ',
      type: 'item',
      url: '/tong-quan-tien-do',
      icon: icons.LineChartOutlined,
      breadcrumbs: true
    }
  ]
};

export default cdashboard;