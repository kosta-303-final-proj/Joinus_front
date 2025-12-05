import { Navigate } from 'react-router-dom';

/**
 * 로그인이 필요한 라우트를 보호하는 컴포넌트
 * @param {React.ReactNode} children - 보호할 컴포넌트
 * @param {string[]} requiredRoles - 필요한 권한 (선택)
 */
export default function ProtectedRoute({ children, requiredRoles = null }) {
  // localStorage에서 토큰과 사용자 정보 확인
  const accessToken = localStorage.getItem('access_token');
  const userInfoStr = localStorage.getItem('userInfo');
  
  // 로그인 안 되어 있으면 로그인 페이지로 리다이렉트
  if (!accessToken) {
    return <Navigate to="/login" replace />;
  }

  // 특정 권한이 필요한 경우 권한 체크
  if (requiredRoles && userInfoStr) {
    try {
      const userInfo = JSON.parse(userInfoStr);
      const userRoles = userInfo.roles || [];
      
      // 필요한 권한이 있는지 확인
      const hasRequiredRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRequiredRole) {
        // 권한이 없으면 메인 페이지로 리다이렉트
        return <Navigate to="/" replace />;
      }
    } catch (e) {
      console.error('사용자 정보 파싱 실패:', e);
      return <Navigate to="/login" replace />;
    }
  }

  // 모든 조건을 만족하면 자식 컴포넌트 렌더링
  return children;
}

