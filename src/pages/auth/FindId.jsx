import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/button.css';
import './FindId.css';

export default function FindId() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('아이디 찾기 시도:', formData);
    // 실제 아이디 찾기 로직 (API 호출 등)
    alert('아이디 찾기 기능은 아직 구현되지 않았습니다.');
  };

  return (
    <div className="find-id-page">
      <div className="find-id-container">
        <div className="auth-card">
          <h2 className="auth-title">아이디 찾기</h2>
          <p className="auth-description">
            가입 시 입력한 정보로 아이디를 확인해 드립니다.
          </p>

          <form onSubmit={handleSubmit} className="find-id-form">
            <div className="form-group">
              <label htmlFor="name">이름</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="홍길동"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">이메일</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                required
              />
            </div>

            <div className="auth-actions">
              <button type="submit" className="btn-primary">
                아이디 확인
              </button>
            </div>
          </form>

          <div className="auth-bottom">
            <span className="help-text">비밀번호가 기억나지 않나요?</span>
            <a 
              href="/find-password" 
              className="help-link"
              onClick={(e) => {
                e.preventDefault();
                navigate('/find-password');
              }}
            >
              비밀번호 찾기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

