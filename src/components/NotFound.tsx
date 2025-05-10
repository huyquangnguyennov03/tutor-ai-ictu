import { Box, Button, Container, Typography } from '@mui/material';
import { Link } from 'react-router-dom';

const NotFound = () => {
  return (
    <Container>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          textAlign: 'center'
        }}
      >
        <Typography variant="h1" component="h1" gutterBottom>
          404
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
          Trang không tồn tại
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          Trang bạn đang tìm kiếm có thể đã bị xóa, thay đổi tên hoặc tạm thời không có sẵn.
        </Typography>
        <Button component={Link} to="/" variant="contained" color="primary" sx={{ mt: 2 }}>
          Quay lại trang chủ
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;