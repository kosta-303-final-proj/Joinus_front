import { useState } from 'react';
// import { Link, useLocation } from 'react-router-dom';
import './AdminSidebar.css';

export default function AdminSidebar() {
  // const location = useLocation();
  const [openMenus, setOpenMenus] = useState({});
  
  // 단일 메뉴 (드롭다운 없음)
  const singleMenuItems = [
    { path: '/admin', label: '홈' },
    { path: '/admin/notifications', label: '알림발송' },
    { path: '/admin/cs/notice/write', label: '공지사항 작성' },
  ];

  // 드롭다운 메뉴
  const dropdownMenuItems = [
    {
      key: 'proposals',
      label: '제안관리',
      path: '/admin/proposals',
      subItems: [] // 추후 하위 메뉴 추가 가능
    },
    {
      key: 'groupbuy',
      label: '공구 관리',
      path: '/admin/groupbuy',
      subItems: []
    },
    {
      key: 'exchange',
      label: '교환 및 반품 관리',
      path: '/admin/exchange',
      subItems: []
    },
    {
      key: 'members',
      label: '회원 관리',
      path: '/admin/members',
      subItems: []
    },
    {
      key: 'delivery',
      label: '납품 관리',
      path: '/admin/delivery',
      subItems: []
    },
    {
      key: 'statistics',
      label: '통계',
      path: '/admin/statistics',
      subItems: []
    },
  ];

  const toggleMenu = (key) => {
    setOpenMenus(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const isMenuActive = (item) => {
    return location.pathname.startsWith(item.path);
  };

  return (
    <aside className="sidebar">
      {/* 사이드바 헤더 */}
      <div className="sidebar-header">
        <img src="/logo-JOINus.png" alt="JOINus 로고" className="sidebar-logo" />
      </div>

      {/* 메인 메뉴 */}
      <nav className="sidebar-nav">
        {/* 단일 메뉴 */}
        {singleMenuItems.map((item) => (
          <div key={item.path} className="menu-item-wrapper">
            <Link
              to={item.path}
              className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
            >
              <span className="sidebar-label">{item.label}</span>
            </Link>
            <div className="menu-divider"></div>
          </div>
        ))}

        {/* 드롭다운 메뉴 */}
        {dropdownMenuItems.map((item) => {
          const isOpen = openMenus[item.key];
          const hasSubItems = item.subItems && item.subItems.length > 0;
          
          return (
            <div key={item.key} className="menu-item-wrapper">
              {hasSubItems ? (
                <>
                  <button
                    className={`sidebar-item sidebar-dropdown ${isMenuActive(item) ? 'active' : ''}`}
                    onClick={() => toggleMenu(item.key)}
                  >
                    <span className="sidebar-label">{item.label}</span>
                    <span className="dropdown-arrow">{isOpen ? '▲' : '▼'}</span>
                  </button>
                  {isOpen && (
                    <div className="dropdown-submenu">
                      {item.subItems.map((subItem) => (
                        <Link
                          key={subItem.path}
                          to={subItem.path}
                          className={`sidebar-item sidebar-subitem ${location.pathname === subItem.path ? 'active' : ''}`}
                        >
                          <span className="sidebar-label">{subItem.label}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </>
              ) : (
                <Link
                  to={item.path}
                  className={`sidebar-item ${isMenuActive(item) ? 'active' : ''}`}
                >
                  <span className="sidebar-label">{item.label}</span>
                </Link>
              )}
              <div className="menu-divider"></div>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

