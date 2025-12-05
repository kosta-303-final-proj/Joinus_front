import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { apiFetch } from '../../config';

/**
 * 소셜 로그인(OAuth2) 성공 후 토큰을 처리하는 컴포넌트
 * 백엔드에서 http://localhost:5173/token?token={JSON문자열} 형태로 리다이렉트됨
 */
export default function OAuthTokenHandler() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const handleToken = async () => {
      try {
        // URL에서 token 파라미터 가져오기
        const tokenParam = searchParams.get('token');
        
        if (!tokenParam) {
          console.error('토큰이 없습니다.');
          alert('로그인에 실패했습니다. 다시 시도해주세요.');
          navigate('/login');
          return;
        }

        // JSON 문자열을 파싱
        let tokenData;
        try {
          tokenData = JSON.parse(tokenParam);
        } catch (e) {
          // 이미 파싱된 객체일 수도 있음
          tokenData = typeof tokenParam === 'string' ? JSON.parse(tokenParam) : tokenParam;
        }

        // 토큰 저장
        if (tokenData.access_token) {
          localStorage.setItem('access_token', tokenData.access_token);
        }
        if (tokenData.refresh_token) {
          localStorage.setItem('refresh_token', tokenData.refresh_token);
        }

        // 사용자 정보 가져오기
        let userInfo = null;
        try {
          const response = await apiFetch('/user');
          if (response.ok) {
            userInfo = await response.json();
            localStorage.setItem('userInfo', JSON.stringify(userInfo));
          }
        } catch (error) {
          console.warn('사용자 정보 가져오기 실패:', error);
          // 사용자 정보는 나중에 가져올 수 있으므로 에러 무시
        }

        // ROLE에 따라 리다이렉트 분기
        if (userInfo && userInfo.roles) {
          const userRole = userInfo.roles;
          if (userRole.includes('ROLE_ADMIN') || userRole.includes('ROLE_MANAGER')) {
            // 관리자 또는 매니저인 경우
            alert('로그인 성공!');
            navigate('/admin');
          } else {
            // 일반 사용자인 경우
            alert('로그인 성공!');
            navigate('/');
          }
        } else {
          // 사용자 정보를 가져오지 못한 경우 기본값으로 메인 페이지로 이동
          alert('로그인 성공!');
          navigate('/');
        }
      } catch (error) {
        console.error('토큰 처리 실패:', error);
        alert('로그인 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      }
    };

    handleToken();
  }, [searchParams, navigate]);

  // 로딩 중 표시
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh',
      flexDirection: 'column',
      gap: '20px'
    }}>
      <div>로그인 처리 중...</div>
      <div style={{ fontSize: '14px', color: '#666' }}>잠시만 기다려주세요.</div>
    </div>
  );
}

