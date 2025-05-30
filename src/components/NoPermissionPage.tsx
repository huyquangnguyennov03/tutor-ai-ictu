import React from 'react';
import { logout } from '@/services/auth.service';
import { useNavigate } from 'react-router-dom';

const NoPermissionPage: React.FC = () => {
    const navigate = useNavigate();
    
    const handleLogout = async () => {
        try {
            await logout();
            navigate('/login');
        } catch (error) {
            console.error('Lỗi khi đăng xuất:', error);
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Bạn không có quyền truy cập</h1>
            <p>Vui lòng liên hệ quản trị viên nếu cần hỗ trợ.</p>
            <button
                onClick={handleLogout}
                style={{
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                }}
            >
                Đăng xuất
            </button>
        </div>
    );
};

export default NoPermissionPage;