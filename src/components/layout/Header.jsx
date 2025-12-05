import { useState, useRef, useEffect } from "react";
import "./Header.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link } from "react-router-dom";

export default function Header() {
  const [hoverMenu, setHoverMenu] = useState(null);
  const hideTimer = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);

  // ========== Login 여부 확인 ==========
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = localStorage.getItem('access_token');
      const storedUserInfo = localStorage.getItem('userInfo');
      
      if (accessToken && storedUserInfo) {
        setIsLoggedIn(true);
        try {
          setUserInfo(JSON.parse(storedUserInfo));
        } catch (e) {
          console.error('사용자 정보 파싱 실패:', e);
          setUserInfo(null);
        }
      } else {
        setIsLoggedIn(false);
        setUserInfo(null);
      }
    };

    // 초기 로드 시 확인
    checkLoginStatus();

    // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시 동기화)
    window.addEventListener('storage', checkLoginStatus);

    // 주기적으로 확인 (같은 탭에서 로그인/로그아웃 시)
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      window.removeEventListener('storage', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

  // 사용자 정보에서 닉네임과 등급 가져오기
  const nickname = userInfo?.nickname || userInfo?.name || "사용자";
  const grade = userInfo?.grade || "Gold";

  // ========== Menu css용 ==========
  const handleEnter = (menu) => {
    if (hideTimer.current) clearTimeout(hideTimer.current);
    setHoverMenu(menu);

    const el = document.querySelector(".dropdown-wrapper");
    if (el) el.style.transition = "opacity 0.25s ease, transform 0.25s ease";
  };

  const handleLeave = () => {
    hideTimer.current = setTimeout(() => {
      const el = document.querySelector(".dropdown-wrapper");
      if (!el) return;

      el.style.transition = "none"; // 닫힐 때 애니메이션 제거
      setHoverMenu(null);

      requestAnimationFrame(() => {
        el.style.transition = "";
      });

    }, 300);
  };

  return (
    <header className="header-wrapper">
      {/* ========== 상단 로그인 바 ========== */}
      <div className="header-top">
        <div className="header-top-inner">
          <ul className="top-menu">
            {/* 로그인 / 로그아웃 상태에 따른 메뉴 변경 */}
            {isLoggedIn ? (
              <>
               {/* 등급 아이콘 + 닉네임 */}
                <li className="user-info">
                  <img
                      src={`/grade/${grade}.png`}
                      alt={grade}
                      className="grade-icon"
                    />
                  <Link to="/mypage">{nickname} 님</Link>
                </li>

                <li><Link to="/logout">로그아웃</Link></li>
                <li><Link to="/mypage/main">마이페이지</Link></li>
              </>
            ) : (
              <>
                <li><Link to="/signup">회원가입</Link></li>
                <li><Link to="/login">로그인</Link></li>
              </>
            )}

            {/* 공통 메뉴 */}
            <li><Link to="/mypage/shoppingCartList">장바구니</Link></li>
            <li><Link to="/mypage/orderList">주문배송</Link></li>
            <li><Link to="/proposalWrite">제안하기</Link></li>
            <li><Link to="/contact/supply">납품문의</Link></li>

          </ul>
        </div>
      </div>

      {/* ========== 메인 헤더 ========== */}
      <div className="header-main">
        <div className="header-inner">
          <Link to="/">
            <img src="/Joinus.png" alt="Joinus 로고" className="logo" />
          </Link>

          <nav className="main-menu">
            <Link to="/gbProductList"
              className={hoverMenu === "group" ? "active-menu" : ""}
               onMouseEnter={() => handleEnter("group")}
                onMouseLeave={handleLeave}>
              공동 구매
            </Link>

           <Link to="/proposalsList"
                className={hoverMenu === "suggest" ? "active-menu" : ""}
                onMouseEnter={() => handleEnter("suggest")}
                onMouseLeave={handleLeave} >
                제안 목록
            </Link> 
          </nav>

          <div className="search-box">
            <i className="bi bi-search"></i>
            <input type="text" placeholder="상품명, 카테고리를 검색하세요." />
          </div>
        </div>
      </div>

      {/* ========== 드롭다운 ========== */}
      <div
        className={`dropdown-wrapper ${hoverMenu ? "show" : ""}`}
        onMouseEnter={() => handleEnter(hoverMenu)}
        onMouseLeave={handleLeave}
      >
        <div className="dropdown-inner">
          {hoverMenu === "group" && (
            <ul>
              <li><Link to="/group-purchase">전체 보기</Link></li>
              <li><Link to="/group-purchase/beauty">뷰티</Link></li>
              <li><Link to="/group-purchase/fashion">패션</Link></li>
              <li><Link to="/group-purchase/electronics">전자기기</Link></li>
              <li><Link to="/group-purchase/home-living">홈앤리빙</Link></li>
              <li><Link to="/group-purchase/food">식품</Link></li>
              <li><Link to="/group-purchase/sports">스포츠</Link></li>
            </ul>
          )}

          {hoverMenu === "suggest" && (
            <ul>
              <li><Link to="/proposalsList">전체 보기</Link></li>
              <li><Link to="/proposalsList/beauty">뷰티</Link></li>
              <li><Link to="/proposalsList/fashion">패션</Link></li>
              <li><Link to="/proposalsList/electronics">전자기기</Link></li>
              <li><Link to="/proposalsList/home-living">홈앤리빙</Link></li>
              <li><Link to="/proposalsList/food">식품</Link></li>
              <li><Link to="/proposalsList/sports">스포츠</Link></li>
            </ul>
          )}
        </div>
      </div>
      <hr style={{margin: "0 auto"}}/>
    </header>
    );
  }
