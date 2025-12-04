import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
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
      const url = 'http://localhost:8080';

      // FormData로 username, password 전송
      const formDataToSend = new FormData();
      formDataToSend.append('username', formData.userId);
      formDataToSend.append('password', formData.password);

      const response = await fetch(`${url}/login`, {
        method: 'POST',
        body: formDataToSend,
      });

      if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
      }

    // 응답 헤더에서 Authorization 토큰 가져오기
    const authHeader = response.headers.get('Authorization');
    if (authHeader) {
      const tokenData = JSON.parse(authHeader);
      localStorage.setItem('access_token', tokenData.access_token);
      localStorage.setItem('refresh_token', tokenData.refresh_token);
    }

    // 응답 body에서 사용자 정보 가져오기
    const userInfo = await response.json();
    localStorage.setItem('userInfo', JSON.stringify(userInfo));

    alert('로그인 성공!');
    navigate('/');
  } catch (error) {
    console.error('로그인 실패:', error);
    alert('아이디 또는 비밀번호가 올바르지 않습니다.');
  } finally {
    setIsLoading(false);
  }
};

  const handleKakaoLogin = () => {
    window.location.href = 'http://localhost:8080/oauth2/authorization/kakao';
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <h1 className="login-title">로그인</h1>
        <p className="login-subtitle">아이디와 비밀번호를 입력해 주세요.</p>

        <form onSubmit={handleLogin} className="login-form">
          {/* 아이디 입력 */}
          <div className="form-group">
            <label htmlFor="userId" className="form-label">아이디</label>
            <input
              type="text"
              id="userId"
              name="userId"
              className="form-input"
              placeholder="아이디를 입력하세요"
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

          {/* 카카오톡 로그인 버튼 */}
          <button 
            type="button" 
            className="kakao-login-button"
            onClick={handleKakaoLogin}
          >
            카카오톡으로 로그인
          </button>

          {/* 링크들 */}
          <div className="login-links">
            <a href="/findId" className="link" onClick={(e) => { e.preventDefault(); navigate('/findId'); }}>아이디 찾기</a>
            <span className="divider">|</span>
            <a href="/findPassword" className="link" onClick={(e) => { e.preventDefault(); navigate('/findPw'); }}>비밀번호 찾기</a>
            {/* <a href="/signup" className="link signup-link" onClick={(e) => { e.preventDefault(); navigate('/signup'); }}>회원가입</a> */}
          </div>

          {/* 회원가입 안내 */}
          <div className="signup-prompt">
            <span>아직 회원이 아니신가요?</span>
            <a href="/signup" className="signup-link-text">지금 바로 가입하기</a>
          </div>
        </form>
      </div>
    </div>
  );
}