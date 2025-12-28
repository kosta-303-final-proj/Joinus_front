import React, { useEffect, useState } from "react";
import "./MypageTier.css";
import { myAxios } from "../../../config";

export default function MypageTier() {
  const [totalSpent, setTotalSpent] = useState(0);
  const [currentGrade, setCurrentGrade] = useState("BRONZE");
  const [nextGrade, setNextGrade] = useState(null);
  const [neededAmount, setNeededAmount] = useState(0);

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  useEffect(() => {
    if (!username) return;

    myAxios()
      .get(`/mypage/tier?username=${username}`)
      .then((res) => {
        const data = res.data;
        setTotalSpent(data.totalSpent);
        setCurrentGrade(data.currentGrade);
        setNextGrade(data.nextGrade);
        setNeededAmount(data.neededAmount);
      })
      .catch((err) => console.error(err));
  }, [username]);

  const levels = [
    { name: "BRONZE", file: "BRONZE.png", min: 0, max: 400000, rate: 1 },
    { name: "SILVER", file: "SILVER.png", min: 400000, max: 700000, rate: 1.3 },
    { name: "GOLD", file: "GOLD.png", min: 700000, max: 1000000, rate: 1.6 },
    { name: "DIAMOND", file: "DIAMOND.png", min: 1000000, max: Infinity, rate: 2 },
  ];

  const currentLevel =
    levels.find((l) => l.name === currentGrade) || levels[0];

  const currentIndex = levels.indexOf(currentLevel);
  const nextLevelInfo = levels[currentIndex + 1];

  const currentPercent =
    currentLevel.max === Infinity
      ? 100
      : Math.floor(
          ((totalSpent - currentLevel.min) /
            (currentLevel.max - currentLevel.min)) *
            100
        );

  const getLevelPercent = (level) => {
    const index = levels.indexOf(level);
    if (index < currentIndex) return 100;
    if (index > currentIndex) return 0;
    return currentPercent;
  };

  return (
    <>
      <div className="mypageTier_page-title">회원 등급</div>

      {/* 현재 등급 */}
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

          <div className="mypageTier_progress-wrap">
            <div className="mypageTier_progress-bg">
              <div
                className="mypageTier_progress-bar"
                style={{ width: `${currentPercent}%` }}
              />
            </div>
          </div>

          <div className="mypageTier_progress-text">
            <span>최근 6개월 구매금액 {totalSpent.toLocaleString()}원</span>
            <span>
              {nextLevelInfo
                ? `${nextLevelInfo.name}까지 ${neededAmount.toLocaleString()}원 남음`
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

      {/* 안내 */}
      <div className="mypageTier_info-box">
        <span>등급 산정 안내</span>
        <br />
        · 회원가입 시 최초 등급은 브론즈입니다.
        <br />
        · 등급은 최근 6개월간의 구매금액을 기준으로 산정됩니다.
        <br />
        · 등급 상승 시 혜택은 자동 적용됩니다.
        <br />
        · 기준 미달 시 등급 하락이 발생할 수 있습니다.
        <br />
      </div>
    </>
  );
}
