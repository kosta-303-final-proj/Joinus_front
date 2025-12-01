import React from "react";
import { useNavigate } from "react-router-dom";
import "./MypageDeleteAccount.css";

export default function MypageDeleteAccount() {
  const navigate = useNavigate();

  const handleDelete = () => {
    alert("회원탈퇴가 완료되었습니다.");
    navigate("/mypage");
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
        <div className="deleteaccount-msg">도훈님, 현재 보유중인 포인트가 있어요.</div>
        <div className="deleteaccount-point-info">
          보유중인 포인트는 <strong>9,480P</strong>이며 탈퇴 시 소멸됩니다.
        </div>
      </div>

      {/* 본문 박스 */}
      <div className="deleteaccount-box">

        <h3 className="deleteaccount-sub-title">탈퇴하는 이유가 무엇인가요?</h3>

        <div className="deleteaccount-reason-list">

          <label className="deleteaccount-reason-item">
            <span>앱/사이트 이용을 안해요</span>
            <input type="radio" name="reason" />
          </label>

          <label className="deleteaccount-reason-item">
            <span>다른 사이트를 사용해요</span>
            <input type="radio" name="reason" />
          </label>

          <label className="deleteaccount-reason-item">
            <span>원하는 상품이 없어요</span>
            <input type="radio" name="reason" />
          </label>

          <label className="deleteaccount-reason-item">
            <span>서비스가 만족스럽지 않아요</span>
            <input type="radio" name="reason" />
          </label>

          <label className="deleteaccount-reason-item">
            <span>앱/사이트 사용이 불편해요</span>
            <input type="radio" name="reason" />
          </label>

          <label className="deleteaccount-reason-item">
            <span>광고 알림이 너무 많아요</span>
            <input type="radio" name="reason" />
          </label>

          <label className="deleteaccount-reason-item">
            <span>기타</span>
            <input type="radio" name="reason" />
          </label>

        </div>

        {/* 기타 입력 */}
        <div className="deleteaccount-other-box">
          <textarea placeholder="탈퇴 사유를 입력해주세요. (선택사항)"></textarea>
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
