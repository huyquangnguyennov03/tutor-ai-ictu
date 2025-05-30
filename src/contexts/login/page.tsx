import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Checkbox,
  FormControlLabel,
  Paper,
  Grid,
  Alert,
  CircularProgress,
  Divider,
  Container,
  IconButton,
} from "@mui/material";
import { Google as GoogleIcon, Facebook as FacebookIcon } from "@mui/icons-material";
import { checkAuth, loginUser } from "@/services/auth.service";
import Swal from "sweetalert2";
import { useAuthStore } from "@/store/auth";
import { useAppDispatch } from "@/redux/hooks";
import { setToken, setUserInfo } from "@/redux/slices/authSlice";
import { Roles } from "@/common/constants/roles";
// Import hình ảnh nền đăng nhập
import loginBackground from "@/assets/images/auth/login-background.webp";

// Custom icon component for the logo (replacing the SVG)
const LogoIcon = () => (
  <svg
    style={{ height: 56, width: 56, color: '#3f51b5' }}
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 2L2 7L12 12L22 7L12 2Z"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 17L12 22L22 17"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M2 12L12 17L22 12"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isServerDown, setIsServerDown] = useState(false);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setUser, isLoggedIn, hasHydrated } = useAuthStore();

  const checkAuthen = async () => {
    try {
      const response = await checkAuth();
      if (response.email) {
        // Cập nhật Zustand store
        setUser({
          fullName: response.fullName || response.name,
          email: response.email,
          role: response.role,
          sub: response.sub,
        });

        // Cập nhật Redux store
        dispatch(setToken(response.token || null));
        dispatch(setUserInfo({
          authenticated: true,
          token: response.token || null,
          role: response.role as Roles,
          userInfo: {
            email: response.email,
            email_verified: response.email_verified || true,
            family_name: response.family_name || '',
            given_name: response.given_name || '',
            name: response.fullName || response.name,
            preferred_username: response.preferred_username || response.email,
            sub: response.sub,
          },
          saleUpToken: null,
        }));
      }
      return true;
    } catch (error) {
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await loginUser({ email, password, rememberMe });
      if (!response) {
        throw new Error("Đăng nhập thất bại!");
      }
      await checkAuthen();
      Swal.fire({
        title: "Thông báo",
        text: "Đăng nhập thành công",
        icon: "success",
        timer: 3000,
        timerProgressBar: true,
      }).then(() => {
        // navigate("/");
      });
    } catch (err: unknown) {
      console.error("Lỗi đăng nhập:", err);
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        setError(errorResponse.response?.data?.message || "Đã xảy ra lỗi khi đăng nhập");
      } else {
        setError("Đã xảy ra lỗi khi đăng nhập");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    try {
      checkAuthen().then((isAuthenticated) => {
        if (isAuthenticated) {
          navigate("/");
        } else {
          console.log("Chưa đăng nhập hoặc lỗi xác thực");
        }
      });
    } catch (error) {
      setIsServerDown(true);
    }
  }, []);

  const handleSocialLogin = (provider: string) => {
    // Xử lý đăng nhập bằng mạng xã hội - thay thế bằng logic thực tế
    console.log(`Đăng nhập với ${provider}`);
    // window.location.href = `/api/auth/${provider}`;
  };

  const handleForgotPassword = () => {
    navigate("/forgot-password");
  };

  const handleRegister = () => {
    navigate("/register");
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={24}
          sx={{
            display: 'flex',
            borderRadius: 3,
            overflow: 'hidden',
            maxWidth: 1000,
            mx: 'auto',
          }}
        >
          {/* Phần hình ảnh bên trái */}
          <Box
            sx={{
              display: { xs: 'none', md: 'block' },
              width: '50%',
              backgroundImage: `url(${loginBackground})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              minHeight: 600,
            }}
          />

          {/* Phần form đăng nhập */}
          <Box
            sx={{
              width: { xs: '100%', md: '50%' },
              p: { xs: 4, md: 6 },
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
            }}
          >
            {/* Header */}
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Box sx={{ display: 'flex', justifyContent: 'center', mb: 3 }}>
                <LogoIcon />
              </Box>
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 'bold',
                  color: 'primary.main',
                  mb: 1,
                }}
              >
                ICTU TutorAI
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Đăng nhập để truy cập vào hệ thống học tập
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3 }}>
                {error}
              </Alert>
            )}

            {/* Login Form */}
            <Box component="form" onSubmit={handleSubmit} sx={{ mb: 3 }}>
              <TextField
                fullWidth
                id="email"
                name="email"
                label="Email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Nhập email của bạn"
                sx={{ mb: 3 }}
                variant="outlined"
              />

              <TextField
                fullWidth
                id="password"
                name="password"
                label="Mật khẩu"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Nhập mật khẩu của bạn"
                sx={{ mb: 3 }}
                variant="outlined"
              />

              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 3,
                }}
              >
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      color="primary"
                    />
                  }
                  label="Ghi nhớ đăng nhập"
                />

                <Button
                  variant="text"
                  color="primary"
                  onClick={handleForgotPassword}
                  sx={{ textTransform: 'none' }}
                >
                  Quên mật khẩu?
                </Button>
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                disabled={isLoading}
                sx={{
                  py: 1.5,
                  mb: 3,
                  textTransform: 'none',
                  fontSize: '1rem',
                }}
              >
                {isLoading ? (
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CircularProgress size={20} color="inherit" />
                    Đang xử lý...
                  </Box>
                ) : (
                  "Đăng nhập"
                )}
              </Button>
            </Box>

            {/* Social Login Section */}
            <Box sx={{ mb: 3 }}>
              <Divider sx={{ mb: 3 }}>
                <Typography variant="body2" color="text.secondary">
                  Hoặc đăng nhập với
                </Typography>
              </Divider>

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled
                    onClick={() => handleSocialLogin("google")}
                    startIcon={<GoogleIcon />}
                    sx={{
                      py: 1.5,
                      textTransform: 'none',
                      cursor: 'not-allowed',
                    }}
                  >
                    Google
                  </Button>
                </Grid>
                <Grid item xs={6}>
                  <Button
                    fullWidth
                    variant="outlined"
                    disabled
                    onClick={() => handleSocialLogin("facebook")}
                    startIcon={<FacebookIcon />}
                    sx={{
                      py: 1.5,
                      textTransform: 'none',
                      cursor: 'not-allowed',
                    }}
                  >
                    Facebook
                  </Button>
                </Grid>
              </Grid>
            </Box>

            {/* Register Link */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Bạn chưa có tài khoản?{" "}
                <Button
                  variant="text"
                  color="primary"
                  onClick={handleRegister}
                  sx={{ textTransform: 'none', p: 0, minHeight: 'auto' }}
                >
                  Đăng ký ngay
                </Button>
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}