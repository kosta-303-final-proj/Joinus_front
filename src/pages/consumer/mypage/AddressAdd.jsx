import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddressAdd.css";

export default function AddressAdd() {
  const navigate = useNavigate();

  // 서버로 보낼 폼 데이터
  const [form, setForm] = useState({
    memberUsername: "ehgns0311", // 로그인 연동 전까지 하드코딩
    addressName: "",
    recipientName: "",
    postcode: "",
    streetAddress: "",
    addressDetail: "",
    accessInstructions: "",
    isDefault: false,
  });

  // input 공용 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  // 전화번호 3칸 조합
  const handlePhoneChange = (index, value) => {
    const parts = form.phone ? form.phone.split("-") : ["", "", ""];
    parts[index] = value;

    setForm({
      ...form,
      phone: parts.join("-"),
    });
  };

  // 제출 처리
  const handleSubmit = async () => {
    try {
      await axios.post("http://localhost:8080/mypage/address", form);

      alert("배송지가 등록되었습니다!");
      navigate("/mypage/addressList");
    } catch (err) {
      console.error(err);
      alert("등록 실패했습니다.");
    }
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
            <input
              type="checkbox"
              name="isDefault"
              checked={form.isDefault}
              onChange={handleChange}
            />
            기본배송지 설정
          </label>
        </div>

        <input
          type="text"
          name="addressName"
          className="addressadd-input-box"
          placeholder="예: 집, 회사, 자취방"
          value={form.addressName}
          onChange={handleChange}
        />
      </div>

      {/* ===== 받는 분 ===== */}
      <div className="addressadd-form-row">
        <label className="addressadd-label">
          받는 분 <span className="addressadd-required">*</span>
        </label>
        <input
          type="text"
          name="recipientName"
          className="addressadd-input-box"
          placeholder="이름 입력"
          value={form.recipientName}
          onChange={handleChange}
        />
      </div>

{/* ===== 연락처 ===== */}
<div className="addressadd-form-row">
  <label className="addressadd-label">
    연락처 <span className="addressadd-required">*</span>
  </label>

  <input
    type="text"
    name="phone"
    className="addressadd-input-box"
    placeholder="연락처를 입력하세요."
    value={form.phone}
    onChange={handleChange}
  />
</div>


      {/* ===== 주소 ===== */}
      <div className="addressadd-form-row">
        <label className="addressadd-label">
          주소 <span className="addressadd-required">*</span>
        </label>

        <div className="addressadd-address-row">
          <input
            type="text"
            name="postcode"
            className="addressadd-postcode-input"
            placeholder="우편번호"
            value={form.postcode}
            onChange={handleChange}
          />

          <button className="addressadd-postcode-btn">검색</button>

          <input
            type="text"
            name="streetAddress"
            className="addressadd-road-input"
            placeholder="도로명 주소를 입력하세요."
            value={form.streetAddress}
            onChange={handleChange}
          />

          <button className="addressadd-postcode-btn">검색</button>
        </div>

        <textarea
          name="addressDetail"
          className="addressadd-textarea-box"
          placeholder="상세주소를 입력하세요."
          value={form.addressDetail}
          onChange={handleChange}
        ></textarea>
      </div>

      {/* ===== 출입방법 ===== */}
      <div className="addressadd-form-row">
        <label className="addressadd-label">
          공동현관 출입방법 <span className="addressadd-required">*</span>
        </label>
        <input
          type="text"
          name="accessInstructions"
          className="addressadd-input-box"
          placeholder="예 : 공동현관 비밀번호 1234, 자유 출입 가능 등"
          value={form.accessInstructions}
          onChange={handleChange}
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
