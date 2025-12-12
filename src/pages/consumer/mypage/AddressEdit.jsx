import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myAxios } from "../../../config";
import "./AddressEdit.css";

export default function AddressEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  // ✅ 로그인 유저
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const username = userInfo?.username;

  const [form, setForm] = useState({
    id: null,
    memberUsername: "",
    addressName: "",
    recipientName: "",
    phone: "",
    postcode: "",
    streetAddress: "",
    addressDetail: "",
    accessInstructions: "",
    isDefault: false,
  });

  // ✅ 기존 배송지 불러오기
  useEffect(() => {
    myAxios()
      .get(`/mypage/address/${id}`)
      .then((res) => {
        setForm(res.data);
      })
      .catch((err) => console.error(err));
  }, [id]);

  // ✅ 로그인 유저 username을 form에 강제 주입
  useEffect(() => {
    if (username) {
      setForm((prev) => ({
        ...prev,
        memberUsername: username,
      }));
    }
  }, [username]);

  // ✅ input 공용 핸들러
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // ✅ 수정 요청
  const handleSubmit = () => {
    if (!username) {
      alert("로그인이 필요합니다.");
      return;
    }

    myAxios()
      .put(`/mypage/address/${id}`, form)
      .then(() => {
        alert("배송지가 수정되었습니다!");
        navigate("/mypage/addressList");
      })
      .catch((err) => console.error(err));
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
          name="recipientName"
          value={form.recipientName}
          onChange={handleChange}
        />
      </div>

      {/* 연락처 */}
      <div className="addressedit-form-row">
        <label className="addressedit-label">
          연락처 <span className="addressedit-required">*</span>
        </label>
        <input
          type="text"
          name="phone"
          className="addressedit-input-box"
          value={form.phone}
          onChange={handleChange}
        />
      </div>

      {/* 주소 */}
      <div className="addressedit-form-row">
        <label className="addressedit-label">주소</label>

        <div className="addressedit-address-row">
          <input
            type="text"
            className="addressedit-postcode-input"
            name="postcode"
            value={form.postcode}
            onChange={handleChange}
          />

          <input
            type="text"
            className="addressedit-road-input"
            name="streetAddress"
            value={form.streetAddress}
            onChange={handleChange}
          />
        </div>

        <textarea
          className="addressedit-textarea-box"
          name="addressDetail"
          value={form.addressDetail}
          onChange={handleChange}
        />
      </div>

      {/* 출입방법 */}
      <div className="addressedit-form-row">
        <label className="addressedit-label">공동현관 출입방법</label>
        <input
          type="text"
          className="addressedit-input-box"
          name="accessInstructions"
          value={form.accessInstructions}
          onChange={handleChange}
        />
      </div>

      {/* 버튼 */}
      <div className="addressedit-btn-row">
        <button className="addressedit-btn-confirm" onClick={handleSubmit}>
          확인
        </button>
        <button
          className="addressedit-btn-cancel"
          onClick={() => navigate(-1)}
        >
          취소
        </button>
      </div>
    </div>
  );
}
