import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch, baseUrl } from '../../config';
import '../../styles/components/button.css';
import './FindId.css';

export default function FindId() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [foundUsername, setFoundUsername] = useState(null);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // 입력 변경 시 결과 초기화
    setFoundUsername(null);
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setFoundUsername(null);

    try {
      // apiFetch 대신 일반 fetch 사용 (인증 불필요)
      const response = await fetch(`${baseUrl}/find-id`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email
        })
      });

      if (!response.ok) {
        // 에러 응답의 상세 정보 확인
        const errorText = await response.text();
        console.error('아이디 찾기 실패:', response.status, errorText);
        throw new Error('아이디 찾기에 실패했습니다.');
      }

      const username = await response.text(); // 백엔드가 String으로 반환
      
      if (username && username !== 'null' && username.trim() !== '') {
        setFoundUsername(username);
      } else {
        setError('입력하신 정보와 일치하는 아이디를 찾을 수 없습니다.');
      }
    } catch (error) {
      console.error('아이디 찾기 실패:', error);
      setError('입력하신 정보와 일치하는 아이디를 찾을 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
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
            {foundUsername && (
              <div className="result-success">
                <p>찾으시는 아이디는 <strong>{foundUsername}</strong> 입니다.</p>
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
                {isLoading ? '확인 중...' : '아이디 확인'}
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
                navigate('/findPw');
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

