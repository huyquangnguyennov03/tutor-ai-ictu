// ==============================|| PRESET THEME - THEME SELECTOR ||============================== //

export default function Theme(colors: any, presetColor: any, mode: any) {
  const { blue, red, gold, cyan, green, grey } = colors;

  const greyColors = {
    0: grey[0],
    50: grey[1],
    100: grey[2],
    200: grey[3],
    300: grey[4],
    400: grey[5],
    500: grey[6],
    600: grey[7],
    700: grey[8],
    800: grey[9],
    900: grey[10],
    A50: grey[15],
    A100: grey[11],
    A200: grey[12],
    A400: grey[13],
    A700: grey[14],
    A800: grey[16]
  };

  const contrastText = '#fff';  // Đây là màu chữ mặc định

  // Hàm giúp chọn màu chữ phù hợp với nền
  const getContrastText = (background: string) => {
    // Logic kiểm tra độ sáng của nền để chọn màu chữ phù hợp
    const hex = background.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    const brightness = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    return brightness > 128 ? '#000' : contrastText; // Nếu nền sáng, dùng chữ tối, ngược lại dùng chữ sáng
  };

  return {
    primary: {
      lighter: blue[0],
      100: blue[1],
      200: blue[2],
      light: blue[3],
      400: blue[4],
      main: blue[5],
      dark: blue[6],
      700: blue[7],
      darker: blue[8],
      900: blue[9],
      contrastText
    },
    secondary: {
      lighter: greyColors[100],
      100: greyColors[100],
      200: greyColors[200],
      light: greyColors[300],
      400: greyColors[400],
      main: greyColors[500],
      600: greyColors[600],
      dark: greyColors[700],
      800: greyColors[800],
      darker: greyColors[900],
      A100: greyColors[0],
      A200: greyColors.A400,
      A300: greyColors.A700,
      contrastText: getContrastText(greyColors[100])
    },
    error: {
      lighter: red[0],
      light: red[2],
      main: red[4],
      dark: red[7],
      darker: red[9],
      contrastText
    },
    warning: {
      lighter: gold[0],
      light: gold[3],
      main: gold[5],
      dark: gold[7],
      darker: gold[9],
      contrastText: getContrastText(greyColors[100])
    },
    info: {
      lighter: cyan[0],
      light: cyan[3],
      main: cyan[5],
      dark: cyan[7],
      darker: cyan[9],
      contrastText
    },
    success: {
      lighter: green[0],
      light: green[3],
      main: green[5],
      dark: green[7],
      darker: green[9],
      contrastText
    },
    grey: greyColors,
    // Thêm các phần màu sắc dựa trên chế độ sáng/tối
    background: {
      default: mode === 'dark' ? greyColors[900] : greyColors[50],
      paper: mode === 'dark' ? greyColors[800] : greyColors[100]
    },
    text: {
      primary: mode === 'dark' ? greyColors[0] : greyColors[900],
      secondary: mode === 'dark' ? greyColors[50] : greyColors[700]
    }
  };
}
