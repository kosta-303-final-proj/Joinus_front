import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./MypageDeleteAccount.css";

export default function MypageDeleteAccount() {

  const navigate = useNavigate();

  const [nickname, setNickname] = useState("");
  const [point, setPoint] = useState(0);
  const [reason, setReason] = useState("");
  const [otherReason, setOtherReason] = useState("");

useEffect(() => {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  if (!username) return; // 🔒 안전장치

  setNickname(userInfo.nickname);

  axios
    .get(`http://localhost:8080/consumerInfo?username=${username}`)
    .then((res) => setPoint(res.data.pointBalance))
    .catch((err) => console.log(err));
}, []);


const handleDelete = () => {
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  if (!reason) {
    alert("탈퇴 사유를 선택해주세요.");
    return;
  }

  // 라디오 + textarea 조합
  let finalReason = reason;

  if (otherReason.trim() !== "") {
    finalReason = `${reason} / ${otherReason}`;
  }

  axios.post("http://localhost:8080/mypage/delete", {
    username,
    delReason: finalReason
  })
  .then(() => {
    alert("회원탈퇴가 완료되었습니다.");
    sessionStorage.removeItem("userInfo");
    navigate("/");
  })
  .catch(err => console.error(err));
};


  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <>
      {/* 제목 */}
      <div className="deleteaccount-title">회원탈퇴</div>

      {/* 안내 박스 */}
      <div className="deleteaccount-notice-box">
        <div className="deleteaccount-msg">{nickname}님, 현재 보유중인 포인트가 있어요.</div>
        <div className="deleteaccount-point-info">
          보유중인 포인트는 <strong>{point.toLocaleString()}P</strong>이며 탈퇴 시 소멸됩니다.
        </div>
      </div>

      {/* 본문 */}
      <div className="deleteaccount-box">

        <h3 className="deleteaccount-sub-title">탈퇴하는 이유가 무엇인가요?</h3>

        <div className="deleteaccount-reason-list">

          <label className="deleteaccount-reason-item">
            <span>웹사이트 이용을 안해요</span>
            <input type="radio" name="reason" value="웹사이트 이용을 안해요" onChange={(e)=>setReason(e.target.value)} />
          </label>

          <label className="deleteaccount-reason-item">
            <span>다른 사이트를 사용해요</span>
            <input type="radio" name="reason" value="다른 사이트를 사용해요" onChange={(e)=>setReason(e.target.value)} />
          </label>

          <label className="deleteaccount-reason-item">
            <span>원하는 상품이 없어요</span>
            <input type="radio" name="reason" value="원하는 상품이 없어요" onChange={(e)=>setReason(e.target.value)} />
          </label>

          <label className="deleteaccount-reason-item">
            <span>서비스가 만족스럽지 않아요</span>
            <input type="radio" name="reason" value="서비스가 만족스럽지 않아요" onChange={(e)=>setReason(e.target.value)} />
          </label>

          <label className="deleteaccount-reason-item">
            <span>웹사이트 사용이 불편해요</span>
            <input type="radio" name="reason" value="웹사이트 사용이 불편해요" onChange={(e)=>setReason(e.target.value)} />
          </label>

          <label className="deleteaccount-reason-item">
            <span>광고 알림이 너무 많아요</span>
            <input type="radio" name="reason" value="광고 알림이 너무 많아요" onChange={(e)=>setReason(e.target.value)} />
          </label>

          <label className="deleteaccount-reason-item">
            <span>기타</span>
            <input type="radio" name="reason" value="기타" onChange={(e)=>setReason(e.target.value)} />
          </label>

        </div>

        {/* 기타 입력 */}
        <div className="deleteaccount-other-box">
          <textarea
            placeholder="탈퇴 사유를 입력해주세요. (선택사항)"
            value={otherReason}
            onChange={(e)=>setOtherReason(e.target.value)}
          ></textarea>
        </div>

        {/* 버튼 */}
        <div className="deleteaccount-btn-row">
          <button className="deleteaccount-btn deleteaccount-btn-next" onClick={handleDelete}>
            탈퇴하기
          </button>
          <button className="deleteaccount-btn deleteaccount-btn-cancel" onClick={handleCancel}>
            취소하기
          </button>
        </div>

      </div>
    </>
  );
}
