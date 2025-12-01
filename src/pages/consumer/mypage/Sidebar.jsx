import React from "react";
import { Nav, NavItem } from "reactstrap"; 
import { NavLink } from "react-router-dom";   
import "bootstrap/dist/css/bootstrap.min.css";
import UserInfo from "./UserInfo";

export default function Sidebar({children}) {
  return (<>
    <div
      style={{
        width: "1020px",
        margin: "0 auto",
        display: "flex",
        flexDirection: "row",
        minHeight: "100vh",
      }}
    >
      {/* Sidebar */}
      <div
        style={{
          width: "150px",
          padding: "10px 8px",
          backgroundColor: "#fff",
          flexShrink: 0,
        }}
      >
        <h5 className="mb-4 fw-bold" style={{fontSize:"20px"}}>마이페이지</h5>
        

        {/* 쇼핑 정보 */}
        <div className="mb-4">
          <h6 className="fw-bold mb-2" style={{ color: "#739FF2", fontSize:"14px" }}>쇼핑 정보</h6>
          <Nav vertical>
            <NavItem>
              <NavLink to="/mypage/orderList" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                주문/배송조회
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/mypage/shopCartList" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                장바구니
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/mypage/interestList" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                관심상품
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                취소/교환/반품 내역
              </NavLink>
            </NavItem>
          </Nav>
        </div>

        {/* 내 활동 */}
        <div className="mb-4">
          <h6 className="fw-bold mb-2" style={{ color: "#739FF2", fontSize:"14px" }}>내 활동</h6>
          <Nav vertical>
            <NavItem>
              {/* 문의한 목록  */}
              <NavLink to='/mypage/inquiryHistoryList' style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                1:1 문의 내역
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                참여중인 제안
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink to="/mypage/reviewManage" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                리뷰 관리
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                알림
              </NavLink>
            </NavItem>
          </Nav>
        </div>

        {/* 내 정보 */}
        <div>
          <h6 className="fw-bold mb-2" style={{ color: "#739FF2", fontSize:"14px" }}>내 정보</h6>
          <Nav vertical>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                포인트
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                회원 등급
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                배송지 관리
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                결제 수단 관리
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                환불 계좌 관리
              </NavLink>
            </NavItem>
            <NavItem>
              <NavLink href="#" style={{ color: "#000", fontSize:"12px", textDecoration: "none" }}>
                개인정보 관리
              </NavLink>
            </NavItem>
          </Nav>
        </div>
      </div>
        
      {/* Content */}
      <div style={{ flex: 1, padding: "10px", width:'880px'}}><UserInfo />{children}</div>
      
    </div>
  </>);
}
