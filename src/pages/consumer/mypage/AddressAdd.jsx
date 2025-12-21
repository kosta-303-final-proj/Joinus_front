import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./AddressAdd.css";

export default function AddressAdd() {
  const navigate = useNavigate();

  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  // 서버로 보낼 폼 데이터
  const [form, setForm] = useState({
    addressName: "",
    recipientName: "",
    phone: "",
    postcode: "",
    streetAddress: "",
    addressDetail: "",
    accessInstructions: "",
    defaultAddress: false, // ✅ 백엔드 DTO와 일치
  });

  // ===============================
  // 공용 input 핸들러
  // ===============================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ===============================
  // 주소 표시용 문자열
  // ===============================
  const displayAddress =
    form.postcode && form.streetAddress
      ? `[${form.postcode}] ${form.streetAddress}`
      : "";

  // ===============================
  // 다음 주소 검색
  // ===============================
  const openDaumPostcode = () => {
    if (!window.daum || !window.daum.Postcode) {
      alert("주소 검색 서비스를 불러오지 못했습니다.");
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data) {
        setForm((prev) => ({
          ...prev,
          postcode: data.zonecode,
          streetAddress: data.roadAddress,
        }));
      },
    }).open();
  };

  // ===============================
  // 제출 처리
  // ===============================
  const handleSubmit = async () => {
    if (!username) {
      alert("로그인이 필요합니다.");
      return;
    }

    // 필수값 검증
  if (!form.addressName.trim()) {
    alert("배송지명을 입력해주세요.");
    return;
  }

  if (!form.recipientName.trim()) {
    alert("받는 분 이름을 입력해주세요.");
    return;
  }

  if (!form.phone.trim()) {
    alert("연락처를 입력해주세요.");
    return;
  }

  if (!form.postcode || !form.streetAddress) {
    alert("주소를 검색해주세요.");
    return;
  }

  if (!form.addressDetail.trim()) {
    alert("상세주소를 입력해주세요.");
    return;
  }

  if (!form.accessInstructions.trim()) {
    alert("출입방법을 입력해주세요.");
    return;
  }

    try {
      await axios.post("http://localhost:8080/mypage/address", {
        ...form,
        memberUsername: username,
      });

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

      {/* ===== 배송지명 + 기본배송지 ===== */}
      <div className="addressadd-form-row">
        <div className="addressadd-label-flex">
          <label className="addressadd-label">
            배송지명 <span className="addressadd-required">*</span>
          </label>

          <label className="addressadd-checkbox-default">
            <input
              type="checkbox"
              name="defaultAddress"
              checked={form.defaultAddress}
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
          placeholder="이름을 입력하세요."
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

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            readOnly
            value={displayAddress}
            placeholder="[우편번호] 주소"
            className="addressadd-input-box"
            style={{ flex: 1 }}
          />

          <button
            type="button"
            className="addressadd-postcode-btn"
            onClick={openDaumPostcode}
            style={{ whiteSpace: "nowrap" }}
          >
            주소 검색
          </button>
        </div>

        <textarea
          name="addressDetail"
          className="addressadd-textarea-box"
          placeholder="상세주소를 입력하세요."
          value={form.addressDetail}
          onChange={handleChange}
        />
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

        <button
          type="button"
          className="addressadd-btn-cancel"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
    </div>
  );
}
