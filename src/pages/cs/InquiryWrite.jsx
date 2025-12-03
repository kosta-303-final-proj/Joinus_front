import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/mypage/InquiryWrite.css";
import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link } from "react-router-dom";

export default function InquiryWrite() {
    const [mainFile, setMainFile] = useState(null);
    const [mainFileURL, setMainFileURL] = useState(null);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setMainFile(file);

        if (file.type.startsWith("image/")) {
            const reader = new FileReader();
            reader.onloadend = () => {
            setMainFileURL(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setMainFileURL(null); // PDF는 이미지 미리보기 없음
        }
    };

  return (
    <>
      {/* 제목 영역 (1020px 고정) */}
      <div className="pageWrapper">
        <div className="container">
          <div className="fw-bold text-start" style={{fontSize:"20px"}}>1:1 문의 작성</div>
        </div>
      </div>

      {/* 전체 폭 가로선 */} 
      <hr style={{ borderColor: "#D9D9D9", margin:"0 atuo" }} />

      {/* 본문 영역 */}
      <div className="pageWrapper">
        <div className="container">
          <Form>
            <FormGroup>
              <Link to="/cs/notice">
              <Label className="fw-bold text-end d-block">
                <img src="/left.png" alt="뒤로가기" className="back" style={{width:'20px', height:'20px',  marginRight:"5px"}}/>
                뒤로가기
              </Label>
              </Link>
            </FormGroup>
            {/* 주문번호 */}
            <FormGroup className="mb-3">
              <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>주문번호 *</Label>
              <Input type="text" placeholder="주문번호를 입력하세요" />
            </FormGroup>            

            {/* 카테고리 */}
            <FormGroup className="mb-3">
              <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>카테고리 *</Label>
              <Input type="select">
                <option>선택하세요.</option>
                <option>공구상품문의</option>
                <option>1:1문의</option>
                <option>주문</option>
                <option>취소/교환/반품</option>
                <option>분실/파손/불량</option>
                <option>배송관련</option>
                <option>기타</option>
              </Input>
            </FormGroup>

            {/* 제목 */}
            <FormGroup className="mb-3">
              <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>제목 *</Label>
              <Input type="text" placeholder="문의 제목을 입력하세요." />
            </FormGroup>

            {/* 상세 설명 */}
            <FormGroup className="mb-3">
                <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>상세 설명 *</Label>
                <Input type="textarea" placeholder="상세한 내용을 입력해주세요." rows={5} style={{ resize: "none", height:"300px" }}/>
            </FormGroup>

            {/* 상품 이미지/PDF 업로드 */}
            <FormGroup className="mb-4">
            <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>상품 이미지 / PDF</Label>

            <div className="bigUploadBox">
                <div className="imageGrid">
                {/* 대표 파일 */}
                <div className="imageBox">
                    <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleFileUpload}
                    className="fileInput"
                    />
                    {mainFile ? (
                    mainFile.type === "application/pdf" ? (
                        <div style={{ textAlign: "center", fontSize: "14px", padding: "10px" }}>
                        📄 PDF 파일<br />{mainFile.name}
                        </div>
                    ) : (
                        <img src={mainFileURL} alt="대표 파일" className="preview" />
                    )
                    ) : (
                    <p className="fw-bold text-center text-secondary small">
                        대표 이미지 / PDF<br />Click to upload
                    </p>
                    )}
                </div>
                </div>
            </div>
            </FormGroup>

            {/* 개인 정보 수집 동의 */}
            {/* <FormGroup className="mb-4">
            <Label className="fw-bold text-start d-block" style={{ fontSize: "16px" }}>
                개인정보 수집 및 이용 동의 *
            </Label>
            <div style={{ fontSize: "14px", lineHeight: "1.6", marginTop: "5px", border:"solid 1px #d9d9d9", padding:'10px', borderRadius:'5px'}}>
                회사는 서비스 제공을 위해 아래와 같이 개인정보를 수집·이용합니다.<br/>
                1. 수집 항목: 이름, 연락처, 이메일 등<br/>
                2. 수집 목적: 서비스 제공, 고객 문의 응대, 이벤트/마케팅 안내<br/>
                3. 보유 기간: 회원 탈퇴 시까지 또는 법령에 따른 보존 기간<br/>
                본인은 상기 내용을 확인하였으며, 개인정보 수집 및 이용에 동의합니다.
            </div>
            </FormGroup> */}

            <div className="d-flex gap-2 justify-content-end">
              <Button color="secondary">취소하기</Button>
              <Button color="primary">문의하기</Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}


