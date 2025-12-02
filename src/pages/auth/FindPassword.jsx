import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../../styles/components/button.css';
import './FindPassword.css';

export default function FindPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('비밀번호 찾기 시도:', formData);
    // 실제 비밀번호 찾기 로직 (API 호출 등)
    alert('임시 비밀번호가 이메일로 발송되었습니다.');
  };

  return (
    <div className="find-password-page">
      <div className="find-password-container">
        <div className="auth-card">
          <h2 className="auth-title">비밀번호 찾기</h2>
          <p className="auth-description">
            가입 시 입력한 정보를 확인한 뒤, 임시 비밀번호를 발급해 드립니다.
          </p>

          <form onSubmit={handleSubmit} className="find-password-form">
            <div className="form-group">
              <label htmlFor="userId">아이디</label>
              <input
                type="text"
                id="userId"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                placeholder="아이디를 입력하세요"
                required
              />
            </div>

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
                임시 비밀번호 발급
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

