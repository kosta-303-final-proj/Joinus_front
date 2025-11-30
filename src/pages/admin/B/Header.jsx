// components/common/Header.jsx
import React, { useState } from 'react';
import { Home, User, LogOut } from 'lucide-react';
import './Header.css';

const Header = ({ title = "페이지 제목" }) => {
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="admin-header">
      {/* 왼쪽: 홈 아이콘 */}
      <div className="header-left">
        <button className="home-btn" title="홈으로">
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
              <button className="user-menu-item">
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