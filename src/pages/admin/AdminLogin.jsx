import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import '../auth/Login.css';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({ 
    userId: '',
    password: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // FormData로 username, password 전송
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.userId);
      formDataToSend.append('password', formData.password);

      const response = await myAxios().post('/login', formDataToSend);

      // 응답 헤더에서 Authorization 토큰 가져오기 (표준 Bearer 형식)
      const authHeader = response.headers['Authorization'] || response.headers['authorization'];
      if (authHeader && authHeader.startsWith('Bearer ')) {
        const accessToken = authHeader.replace('Bearer ', '');
        sessionStorage.setItem('access_token', accessToken);
      }
      
      // Refresh Token은 별도 헤더에서
      const refreshHeader = response.headers['X-Refresh-Token'];
      if (refreshHeader && refreshHeader.startsWith('Bearer ')) {
        const refreshToken = refreshHeader.replace('Bearer ', '');
        sessionStorage.setItem('refresh_token', refreshToken);
      }

      // 응답 body에서 사용자 정보 가져오기
      const userInfo = response.data;
      sessionStorage.setItem('userInfo', JSON.stringify(userInfo));

      // ROLE에 따라 리다이렉트 분기
      const userRole = userInfo.roles;
      if (userRole && (userRole.includes('ROLE_ADMIN') || userRole.includes('ROLE_MANAGER'))) {
        // 관리자 또는 매니저인 경우
        alert('로그인 성공!');
        navigate('/admin');
      } else {
        // 일반 사용자인 경우 - 관리자 로그인 페이지에서는 관리자 권한이 필요
        alert('관리자 권한이 필요합니다.');
        sessionStorage.removeItem('access_token');
        sessionStorage.removeItem('refresh_token');
        sessionStorage.removeItem('userInfo');
      }
    } catch (error) {
      console.error('로그인 실패:', error);
      alert('아이디 또는 비밀번호가 올바르지 않습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">관리자 로그인</h1>
        <p className="login-subtitle">관리자 아이디와 비밀번호를 입력해 주세요.</p>

        <form onSubmit={handleLogin} className="login-form">
          {/* 아이디 입력 */}
          <div className="form-group">
            <label htmlFor="userId" className="form-label">아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              className="form-input"
              placeholder="관리자 아이디를 입력하세요"
              value={formData.userId}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* 비밀번호 입력 */}
          <div className="form-group">
            <label htmlFor="password" className="form-label">비밀번호</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="비밀번호를 입력하세요"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              required
            />
          </div>

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? '로그인 중...' : '로그인'}
          </button>

          {/* 링크들 */}
          <div className="login-links">
            <a href="/findId" className="link" onClick={(e) => { e.preventDefault(); navigate('/findId'); }}>아이디 찾기</a>
            <span className="divider">|</span>
            <a href="/findPassword" className="link" onClick={(e) => { e.preventDefault(); navigate('/findPw'); }}>비밀번호 찾기</a>
          </div>
        </form>
      </div>
    </div>
  );
}

