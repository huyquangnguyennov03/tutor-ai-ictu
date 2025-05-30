// components/VerifyAccount.jsx
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import Swal from 'sweetalert2';
import { verifyAccount } from '@/services/auth.service'; // Adjust the import path as needed

export default function VerifyAccount() {
  const navigate = useNavigate();
  const location = useLocation();
  const [loading, setLoading] = useState(false);

  // Extract token from URL search params
  const searchParams = new URLSearchParams(location.search);
  const token = searchParams.get('token');

  async function verify() {
    try {
      setLoading(true);
      if (!token) return;

      const response = await verifyAccount(token);
      Swal.close();
      setLoading(false);

      if (response.success) {
        Swal.fire({
          title: 'Success',
          text: 'Tài khoản đã được xác thực thành công. Vui lòng đăng nhập lại.',
          icon: 'success',
          confirmButtonText: 'OK',
        }).then(() => navigate('/login'));
      } else {
        Swal.fire({
          title: 'Error',
          text: 'Tài khoản không được xác thực. Vui lòng thử lại sau.',
          icon: 'error',
        });
      }
    } catch (error) {
      console.log(error);
      Swal.close();
      setLoading(false);
      Swal.fire({
        title: 'Error',
        text: 'Tài khoản không được xác thực. Vui lòng thử lại sau.',
        icon: 'error',
        confirmButtonText: 'OK',
      });
    }
  }

  useEffect(() => {
    verify();
  }, []);

  useEffect(() => {
    if (loading) {
      Swal.fire({
        title: 'Loading...',
        html: 'Đang xác thực tài khoản.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading(),
        willClose: () => setLoading(false),
      });
    }
  }, [loading]);

  return <div></div>;
}