import React from "react";
import "./MypageTier.css";

export default function MypageTier() {
  return (
    <>
      <div className="mypageTier_page-title">회원 등급</div>
      <p className="mypageTier_page-desc">
        연간 구매 금액에 따라 등급이 결정되며, 상품 구매시 등급별로 포인트가 적립됩니다.
      </p>

      {/* 현재 등급 박스 */}
      <div className="mypageTier_grade-box">

        <div className="mypageTier_grade-img">★</div>

        <div className="mypageTier_grade-info-area">
          <div className="mypageTier_grade-now">현재 등급 : 골드</div>

          <div className="mypageTier_progress-wrap">
            <div className="mypageTier_progress-bg">
              <div className="mypageTier_progress-bar"></div>
            </div>
          </div>

          <div className="mypageTier_progress-text">
            <span>올해 구매금액 1,250,000원</span>
            <span>다이아까지 1,150,000원 남음</span>
          </div>
        </div>

      </div>

      {/* 등급 리스트 */}
      <div className="mypageTier_grade-list">

        <div className="mypageTier_grade-item">
          <h3>브론즈 <span>10%</span></h3>
          <p>연간 구매 0원 ~ 149,999원</p>
          <p>포인트 적립률 10%</p>
        </div>

        <div className="mypageTier_grade-item">
          <h3>실버 <span>13%</span></h3>
          <p>연간 구매 150,000원 ~ 599,999원</p>
          <p>포인트 적립률 13%</p>
        </div>

        <div className="mypageTier_grade-item mypageTier_current">
          <h3>골드 <span>16%</span></h3>
          <p>연간 구매 600,000원 ~ 2,399,999원</p>
          <p>포인트 적립률 16%</p>
        </div>

        <div className="mypageTier_grade-item">
          <h3>다이아 <span>20%</span></h3>
          <p>연간 구매 2,400,000원 이상</p>
          <p>포인트 적립률 20%</p>
        </div>

      </div>

      {/* 안내 박스 */}
      <div className="mypageTier_info-box">
        <span>등급 산정 안내</span><br />
        · 등급은 매년 1월 1일 기준으로 초기화됩니다.<br />
        · 등급 상승 시 별도 신청 없이 자동 적용됩니다.<br />
        · 취소/반품된 주문에 대한 포인트 적립은 제외됩니다.<br />
      </div>
    </>
  );
}
