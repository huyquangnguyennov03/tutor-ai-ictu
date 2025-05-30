import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { registerUser } from "@/services/auth.service";
import Swal from "sweetalert2";
import {
  Box,
  Button,
  Container,
  TextField,
  Typography,
  Paper,
  Grid,
  Alert,
  InputAdornment,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Link as MuiLink,
  CircularProgress,
} from "@mui/material";
import {
  Email,
  Person,
  Lock,
  Visibility,
  VisibilityOff,
  School,
} from "@mui/icons-material";
// Import hình ảnh nền đăng ký
import loginBackground from "@/assets/images/auth/login-background.webp";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  const recaptchaSiteKey = import.meta.env.VITE_RECAPTCHA_SITE_KEY || "";

  const handleRecaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  // Xử lý thay đổi input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Xóa lỗi khi người dùng bắt đầu nhập lại
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Xác thực form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // Kiểm tra email
    if (!formData.email) {
      newErrors.email = "Email không được để trống";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email không hợp lệ";
    }

    // Kiểm tra họ tên
    if (!formData.fullName) {
      newErrors.fullName = "Họ tên không được để trống";
    } else if (formData.fullName.length < 2) {
      newErrors.fullName = "Họ tên phải có ít nhất 2 ký tự";
    }

    // Kiểm tra mật khẩu
    if (!formData.password) {
      newErrors.password = "Mật khẩu không được để trống";
    } else if (formData.password.length < 8) {
      newErrors.password = "Mật khẩu phải có ít nhất 8 ký tự";
    } else if (
      !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])/.test(formData.password)
    ) {
      newErrors.password =
        "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt";
    }

    // Kiểm tra xác nhận mật khẩu
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu xác nhận không khớp";
    }

    // Kiểm tra reCAPTCHA nếu có siteKey
    if (recaptchaSiteKey && !recaptchaToken) {
      newErrors.recaptcha = "Vui lòng xác thực reCAPTCHA";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Xử lý submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setServerError("");

    try {
      // Gọi API đăng ký - thay thế bằng API thực tế của bạn
      const response = await registerUser({
        email: formData.email,
        fullName: formData.fullName,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        captchaToken: recaptchaToken || "",
      });
      if (!response) {
        throw new Error("Đăng ký không thành công");
      }
      Swal.fire({
        icon: "success",
        title: "Đăng ký thành công",
        text: "Vui lòng kiểm tra email để kích hoạt tài khoản",
        showConfirmButton: true,
      }).then(() => {
        navigate("/login");
      });
    } catch (err: unknown) {
      console.log("err :>> ", err);
      if (err && typeof err === 'object' && 'response' in err) {
        const errorResponse = err as { response?: { data?: { message?: string } } };
        setServerError(errorResponse.response?.data?.message || "Đã xảy ra lỗi khi đăng ký");
      } else {
        setServerError("Đã xảy ra lỗi khi đăng ký");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {}, []);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 3,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        <Paper
          elevation={10}
          sx={{
            borderRadius: 3,
            overflow: "hidden",
            maxWidth: 1000,
            mx: "auto",
          }}
        >
          <Grid container sx={{ minHeight: 600 }}>
            {/* Phần hình ảnh bên trái */}
            <Grid
              item
              xs={false}
              md={6}
              sx={{
                backgroundImage: `url(${loginBackground})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                display: { xs: "none", md: "block" },
              }}
            />

            {/* Phần form đăng ký */}
            <Grid item xs={12} md={6}>
              <Card sx={{ height: "100%", boxShadow: "none" }}>
                <CardContent sx={{ p: 4, height: "100%" }}>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      mb: 3,
                    }}
                  >
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 56,
                        height: 56,
                        mb: 2,
                      }}
                    >
                      <School fontSize="large" />
                    </Avatar>
                    <Typography
                      variant="h4"
                      component="h1"
                      fontWeight="bold"
                      color="primary"
                      gutterBottom
                    >
                      ICTU TutorAI
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Đăng ký tài khoản mới
                    </Typography>
                  </Box>

                  {serverError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                      {serverError}
                    </Alert>
                  )}

                  <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                      fullWidth
                      id="email"
                      name="email"
                      label="Email"
                      type="email"
                      autoComplete="email"
                      value={formData.email}
                      onChange={handleChange}
                      error={!!errors.email}
                      helperText={errors.email}
                      required
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Email color="action" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Nhập email của bạn"
                    />

                    <TextField
                      fullWidth
                      id="fullName"
                      name="fullName"
                      label="Họ và tên"
                      type="text"
                      autoComplete="name"
                      value={formData.fullName}
                      onChange={handleChange}
                      error={!!errors.fullName}
                      helperText={errors.fullName}
                      required
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Person color="action" />
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Nhập họ và tên của bạn"
                    />

                    <TextField
                      fullWidth
                      id="password"
                      name="password"
                      label="Mật khẩu"
                      type={showPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.password}
                      onChange={handleChange}
                      error={!!errors.password}
                      helperText={
                        errors.password ||
                        "Mật khẩu phải chứa ít nhất 8 ký tự, bao gồm chữ hoa, chữ thường, số và ký tự đặc biệt."
                      }
                      required
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() => setShowPassword(!showPassword)}
                              edge="end"
                            >
                              {showPassword ? <VisibilityOff /> : <Visibility />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Tạo mật khẩu mới"
                    />

                    <TextField
                      fullWidth
                      id="confirmPassword"
                      name="confirmPassword"
                      label="Xác nhận mật khẩu"
                      type={showConfirmPassword ? "text" : "password"}
                      autoComplete="new-password"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword}
                      required
                      margin="normal"
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <Lock color="action" />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton
                              onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                              }
                              edge="end"
                            >
                              {showConfirmPassword ? (
                                <VisibilityOff />
                              ) : (
                                <Visibility />
                              )}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      placeholder="Nhập lại mật khẩu"
                    />

                    {recaptchaSiteKey && (
                      <Box sx={{ mt: 2, display: "flex", justifyContent: "center" }}>
                        <ReCAPTCHA
                          sitekey={recaptchaSiteKey}
                          onChange={handleRecaptchaChange}
                        />
                      </Box>
                    )}

                    {errors.recaptcha && (
                      <Alert severity="error" sx={{ mt: 1 }}>
                        {errors.recaptcha}
                      </Alert>
                    )}

                    <Button
                      type="submit"
                      fullWidth
                      variant="contained"
                      disabled={isLoading}
                      sx={{
                        mt: 3,
                        mb: 2,
                        py: 1.5,
                        fontSize: "1rem",
                        textTransform: "none",
                      }}
                      startIcon={
                        isLoading ? <CircularProgress size={20} /> : null
                      }
                    >
                      {isLoading ? "Đang xử lý..." : "Đăng ký"}
                    </Button>

                    <Box sx={{ textAlign: "center", mt: 2 }}>
                      <Typography variant="body2" color="text.secondary">
                        Bạn đã có tài khoản?{" "}
                        <MuiLink
                          component={Link}
                          to="/login"
                          variant="body2"
                          sx={{ textDecoration: "none" }}
                        >
                          Đăng nhập
                        </MuiLink>
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}