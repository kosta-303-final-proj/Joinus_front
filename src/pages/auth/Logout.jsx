import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

/**
 * 로그아웃 처리 컴포넌트
 * localStorage에서 토큰 및 사용자 정보를 삭제하고 로그인 페이지로 리다이렉트
 */
export default function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    // localStorage에서 인증 정보 삭제
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userInfo');

    // 로그인 페이지로 리다이렉트
    navigate('/login', { replace: true });
  }, [navigate]);

  // 로그아웃 처리 중 표시
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div>로그아웃 중...</div>
    </div>
  );
}

