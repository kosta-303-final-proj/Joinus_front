import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import { myAxios } from '../../config';
import './Header.css';

const Header = ({ title = "페이지 제목" }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  // 로그아웃 처리 함수
  const handleLogout = async () => {
    setShowUserMenu(false);

    try {
      // 1. 백엔드 로그아웃 API 호출 (예시)
      // 백엔드에서 토큰 무효화 처리가 필요하다면 이 부분을 사용.
      // await myAxios().post('/admin/logout'); 

      // 2. 클라이언트 측 토큰/정보 제거
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      // 세션 정보 등을 관리하는 상태도 여기서 초기화해야.

      alert("로그아웃되었습니다.");

    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
      // 오류가 발생해도 사용자 경험을 위해 강제로 토큰 삭제 후 이동
    } finally {
      // 3. 관리자 로그인 페이지로 이동
      navigate('/admin/login');
    }
  };

  // 홈 버튼 클릭 핸들러
  const handleHomeClick = () => {
    // 메뉴가 열려있다면 닫기
    setShowUserMenu(false);
    // 메인 페이지로 이동
    navigate('/');
  };

  return (
    <header className="admin-header">
      {/* 왼쪽: 홈 아이콘 */}
      <div className="header-left">
        <button className="home-btn"
          title="홈으로"
          onClick={handleHomeClick}>
          <Home size={20} />
        </button>
        <h1 className="page-title">{title}</h1>
      </div>

      {/* 오른쪽: 로그인 관련 메뉴 */}
      <div className="header-right">
        <div className="user-menu-container">
          <button
            className="user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User size={20} />
          </button>

          {/* 드롭다운 메뉴 */}
          {showUserMenu && (
            <div className="user-dropdown">
              <div className="user-info">
                <p className="user-name">관리자</p>
                <p className="user-email">admin@joinus.com</p>
              </div>
              <div className="user-menu-divider"></div>
              <button
                className="user-menu-item"
                onClick={handleLogout}
              >
                <LogOut size={16} />
                <span>로그아웃</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;