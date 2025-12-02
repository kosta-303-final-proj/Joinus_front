import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "./AddressEdit.css";

export default function AddressEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // 더미 데이터
  const dummy = {
    1: {
      name: "박민수",
      addressName: "집",
      phone1: "010",
      phone2: "5241",
      phone3: "8372",
      postcode: "06351",
      road: "서울특별시 강남구 논현로 145길 18",
      detail: "힐스테이트 논현 103동 701호",
      enter: "공동현관 비밀번호 1234",
      isDefault: true
    }
  };

  const [form, setForm] = useState({
    addressName: "",
    name: "",
    phone1: "010",
    phone2: "",
    phone3: "",
    postcode: "",
    road: "",
    detail: "",
    enter: "",
    isDefault: false
  });

  useEffect(() => {
    if (dummy[id]) {
      setForm(dummy[id]);
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
  };

  const handleSubmit = () => {
    alert("배송지가 수정되었습니다!");
    navigate("/mypage/addressList");
  };

  return (
    <div className="addressedit-content">

      <div className="addressedit-title">배송지 수정</div>

      {/* 배송지명 */}
      <div className="addressedit-form-row">
        <div className="addressedit-label-flex">
          <label className="addressedit-label">
            배송지명 <span className="addressedit-required">*</span>
          </label>

          <label className="addressedit-checkbox-default">
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
          className="addressedit-input-box"
          name="addressName"
          value={form.addressName}
          onChange={handleChange}
        />
      </div>

      {/* 받는 분 */}
      <div className="addressedit-form-row">
        <label className="addressedit-label">
          받는 분 <span className="addressedit-required">*</span>
        </label>
        <input
          type="text"
          className="addressedit-input-box"
          name="name"
          value={form.name}
          onChange={handleChange}
        />
      </div>

      {/* 연락처 */}
      <div className="addressedit-form-row">
        <label className="addressedit-label">
          연락처 <span className="addressedit-required">*</span>
        </label>

        <div className="addressedit-phone-wrap">
          <select name="phone1" value={form.phone1} onChange={handleChange}>
            <option>010</option>
            <option>011</option>
          </select>

          <input
            type="text"
            name="phone2"
            maxLength={4}
            value={form.phone2}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone3"
            maxLength={4}
            value={form.phone3}
            onChange={handleChange}
          />
        </div>
      </div>

{/* 주소 */}
<div className="addressedit-form-row">
  <label className="addressedit-label">
    주소 <span className="addressedit-required">*</span>
  </label>

  {/* 우편번호 + 검색 */}
  <div className="addressedit-address-row">
    <input
      type="text"
      className="addressedit-postcode-input"
      name="postcode"
      placeholder="우편번호"
      value={form.postcode}
      onChange={handleChange}
    />

    <button className="addressedit-postcode-btn">
      검색
    </button>

    {/* 도로명 주소 */}
    <input
      type="text"
      className="addressedit-road-input"
      name="road"
      placeholder="도로명 주소를 입력하세요."
      value={form.road}
      onChange={handleChange}
    />

    {/* 도로명 검색 버튼 (Add와 동일!) */}
    <button className="addressedit-postcode-btn">
      검색
    </button>
  </div>

  {/* 상세주소 */}
  <textarea
    className="addressedit-textarea-box"
    name="detail"
    placeholder="상세주소를 입력하세요."
    value={form.detail}
    onChange={handleChange}
  ></textarea>
</div>


      {/* 출입방법 */}
      <div className="addressedit-form-row">
        <label className="addressedit-label">
          공동현관 출입방법 <span className="addressedit-required">*</span>
        </label>

        <input
          type="text"
          className="addressedit-input-box"
          name="enter"
          value={form.enter}
          onChange={handleChange}
        />
      </div>

      {/* 버튼 */}
      <div className="addressedit-btn-row">
        <button className="addressedit-btn-confirm" onClick={handleSubmit}>
          수정 완료
        </button>
        <button className="addressedit-btn-cancel" onClick={() => navigate(-1)}>
          취소
        </button>
      </div>

    </div>
  );
}
