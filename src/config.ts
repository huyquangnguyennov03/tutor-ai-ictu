// ==============================|| THEME CONFIG  ||============================== //

interface Config {
  defaultPath: string;
  fontFamily: string;
  i18n: string;
  miniDrawer: boolean;
  container: boolean;
  mode: string;
  presetColor: string;
  themeDirection: string;
}

const config: Config = {
  defaultPath: '/dashboard/default',
  fontFamily: `'Public Sans', sans-serif`,
  i18n: 'en',
  miniDrawer: false,
  container: true,
  mode: 'light',
  presetColor: 'default',
  themeDirection: 'ltr'
};

export default config;

// Xác định kiểu dữ liệu cho các biến khác
export const drawerWidth: number = 260;

export const twitterColor: string = '#1DA1F2';
export const facebookColor: string = '#3b5998';
export const linkedInColor: string = '#0e76a8';
