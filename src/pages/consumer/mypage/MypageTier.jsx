import React from "react";
import "./MypageTier.css";

export default function MypageTier() {
  // 서버에서 받아온다고 가정하는 값
  const totalSpent = 1000000; // 최근 6개월 구매금액 (예시)

  // 등급 기준표
  const levels = [
    { name: "Bronze", file: "Bronze.png", min: 0, max: 400000, rate: 1 },
    { name: "Silver", file: "Silver.png", min: 400000, max: 700000, rate: 1.3 },
    { name: "Gold", file: "Gold.png", min: 700000, max: 1000000, rate: 1.6 },
    { name: "Diamond", file: "Diamond.png", min: 1000000, max: Infinity, rate: 2 },
  ];

  // 현재 등급 찾기
  const currentLevel =
    levels.find((l) => totalSpent >= l.min && totalSpent < l.max) ||
    levels[levels.length - 1];
  
  const currentIndex = levels.indexOf(currentLevel);
  const nextLevel = levels[currentIndex + 1];

  // 현재 등급 프로그래스바 계산
  const currentPercent =
    currentLevel.max === Infinity
      ? 100
      : Math.floor(
          ((totalSpent - currentLevel.min) /
            (currentLevel.max - currentLevel.min)) *
            100
        );

  const remaining =
    currentLevel.max === Infinity ? 0 : currentLevel.max - totalSpent;

  // 전체 등급 리스트 퍼센트 계산 로직
  const getLevelPercent = (level) => {
    const index = levels.indexOf(level);

    if (index < currentIndex) return 100; // 이전 등급 → 항상 100%
    if (index > currentIndex) return 0;   // 이후 등급 → 항상 0%

    // 현재 등급 → 실제 비율 계산
    const percent =
      level.max === Infinity
        ? 100
        : Math.floor(
            ((totalSpent - level.min) / (level.max - level.min)) * 100
          );

    return Math.max(0, Math.min(100, percent)); // 0~100 제한
  };

  return (
    <>
      <div className="mypageTier_page-title">회원 등급</div>

      {/* 현재 등급 박스 */}
      <div className="mypageTier_grade-box">
        <div className="mypageTier_grade-img">
          <img
            src={`/grade/${currentLevel.file}`}
            alt="현재 등급"
            className="mypageTier_grade-icon"
          />
        </div>

        <div className="mypageTier_grade-info-area">
          <div className="mypageTier_grade-now">
            현재 등급 : {currentLevel.name}
          </div>

          {/* 프로그래스바 */}
          <div className="mypageTier_progress-wrap">
            <div className="mypageTier_progress-bg">
              <div
                className="mypageTier_progress-bar"
                style={{ width: `${currentPercent}%` }}
              ></div>
            </div>
          </div>

          {/* 금액 안내 */}
          <div className="mypageTier_progress-text">
            <span>
              최근 6개월 구매금액 {totalSpent.toLocaleString()}원
            </span>
            <span>
              {nextLevel
                ? `${nextLevel.name}까지 ${remaining.toLocaleString()}원 남음`
                : "최고 등급입니다."}
            </span>
          </div>
        </div>
      </div>

      {/* 등급 리스트 */}
      <div className="mypageTier_grade-list">
        {levels.map((level) => {
          const isCurrent = level.name === currentLevel.name;
          const percent = getLevelPercent(level);

          return (
            <div
              key={level.name}
              className={`mypageTier_grade-item ${
                isCurrent ? "mypageTier_current" : ""
              }`}
            >
              <h3>
                {level.name} <span>{percent}%</span>
              </h3>
              <p>
                {level.min.toLocaleString()}원 ~{" "}
                {level.max === Infinity
                  ? "이상"
                  : `${level.max.toLocaleString()}원`}
              </p>
              <p>포인트 적립률 {level.rate}%</p>
            </div>
          );
        })}
      </div>

      {/* 안내 박스 */}
      <div className="mypageTier_info-box">
        <span>등급 산정 안내</span>
        <br />
        · 회원가입 시 최초 등급은 브론즈입니다.
        <br />
        · 등급은 최근 6개월간의 구매금액을 기준으로 산정됩니다.
        <br />
        · 등급 상승 시 혜택은 별도 신청 없이 자동 적용됩니다.
        <br />
        · 다음 분기 시작 등급은 이전 분기의 최종 등급으로 결정됩니다.
        <br />
        · 시작된 등급을 유지하려면 해당 등급의 최소 구매 기준을 충족해야 하며, 기준에 미달할 경우 등급이 하락할 수 있습니다.
        <br />
        · 취소·반품된 주문의 금액은 구매금액 산정에서 제외됩니다.
        <br />
      </div>
    </>
  );
}
