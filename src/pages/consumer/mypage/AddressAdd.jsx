import React from "react";
import { useNavigate } from "react-router-dom";
import "./AddressAdd.css";

export default function AddressAdd() {
  const navigate = useNavigate();

  const handleSubmit = () => {
    alert("배송지가 등록되었습니다!");
    navigate("/mypage/addressList");
  };

  return (
    <div className="addressadd-content">
      {/* ===== 페이지 제목 ===== */}
      <div className="addressadd-title">배송지 등록</div>

      {/* ===== 배송지명 ===== */}
      <div className="addressadd-form-row">
        <div className="addressadd-label-flex">
          <label className="addressadd-label">
            배송지명 <span className="addressadd-required">*</span>
          </label>

          <label className="addressadd-checkbox-default">
            <input type="checkbox" />
            기본배송지 설정
          </label>
        </div>

        <input
          type="text"
          className="addressadd-input-box"
          placeholder="예: 집, 회사, 자취방"
        />
      </div>

      {/* ===== 받는 분 ===== */}
      <div className="addressadd-form-row">
        <label className="addressadd-label">
          받는 분 <span className="addressadd-required">*</span>
        </label>
        <input
          type="text"
          className="addressadd-input-box"
          placeholder="이름 입력"
        />
      </div>

      {/* ===== 연락처 ===== */}
      <div className="addressadd-form-row">
        <label className="addressadd-label">
          연락처 <span className="addressadd-required">*</span>
        </label>

        <div className="addressadd-phone-wrap">
          <select>
            <option>010</option>
            <option>011</option>
          </select>
          <input type="text" maxLength={4} />
          <input type="text" maxLength={4} />
        </div>
      </div>

{/* ===== 주소 ===== */}
<div className="addressadd-form-row">
  <label className="addressadd-label">
    주소 <span className="addressadd-required">*</span>
  </label>

  <div className="addressadd-address-row">
    {/* 우편번호 */}
    <input
      type="text"
      className="addressadd-postcode-input"
      placeholder="우편번호"
    />

    {/* 우편번호 검색 버튼 */}
    <button className="addressadd-postcode-btn">검색</button>

    {/* 도로명 주소 */}
    <input
      type="text"
      className="addressadd-road-input"
      placeholder="도로명 주소를 입력하세요."
    />

    {/* 도로명 주소 검색 버튼 */}
    <button className="addressadd-postcode-btn">검색</button>
  </div>

  {/* 상세주소 */}
  <textarea
    className="addressadd-textarea-box"
    placeholder="상세주소를 입력하세요."
  ></textarea>
</div>

      {/* ===== 출입방법 ===== */}
      <div className="addressadd-form-row">
        <label className="addressadd-label">
          공동현관 출입방법 <span className="addressadd-required">*</span>
        </label>
        <input
          type="text"
          className="addressadd-input-box"
          placeholder="예 : 공동현관 비밀번호 1234, 자유 출입 가능 등"
        />
      </div>

      {/* ===== 버튼 ===== */}
      <div className="addressadd-btn-row">
        <button className="addressadd-btn-confirm" onClick={handleSubmit}>
          확인
        </button>
        <button className="addressadd-btn-cancel" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>
    </div>
  );
}
