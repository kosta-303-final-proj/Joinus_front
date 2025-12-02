import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Login.css';

export default function Login() {
  const navigate = useNavigate();
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

  const handleLogin = (e) => {
    e.preventDefault();
    console.log('로그인:', formData);
    // 로그인 로직 추가
    navigate('/');
  };

  const handleKakaoLogin = () => {
    console.log('카카오톡으로 로그인');
    // 카카오 로그인 로직
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
              required
            />
          </div>

          {/* 로그인 버튼 */}
          <button type="submit" className="login-button">
            로그인
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