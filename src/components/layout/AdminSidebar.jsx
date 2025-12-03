import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Home, FileText, ShoppingCart, Package, RefreshCw,
  Users, Bell, Megaphone, BarChart3, Menu,
  ChevronDown, ChevronRight,
  ChevronsLeft, ChevronsRight, Truck
} from 'lucide-react';
import './AdminSidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [openMenus, setOpenMenus] = useState({
    groupbuy: false, 
    member: false,
    supplier: false,
    stats: false
  });

  const toggleSubmenu = (menuId) => {
    setOpenMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
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
          <div className="menu-item active"
          onClick={() => navigate('/admin')}
            style={{ cursor: 'pointer' }} >
            <div className="menu-item-content">
              <Home size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">홈</span>}
            </div>
          </div>
        </div>

        {/* 제안관리 */}
        <div className="menu-item-container">
          <div className="menu-item"
             onClick={() => navigate('/admin/proposalMngList')}
              style={{ cursor: 'pointer' }}>
            <div className="menu-item-content">
              <FileText size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">제안관리</span>}
            </div>
          </div>
        </div>

        {/* 공구 관리 (서브메뉴 있음) */}
        <div className="menu-item-container">
          <div 
            className="menu-item"
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
              <div className="submenu-item"
              onClick={() => navigate('/admin/gbProductMngList')}
              style={{ cursor: 'pointer' }}>
                <span className="submenu-label">공구 목록 조회</span>
              </div>
              <div className="submenu-item"
              onClick={() => navigate('/admin/adminOrderList')}
              style={{ cursor: 'pointer' }}>
                <span className="submenu-label">공구 상품 주문/배송 관리</span>
              </div>
            </div>
          )}
        </div>

        {/* 교환 및 반품 관리 */}
        <div className="menu-item-container">
          <div className="menu-item" 
          onClick={() => navigate('/admin/ExchRtrnWaitingList')}
              style={{ cursor: 'pointer' }}>
            <div className="menu-item-content">
              <RefreshCw size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">교환 및 반품 관리</span>}
            </div>
          </div>
        </div>

        {/* 회원 관리 (서브메뉴 있음)  */}
        <div className="menu-item-container">
          <div className="menu-item"
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
              <div className="submenu-item"
              onClick={() => navigate('/admin/noticeList')}
              style={{ cursor: 'pointer' }}>
                <span className="submenu-label">공지사항</span>
              </div>
              <div className="submenu-item"
              onClick={() => navigate('/admin/faqAndInquiryList')}
              style={{ cursor: 'pointer' }}>
                <span className="submenu-label">FAQ 및 1:1문의</span>
              </div>
              <div className="submenu-item"
              onClick={() => navigate('/admin/memberList')}
              style={{ cursor: 'pointer' }}>
                <span className="submenu-label">회원 조회</span>
              </div>
            </div>
          )}
        </div>

        {/* 납품 관리 (서브메뉴 있음)  */}
        <div className="menu-item-container">
          <div className="menu-item"
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
      className="submenu-item"
      onClick={() => navigate('/admin/suppliy/applications')}
      style={{ cursor: 'pointer' }}
    >
      <span className="submenu-label">납품신청업체</span>
    </div>

    {/* 납품회사조회 (승인된 회사) */}
    <div
      className="submenu-item"
      onClick={() => navigate('/admin/suppliy/approved')}
      style={{ cursor: 'pointer' }}
    >
      <span className="submenu-label">납품회사조회</span>
    </div>

    {/* 납품상품 등록 */}
    <div
      className="submenu-item"
      onClick={() => navigate('/admin/suppliy/products/new')}
      style={{ cursor: 'pointer' }}
    >
      <span className="submenu-label">납품상품 등록</span>
    </div>

    {/* 납품상품 조회 */}
    <div
      className="submenu-item"
      onClick={() => navigate('/admin/suppliy/products')}
      style={{ cursor: 'pointer' }}
    >
      <span className="submenu-label">납품상품 조회</span>
    </div>
  </div>
)}
        </div>

        {/* 알림 */}
        <div className="menu-item-container">
          <div className="menu-item">
            <div className="menu-item-content">
              <Bell size={20} className="menu-icon" />
              {!isCollapsed && <span className="menu-label">알림발송</span>}
            </div>
          </div>
        </div>

        {/* 통계 (서브메뉴 있음) */}
        <div className="menu-item-container">
          <div 
            className="menu-item"
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
              <div className="submenu-item">
                <span className="submenu-label">매출통계</span>
              </div>
              <div className="submenu-item">
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