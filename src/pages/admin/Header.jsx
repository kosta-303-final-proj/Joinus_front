import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import { myAxios } from '../../config';
import './Header.css';

const Header = ({ title = "페이지 제목" }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);

  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // 사이드바 상태 체크
    const checkSidebar = () => {
      const sidebar = document.querySelector('.sidebar');
      const isCollapsed = sidebar?.classList.contains('collapsed');
      setSidebarCollapsed(isCollapsed);
    };
    checkSidebar();

    // DOM 변경 감지 (사이드바 토글 시)
    const observer = new MutationObserver(checkSidebar);
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebar) {
      observer.observe(sidebar, { 
        attributes: true, 
        attributeFilter: ['class'] 
      });
    }

    return () => observer.disconnect();
  }, []);


  const handleLogout = async () => {
    setShowUserMenu(false);

    try {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      alert("로그아웃되었습니다.");
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    } finally {
      navigate('/admin/login');
    }
  };

  const handleHomeClick = () => {
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header 
      className="admin-header"
      style={{
        paddingLeft: sidebarCollapsed ? '103px' : '293px'
      }}
    >
      <div className="admin-header-left">
        <button 
          className="admin-header-home-btn"
          title="홈으로"
          onClick={handleHomeClick}
        >
          <Home size={20} />
        </button>
        <h1 className="admin-header-title">{title}</h1>
      </div>

      {/*  오른쪽 */}
      <div className="admin-header-right">
        <div className="admin-header-user-menu-container">
          <button
            className="admin-header-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User size={20} />
          </button>

          {/*  드롭다운 */}
          {showUserMenu && (
            <div className="admin-header-user-dropdown">
              <div className="admin-header-user-info">
                <p className="admin-header-user-name">관리자</p>
                <p className="admin-header-user-email">admin@joinus.com</p>
              </div>
              <div className="admin-header-user-divider"></div>
              <button
                className="admin-header-user-menu-item"
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