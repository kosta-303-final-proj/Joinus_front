import { useState, useRef, useEffect } from "react";
import "./Header.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import { Link, useNavigate } from "react-router-dom";

export default function Header() {
  const [hoverMenu, setHoverMenu] = useState(null);
  const hideTimer = useRef(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState(null);
  const [searchKeyword, setSearchKeyword] = useState('');
  const navigate = useNavigate();

  // ========== Login 여부 확인 ==========
  useEffect(() => {
    const checkLoginStatus = () => {
      const accessToken = sessionStorage.getItem('access_token');
      const storedUserInfo = sessionStorage.getItem('userInfo');
      
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

    
    // ⚠️ 주의: sessionStorage는 같은 탭에서만 작동하므로 
    // storage 이벤트 리스너는 의미가 없을 수 있습니다.
    // 같은 탭에서만 동기화되므로 interval만 사용하는 것을 고려하세요.
    
    // // storage 이벤트 리스너 추가 (다른 탭에서 로그인/로그아웃 시 동기화)
    // window.addEventListener('storage', checkLoginStatus);
    
    // 초기 로드 시 확인
    checkLoginStatus();
    // 주기적으로 확인 (같은 탭에서 로그인/로그아웃 시)
    const interval = setInterval(checkLoginStatus, 1000);

    return () => {
      // window.removeEventListener('storage', checkLoginStatus);
      clearInterval(interval);
    };
  }, []);

// 사용자 정보에서 닉네임과 등급 가져오기
  const nickname = userInfo?.nickname || userInfo?.name || "사용자";
  
  // DB에서 온 대문자(SILVER)를 파일명(Silver) 형식으로 변환
const rawGrade = userInfo?.grade; 
  const grade = rawGrade 
    ? rawGrade.charAt(0).toUpperCase() + rawGrade.slice(1).toLowerCase() 
    : null;

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

  // 검색 핸들러
  const handleSearch = (e) => {
    e.preventDefault();
    const keyword = searchKeyword.trim();
    console.log('검색 실행:', keyword); // 디버깅용
    if (keyword) {
      const url = `/searchResult?keyword=${encodeURIComponent(keyword)}`;
      console.log('이동할 URL:', url); // 디버깅용
      navigate(url);
    } else {
      navigate('/searchResult');
    }
  };

  const handleIconClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const keyword = searchKeyword.trim();
    console.log('아이콘 클릭 - 검색 실행:', keyword); // 디버깅용
    if (keyword) {
      const url = `/searchResult?keyword=${encodeURIComponent(keyword)}`;
      console.log('이동할 URL:', url); // 디버깅용
      navigate(url);
    } else {
      navigate('/searchResult');
    }
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
                  {grade && (
  <img
    src={`/grade/${grade}.png`}
    alt={grade}
    className="grade-icon"
  />
  )}
                  <Link to="/mypage/main">{nickname} 님</Link>
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
            <li><Link to="/mypage/shopCartList">장바구니</Link></li>
            <li><Link to="/mypage/orderList">주문배송</Link></li>
            <li><Link to="/proposalWrite">제안하기</Link></li>
            <li><Link to="/Partnership">납품문의</Link></li>

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

          <form className="search-box" onSubmit={handleSearch}>
            <i 
              className="bi bi-search" 
              onClick={handleIconClick} 
              style={{ cursor: 'pointer' }}
              role="button"
              tabIndex={0}
            ></i>
            <input 
              type="text" 
              placeholder="상품명, 카테고리를 검색하세요." 
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
          </form>
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
              <li><Link to="/gbProductList">공구 전체 보기</Link></li>
              <li><Link to="/gbProductList?category=뷰티">뷰티</Link></li>
              <li><Link to="/gbProductList?category=패션">패션</Link></li>
              <li><Link to="/gbProductList?category=전자기기">전자기기</Link></li>
              <li><Link to="/gbProductList?category=홈&리빙">홈앤리빙</Link></li>
              <li><Link to="/gbProductList?category=식품">식품</Link></li>
              <li><Link to="/gbProductList?category=스포츠">스포츠</Link></li>
            </ul>
          )}

          {hoverMenu === "suggest" && (
            <ul>
              <li><Link to="/proposalsList">제안 전체 보기</Link></li>
              <li><Link to="/proposalsList?category=뷰티">뷰티</Link></li>
              <li><Link to="/proposalsList?category=패션">패션</Link></li>
              <li><Link to="/proposalsList?category=전자기기">전자기기</Link></li>
              <li><Link to="/proposalsList?category=홈&리빙">홈앤리빙</Link></li>
              <li><Link to="/proposalsList?category=식품">식품</Link></li>
              <li><Link to="/proposalsList?category=스포츠">스포츠</Link></li>
            </ul>
          )}
        </div>
      </div>
      <hr style={{margin: "0 auto"}}/>
    </header>
    );
  }
