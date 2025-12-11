import { Link } from "react-router-dom";
import "./footer.css";

const Footer = () => {
  return (
    <footer className="footer-wrapper">

        {/* ===== 상단 메뉴 영역 ===== */}
        <div className="footer-top">
            <div className="footer-top-inner">
                <ul className="footer-menu">
                    <li><Link to="/cs/notice ">고객센터</Link></li>
                    <li><Link to="/contact/supply">납품문의</Link></li>
                </ul>
            </div>
        </div>

        {/* ===== 중간 정보 영역 ===== */}
        <div className="footer-mid">
          <div className="footer-left">
            <img src="/Joinus.png" className="footer-logo" alt="Joinus" />
            <p className="footer-desc">
              Joinus는 소비자의 아이디어에서 시작되는 새로운 공동구매 플랫폼입니다. <br/>
              원하는 상품을 제안하고 함께 참여하여 더 합리적인 가격으로 구매하는 경험을 제공합니다. <br/>
              아이디어 공유·투표·참여를 통해 소비자가 직접 트렌드를 만드는 쇼핑 문화를 만들어갑니다. <br/>
            </p>
          </div>

          <div className="footer-right">
            <p className="footer-title">고객센터</p>
            <p className="footer-phone">1234-5678</p>
            <p>고객센터 마감 시간에는 1:1 문의하기를 이용해주세요.</p>
          </div>
        </div>

      {/* ===== 하단 카피라이트 ===== */}
      <div className="footer-bottom">
        Non Copyrighted © 2025 Design and upload by Joinus
      </div>

    </footer>
    );
  };

export default Footer;