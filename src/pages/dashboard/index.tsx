import React from 'react';
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Grid,
  Avatar,
  Chip,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  useTheme,
  alpha
} from '@mui/material';
import {
  School,
  Code,
  Science,
  Calculate,
  Psychology,
  Language,
  Assignment,
  Quiz,
  Analytics,
  MenuBook,
  Person,
  Search,
  NotificationsNone,
  Settings
} from '@mui/icons-material';

const ICTUHomepage: React.FC = () => {
  const theme = useTheme();

  const tools = [
    {
      title: 'Lesson Plan',
      description: 'Tạo kế hoạch bài học chi tiết phù hợp với chương trình ICTU',
      icon: <MenuBook />,
      color: '#4CAF50'
    },
    {
      title: 'Code Reviewer',
      description: 'Đánh giá và cải thiện code của sinh viên',
      icon: <Code />,
      color: '#2196F3'
    },
    {
      title: 'Quiz Generator',
      description: 'Tạo bài kiểm tra và câu hỏi tự động',
      icon: <Quiz />,
      color: '#FF9800'
    },
    {
      title: 'Assignment Helper',
      description: 'Hỗ trợ tạo và chấm bài tập',
      icon: <Assignment />,
      color: '#9C27B0'
    },
    {
      title: 'Progress Analytics',
      description: 'Phân tích tiến độ học tập của sinh viên',
      icon: <Analytics />,
      color: '#F44336'
    },
    {
      title: 'AI Tutor',
      description: 'Gia sư AI hỗ trợ học tập 24/7',
      icon: <Psychology />,
      color: '#607D8B'
    }
  ];

  const subjects = [
    { name: 'Lập trình', icon: <Code />, students: 1250 },
    { name: 'Toán học', icon: <Calculate />, students: 980 },
    { name: 'Khoa học máy tính', icon: <Science />, students: 850 },
    { name: 'Tiếng Anh', icon: <Language />, students: 1100 }
  ];

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          py: 8,
          position: 'relative',
          overflow: 'hidden',
          borderRadius: { xs: 0, sm: 3 },
          mx: { xs: 0, sm: 2 },
          mt: { xs: 0, sm: 2 }
        }}
      >
        {/* Background decorative elements */}
        <Box
          sx={{
            position: 'absolute',
            top: -50,
            right: -50,
            width: 200,
            height: 200,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.warning.main, 0.1),
            zIndex: 0
          }}
        />
        <Box
          sx={{
            position: 'absolute',
            bottom: -30,
            left: -30,
            width: 150,
            height: 150,
            borderRadius: '50%',
            bgcolor: alpha(theme.palette.info.main, 0.1),
            zIndex: 0
          }}
        />

        <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Chip
              label="Dành cho sinh viên ICTU"
              color="primary"
              sx={{
                mb: 3,
                fontWeight: 'medium',
                borderRadius: 4,
                px: 2
              }}
            />
            <Typography
              variant="h2"
              component="h1"
              sx={{
                fontWeight: 'bold',
                mb: 3,
                fontSize: { xs: '2.5rem', md: '3.5rem' },
                background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}
            >
              Trải nghiệm nền tảng AI học tập tốt nhất cho ICTU
            </Typography>
            <Typography
              variant="h5"
              color="text.secondary"
              sx={{ mb: 4, maxWidth: 600, mx: 'auto', lineHeight: 1.6 }}
            >
              Dành ít thời gian hơn cho việc chuẩn bị và nhiều thời gian hơn cho việc học tập.
              Nền tảng AI hoàn toàn miễn phí cho sinh viên ICTU.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Button
                variant="contained"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  boxShadow: 3,
                  '&:hover': { boxShadow: 6 }
                }}
              >
                Bắt đầu học ngay
              </Button>
              <Button
                variant="outlined"
                size="large"
                sx={{
                  px: 4,
                  py: 1.5,
                  fontSize: '1.1rem',
                  borderRadius: 3,
                  borderWidth: 2,
                  '&:hover': { borderWidth: 2 }
                }}
              >
                Dành cho giảng viên
              </Button>
            </Box>
          </Box>

          {/* Demo Interface */}
          <Paper
            elevation={8}
            sx={{
              p: 3,
              maxWidth: 800,
              mx: 'auto',
              borderRadius: 4,
              background: 'linear-gradient(145deg, #ffffff 0%, #f8f9fa 100%)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 'bold', flexGrow: 1 }}>
                ICTU AI Tools
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Công cụ AI miễn phí được thiết kế để tiết kiệm thời gian và cải thiện việc học tập!
              </Typography>
            </Box>

            <Grid container spacing={2}>
              {tools.slice(0, 6).map((tool, index) => (
                <Grid item xs={6} md={4} key={index}>
                  <Card
                    sx={{
                      height: '100%',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      borderRadius: 3,
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: 4
                      }
                    }}
                  >
                    <CardContent sx={{ p: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 2,
                            bgcolor: alpha(tool.color, 0.1),
                            color: tool.color,
                            mr: 1
                          }}
                        >
                          {tool.icon}
                        </Box>
                        <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                          {tool.title}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {tool.description}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          sx={{
            textAlign: 'center',
            mb: 6,
            fontWeight: 'bold',
            color: 'text.primary'
          }}
        >
          Các môn học phổ biến tại ICTU
        </Typography>

        <Grid container spacing={4}>
          {subjects.map((subject, index) => (
            <Grid item xs={12} sm={6} md={3} key={index}>
              <Card
                sx={{
                  textAlign: 'center',
                  p: 3,
                  height: '100%',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  borderRadius: 3,
                  '&:hover': {
                    transform: 'translateY(-8px)',
                    boxShadow: 6
                  }
                }}
              >
                <Box
                  sx={{
                    display: 'inline-flex',
                    p: 2,
                    borderRadius: '50%',
                    bgcolor: 'primary.main',
                    color: 'white',
                    mb: 2
                  }}
                >
                  {subject.icon}
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 'bold', mb: 1 }}>
                  {subject.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {subject.students.toLocaleString()} sinh viên đang học
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box sx={{
        bgcolor: 'primary.main',
        color: 'white',
        py: 8,
        borderRadius: { xs: 0, sm: 3 },
        mx: { xs: 0, sm: 2 },
        mb: { xs: 0, sm: 2 }
      }}>
        <Container maxWidth="md" sx={{ textAlign: 'center' }}>
          <Typography variant="h3" sx={{ fontWeight: 'bold', mb: 3 }}>
            Sẵn sàng bắt đầu hành trình học tập với AI?
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            Tham gia cùng hàng nghìn sinh viên ICTU đang sử dụng AI để học tập hiệu quả hơn
          </Typography>
          <Button
            variant="contained"
            size="large"
            sx={{
              bgcolor: 'white',
              color: 'primary.main',
              px: 4,
              py: 1.5,
              fontSize: '1.1rem',
              fontWeight: 'bold',
              borderRadius: 3,
              '&:hover': {
                bgcolor: 'grey.100',
                transform: 'translateY(-2px)'
              }
            }}
          >
            Đăng ký miễn phí ngay
          </Button>
        </Container>
      </Box>

      {/* Footer */}
      <Box sx={{
        bgcolor: 'grey.900',
        color: 'white',
        py: 4,
        borderRadius: { xs: 0, sm: '3px 3px 0 0' },
        mx: { xs: 0, sm: 2 },
        borderRadius: 2
      }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <School sx={{ mr: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                  ICTU AI Learning
                </Typography>
              </Box>
              <Typography variant="body2" color="grey.400">
                Nền tảng học tập AI dành riêng cho sinh viên và giảng viên
                Trường Đại học Công nghệ Thông tin và Truyền thông - ICTU
              </Typography>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ display: 'flex', justifyContent: { xs: 'center', md: 'flex-end' }, gap: 4 }}>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Liên kết
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ mb: 0.5 }}>
                    Về ICTU
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ mb: 0.5 }}>
                    Điều khoản sử dụng
                  </Typography>
                  <Typography variant="body2" color="grey.400">
                    Chính sách bảo mật
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 'bold' }}>
                    Hỗ trợ
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ mb: 0.5 }}>
                    Trung tâm trợ giúp
                  </Typography>
                  <Typography variant="body2" color="grey.400" sx={{ mb: 0.5 }}>
                    Liên hệ
                  </Typography>
                  <Typography variant="body2" color="grey.400">
                    Báo cáo lỗi
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default ICTUHomepage;