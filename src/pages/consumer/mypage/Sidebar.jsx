import React, { useEffect, useState } from "react";
import { Nav, NavItem } from "reactstrap";
import { NavLink } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import UserInfo from "./UserInfo";
import axios from "axios";

export default function Sidebar({ children }) {
  const [unreadCount, setUnreadCount] = useState(0);

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  const PRIMARY_BLUE = "#739FF2";
  const PRIMARY_BLUE_BG = "#EEF3FF";
  const TEXT_BLACK = "#000";

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? PRIMARY_BLUE : TEXT_BLACK,
    fontSize: "12px",
    textDecoration: "none",
    fontWeight: isActive ? "700" : "400",
    padding: "4px 6px",
    borderRadius: "6px",
    backgroundColor: isActive ? PRIMARY_BLUE_BG : "transparent",
    display: "inline-block",
    marginBottom: "4px",
  });

  useEffect(() => {
    if (!username) return;

    axios
      .get(`http://localhost:8080/mypage/alert?username=${username}`)
      .then((res) => {
        const count = (res.data || []).filter((a) => !a.readedAt).length;
        setUnreadCount(count);
      })
      .catch(() => setUnreadCount(0));
  }, [username]);

  return (
    <>
      <div
        style={{
          width: "1020px",
          margin: "8px auto",
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
          <NavLink to="/mypage/main" style={{ textDecoration: "none" }}>
            <h5
              className="mb-4 fw-bold"
              style={{ fontSize: "20px", color: TEXT_BLACK }}
            >
              마이페이지
            </h5>
          </NavLink>

          {/* 쇼핑 정보 */}
          <div className="mb-4">
            <h6
              className="fw-bold mb-2"
              style={{ color: PRIMARY_BLUE, fontSize: "14px" }}
            >
              쇼핑 정보
            </h6>
            <Nav vertical>
              <NavItem>
                <NavLink to="/mypage/orderList" style={navLinkStyle}>
                  주문/배송조회
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/shopCartList" style={navLinkStyle}>
                  장바구니
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/interestList" style={navLinkStyle}>
                  관심상품
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/cnclExchRtrnHisList" style={navLinkStyle}>
                  취소/교환/반품 내역
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          {/* 내 활동 */}
          <div className="mb-4">
            <h6
              className="fw-bold mb-2"
              style={{ color: PRIMARY_BLUE, fontSize: "14px" }}
            >
              내 활동
            </h6>
            <Nav vertical>
              <NavItem>
                <NavLink to="/mypage/inquiryHistoryList" style={navLinkStyle}>
                  1:1 문의 내역
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/suggestions" style={navLinkStyle}>
                  공동구매 요청
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/reviewManage" style={navLinkStyle}>
                  리뷰 관리
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  to="/mypage/alert"
                  style={({ isActive }) => ({
                    ...navLinkStyle({ isActive }),
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  })}
                >
                  알림
                  {unreadCount > 0 && (
                    <span
                      style={{
                        fontSize: "11px",
                        backgroundColor: PRIMARY_BLUE,
                        color: "#fff",
                        borderRadius: "999px",
                        minWidth: "18px",
                        height: "18px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "600",
                        lineHeight: 1,
                      }}
                    >
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </NavItem>
            </Nav>
          </div>

          {/* 내 정보 */}
          <div>
            <h6
              className="fw-bold mb-2"
              style={{ color: PRIMARY_BLUE, fontSize: "14px" }}
            >
              내 정보
            </h6>
            <Nav vertical>
              <NavItem>
                <NavLink to="/mypage/points" style={navLinkStyle}>
                  포인트
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/tier" style={navLinkStyle}>
                  회원 등급
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/addressList" style={navLinkStyle}>
                  배송지 관리
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink to="/mypage/profileIndex" style={navLinkStyle}>
                  개인정보 관리
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>

        {/* Content */}
        <div style={{ flex: 1, padding: "10px", width: "880px" }}>
          <UserInfo />
          {children}
        </div>
      </div>
    </>
  );
}
