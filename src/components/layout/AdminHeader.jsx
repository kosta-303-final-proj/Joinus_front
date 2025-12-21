import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, User, LogOut } from 'lucide-react';
import './AdminHeader.css';

const AdminHeader = ({ title = '페이지 제목' }) => {
  const navigate = useNavigate();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  useEffect(() => {
    // 사이드바 접힘 여부를 DOM에서 감지해 padding을 맞춰준다.
    const checkSidebar = () => {
      const sidebar = document.querySelector('.sidebar');
      const isCollapsed = sidebar?.classList.contains('collapsed');
      setSidebarCollapsed(isCollapsed);
    };

    checkSidebar();

    const sidebar = document.querySelector('.sidebar');
    const observer = sidebar
      ? new MutationObserver(checkSidebar)
      : null;

    if (sidebar && observer) {
      observer.observe(sidebar, {
        attributes: true,
        attributeFilter: ['class'],
      });
    }

    return () => observer?.disconnect();
  }, []);

  const handleLogout = () => {
    setShowUserMenu(false);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
    alert('로그아웃되었습니다.');
    navigate('/admin/login');
  };

  const handleHomeClick = () => {
    setShowUserMenu(false);
    navigate('/');
  };

  return (
    <header
      className="admin-header"
      style={{
        paddingLeft: sidebarCollapsed ? '103px' : '293px',
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

      <div className="admin-header-right">
        <div className="admin-header-user-menu-container">
          <button
            className="admin-header-user-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <User size={20} />
          </button>

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

export default AdminHeader;