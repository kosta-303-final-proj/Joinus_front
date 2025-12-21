import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import '../../styles/components/button.css';
import './FindPassword.css';

export default function FindPassword() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userId: '',
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [tempPassword, setTempPassword] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 변경 시 결과 초기화
    setTempPassword(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setTempPassword(null);

    try {
      const response = await myAxios().post('/find-pw', {
        username: formData.userId,
        name: formData.name,
        email: formData.email
      });

      const password = response.data; // 백엔드가 String으로 반환
      
      if (password && password !== 'null') {
        setTempPassword(password);
      } else {
        setError('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('비밀번호 찾기 실패:', error);
      setError('입력하신 정보와 일치하는 계정을 찾을 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
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
                disabled={isLoading}
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
                disabled={isLoading}
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
                disabled={isLoading}
              />
            </div>

            {/* 결과 표시 */}
            {tempPassword && (
              <div className="result-success">
                <p><strong>임시 비밀번호가 발급되었습니다.</strong></p>
                <div className="temp-password-box">
                  <p>임시 비밀번호: <strong>{tempPassword}</strong></p>
                  <p className="warning-text">로그인 후 반드시 비밀번호를 변경해주세요.</p>
                </div>
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => navigate('/login')}
                >
                  로그인 하기
                </button>
              </div>
            )}

            {error && (
              <div className="result-error">
                <p>{error}</p>
              </div>
            )}

            <div className="auth-actions">
              <button 
                type="submit" 
                className="btn-primary"
                disabled={isLoading}
              >
                {isLoading ? '발급 중...' : '임시 비밀번호 발급'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

