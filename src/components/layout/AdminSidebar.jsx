import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Home, FileText, ShoppingCart, Package, RefreshCw,
  Users, Bell, Megaphone, BarChart3, Menu,
  ChevronDown, ChevronRight,
  ChevronsLeft, ChevronsRight, Truck
} from 'lucide-react';
import './AdminSidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    groupbuy: false, 
    member: false,
    supplier: false,
    stats: false
  });

  // 메뉴 그룹별 경로 정의
  const menuPaths = {
    groupbuy: ['/admin/gbProduct', '/admin/adminOrder'],
    member: ['/admin/notice', '/admin/faq', '/admin/member', '/admin/inquiry'],
    supplier: ['/admin/suppliy'], 
    stats: ['/admin/statistics']
  };

  const toggleSubmenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  // 단일/배열 경로 확인
  const isActive = (path) => {
    if (Array.isArray(path)) {
      return path.some(p => location.pathname.startsWith(p));
    }
    return location.pathname === path;
  };

  // 메뉴 그룹 active 확인
  const isGroupActive = (groupId) => {
    return menuPaths[groupId]?.some(p => location.pathname.startsWith(p)) || false;
  };

  return (
    <div className={`sidebar ${isCollapsed ? 'collapsed' : ''}`}>

      {/* 헤더 */}
      <div className="sidebar-header">
        <div className="logo-container">
          {!isCollapsed && (
            <div className="logo">
              <span className="logo-icon" ><img src="/logo.svg" width="60px"/></span>
              <span className="logo-text">JOINus</span>
            </div>
          )}
          {isCollapsed && (
            <div className="logo-icon-only"> </div>
          )}
        </div>
        <button 
          className="toggle-btn"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          {isCollapsed ? 
            <ChevronsRight size={20} /> : 
            <ChevronsLeft size={20} />
          }
        </button>
      </div>

      {/* 메뉴 리스트 */}
      <nav className="sidebar-nav">
        
        {/* 홈 */}
        <div className="menu-item-container">
          <div 
            className={`menu-item ${isActive('/admin') ? 'active' : ''}`}
            onClick={() => navigate('/admin')}
            style={{ cursor: 'pointer' }}
          >
            <div className="menu-item-content">
              <Home size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">홈</span>}
            </div>
          </div>
        </div>

        {/* 제안관리 */}
        <div className="menu-item-container">
          <div 
            className={`menu-item ${isActive('/admin/proposalMngList') ? 'active' : ''}`}
            onClick={() => navigate('/admin/proposalMngList')}
            style={{ cursor: 'pointer' }}
          >
            <div className="menu-item-content">
              <FileText size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">제안관리</span>}
            </div>
          </div>
        </div>

        {/* 공구 관리 (서브메뉴 있음) */}
        <div className="menu-item-container">
          <div 
            className={`menu-item ${isGroupActive('groupbuy') ? 'active' : ''}`}
            onClick={() => toggleSubmenu('groupbuy')}
          >
            <div className="menu-item-content">
              <ShoppingCart size={20} className="menu-icon" />
              {!isCollapsed && (
                <>
                  <span className="menu-label">공구 관리</span>
                  <span className="menu-arrow">
                    {openMenus.groupbuy ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </span>
                </>
              )}
            </div>
          </div>
          
          {/* 서브메뉴 */}
          {openMenus.groupbuy && !isCollapsed && (
            <div className="submenu">
              <div 
                className={`submenu-item ${isActive('/admin/gbProductMngList') ? 'active' : ''}`}
                onClick={() => navigate('/admin/gbProductMngList')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">공구 목록 조회</span>
              </div>
              <div 
                className={`submenu-item ${isActive('/admin/adminOrderList') ? 'active' : ''}`}
                onClick={() => navigate('/admin/adminOrderList')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">공구 상품 구매/배송 관리</span>
              </div>
            </div>
          )}
        </div>

        {/* 교환 및 반품 관리 */}
        {/* <div className="menu-item-container">
          <div 
            className={`menu-item ${isActive('/admin/ExchRtrnWaitingList') ? 'active' : ''}`}
            onClick={() => navigate('/admin/ExchRtrnWaitingList')}
            style={{ cursor: 'pointer' }}
          >
            <div className="menu-item-content">
              <RefreshCw size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">교환 및 반품 관리</span>}
            </div>
          </div>
        </div> */}

        {/* 회원 관리 (서브메뉴 있음)  */}
        <div className="menu-item-container">
          <div 
            className={`menu-item ${isGroupActive('member') ? 'active' : ''}`}
            onClick={() => toggleSubmenu('member')}
          >
            <div className="menu-item-content">
              <Users size={20} className="menu-icon" />
              {!isCollapsed && (
                <>
                  <span className="menu-label">회원 관리</span>
                  <span className="menu-arrow">
                    {openMenus.member ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </span>
                </>
              )}
            </div>
          </div>
          
          {openMenus.member && !isCollapsed && (
            <div className="submenu">
              <div 
                className={`submenu-item ${isActive('/admin/noticeList') ? 'active' : ''}`}
                onClick={() => navigate('/admin/noticeList')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">공지사항</span>
              </div>
              <div 
                className={`submenu-item ${isActive(['/admin/faqAndInquiryList', '/admin/faqForm', '/admin/inquiryDetail']) ? 'active' : ''}`}
                onClick={() => navigate('/admin/faqAndInquiryList')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">FAQ 및 문의</span>
              </div>
              <div 
                className={`submenu-item ${isActive(['/admin/memberList', '/admin/member']) ? 'active' : ''}`}
                onClick={() => navigate('/admin/memberList')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">회원 조회</span>
              </div>
            </div>
          )}
        </div>

        {/* 납품 관리 (서브메뉴 있음)  */}
        <div className="menu-item-container">
          <div 
            className={`menu-item ${isGroupActive('supplier') ? 'active' : ''}`}
            onClick={() => toggleSubmenu('supplier')}
          >
            <div className="menu-item-content">
              <Truck size={20} className="menu-icon" />
              {!isCollapsed && (
                <>
                  <span className="menu-label">납품 관리</span>
                  <span className="menu-arrow">
                    {openMenus.supplier ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </span>
                </>
              )}
            </div>
          </div>
          
          {openMenus.supplier && !isCollapsed && (
            <div className="submenu">
              {/* 납품신청업체 */}
              <div
                className={`submenu-item ${isActive('/admin/suppliy/applications') ? 'active' : ''}`}
                onClick={() => navigate('/admin/suppliy/applications')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">납품 신청 업체</span>
              </div>

              {/* 납품회사조회 */}
              <div
                className={`submenu-item ${isActive('/admin/suppliy/approved') ? 'active' : ''}`}
                onClick={() => navigate('/admin/suppliy/approved')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">납품 회사 조회</span>
              </div>

              {/* 납품상품 등록 */}
              <div
                className={`submenu-item ${isActive('/admin/suppliy/products/new') ? 'active' : ''}`}
                onClick={() => navigate('/admin/suppliy/products/new')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">납품 상품 등록</span>
              </div>

              {/* 납품상품 조회 */}
              <div
                className={`submenu-item ${isActive('/admin/suppliy/products') ? 'active' : ''}`}
                onClick={() => navigate('/admin/suppliy/products')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">납품 상품 조회</span>
              </div>
            </div>
          )}
        </div>

        {/* 알림 */}
        <div className="menu-item-container">
          <div 
          className={`menu-item ${isActive('/admin/notifications') ? 'active' : ''}`}
          onClick={() => navigate('/admin/notifications')}
          style={{ cursor: 'pointer' }}
          >
            <div className="menu-item-content">
              <Bell size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">알림발송</span>}
            </div>
          </div>
        </div>

        {/* 통계 (서브메뉴 있음) */}
        <div className="menu-item-container">
          <div 
            className={`menu-item ${isGroupActive('stats') ? 'active' : ''}`}
            onClick={() => toggleSubmenu('stats')}
          >
            <div className="menu-item-content">
              <BarChart3 size={20} className="menu-icon" />
              {!isCollapsed && (
                <>
                  <span className="menu-label">통계</span>
                  <span className="menu-arrow">
                    {openMenus.stats ? 
                      <ChevronDown size={16} /> : 
                      <ChevronRight size={16} />
                    }
                  </span>
                </>
              )}
            </div>
          </div>

          {openMenus.stats && !isCollapsed && (
            <div className="submenu">
              <div 
                className={`submenu-item ${isActive('/admin/statistics') ? 'active' : ''}`}
                onClick={() => navigate('/admin/statistics')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">매출통계</span>
              </div>
              <div 
                className={`submenu-item ${isActive('/admin/statistics/product') ? 'active' : ''}`}
                onClick={() => navigate('/admin/statistics/product')}
                style={{ cursor: 'pointer' }}
              >
                <span className="submenu-label">상품별 통계</span>
              </div>
            </div>
          )}

        </div>

      </nav>
    </div>
  );
};

export default Sidebar;