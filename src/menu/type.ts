export interface MenuChildrenType {
  id: string;
  title?: string;
  type: string;
  url?: string;
  icon?: any;
  breadcrumbs?: boolean;
  target?: boolean;
  external?: boolean;
  disabled?: boolean;
  roles?: string[];
  children?: MenuChildrenType[];
  chip?: {
    color: 'default' | 'primary' | 'secondary';
    variant: 'filled' | 'outlined';
    size: 'small' | 'medium';
    label: string;
    avatar?: string;
  };
}

export interface MenuItem {
  id: string;
  title?: string;
  type: string;
  children: MenuChildrenType[]
  roles?: string[];
}