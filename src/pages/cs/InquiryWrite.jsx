import "bootstrap/dist/css/bootstrap.min.css";
import "../../css/mypage/InquiryWrite.css";
import React, { useState } from "react";
import { Form, FormGroup, Label, Input, Button } from "reactstrap";
import { Link, useNavigate } from "react-router-dom";
import { writeInquiry } from "../../services/csApi";

export default function InquiryWrite() {
    const navigate = useNavigate();
    const [mainFile, setMainFile] = useState(null);
    const [mainFileURL, setMainFileURL] = useState(null);
    const [formData, setFormData] = useState({
        category: '',
        question: '',
        orderId: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});

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

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // 에러 초기화
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.category) {
            newErrors.category = '카테고리를 선택해주세요.';
        }
        if (!formData.question.trim()) {
            newErrors.question = '문의 내용을 입력해주세요.';
        }
        if (!mainFile) {
            newErrors.imageFile = '이미지 파일을 업로드해주세요.';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setIsSubmitting(true);
        try {
            const submitFormData = new FormData();
            submitFormData.append('category', formData.category);
            submitFormData.append('question', formData.question);
            if (formData.orderId) {
                submitFormData.append('orderId', formData.orderId);
            }
            if (mainFile) {
                submitFormData.append('imageFile', mainFile);
            }

            await writeInquiry(submitFormData);
            
            // 성공 시 문의 목록으로 이동
            navigate('/cs/notice?tab=inquiry');
        } catch (error) {
            console.error('문의 작성 실패:', error);
            alert('문의 작성 중 오류가 발생했습니다. 다시 시도해주세요.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        navigate('/cs/notice?tab=inquiry');
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
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Link to="/cs/notice?tab=inquiry">
              <Label className="fw-bold text-end d-block">
                <img src="/left.png" alt="뒤로가기" className="back" style={{width:'20px', height:'20px',  marginRight:"5px"}}/>
                뒤로가기
              </Label>
              </Link>
            </FormGroup>
            {/* 주문번호 (선택사항) */}
            <FormGroup className="mb-3">
              <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>주문번호</Label>
              <Input 
                type="text" 
                name="orderId"
                value={formData.orderId}
                onChange={handleInputChange}
                placeholder="주문번호를 입력하세요 (선택사항)" 
              />
            </FormGroup>            

            {/* 카테고리 */}
            <FormGroup className="mb-3">
              <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>카테고리 *</Label>
              <Input 
                type="select" 
                name="category"
                value={formData.category}
                onChange={handleInputChange}
                invalid={!!errors.category}
              >
                <option value="">선택하세요.</option>
                <option value="GBPRODCUT">공구상품</option>
                <option value="ORDER">주문</option>
                <option value="CANCEL_REFUND_EXCHANGE">취소/교환/반품</option>
                <option value="LOST_DAMAGED_DEFECTIVE">분실/파손/불량</option>
                <option value="DELIVERY">배송 관련</option>
                <option value="OTHER">기타</option>
              </Input>
              {errors.category && <div className="text-danger" style={{fontSize:"14px", marginTop:"5px"}}>{errors.category}</div>}
            </FormGroup>

            {/* 상세 설명 */}
            <FormGroup className="mb-3">
                <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>문의 내용 *</Label>
                <Input 
                  type="textarea" 
                  name="question"
                  value={formData.question}
                  onChange={handleInputChange}
                  placeholder="상세한 내용을 입력해주세요." 
                  rows={5} 
                  style={{ resize: "none", height:"300px"}}
                  invalid={!!errors.question}
                />
                {errors.question && <div className="text-danger" style={{fontSize:"14px", marginTop:"5px"}}>{errors.question}</div>}
            </FormGroup>

            {/* 상품 이미지 업로드 */}
            <FormGroup className="mb-4">
            <Label className="fw-bold text-start d-block" style={{fontSize:"16px"}}>상품 이미지 *</Label>
            {errors.imageFile && <div className="text-danger" style={{fontSize:"14px", marginBottom:"5px"}}>{errors.imageFile}</div>}

            <div className="bigUploadBox">
                <div className="imageGrid">
                {/* 대표 파일 */}
                <div className="imageBox">
                    <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="fileInput"
                    />
                    {mainFile ? (
                        <img src={mainFileURL} alt="대표 파일" className="preview" />
                    ) : (
                    <p className="fw-bold text-center text-secondary small">
                        이미지 업로드<br />Click to upload
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
              <Button 
                color="secondary" 
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
              >
                취소하기
              </Button>
              <Button 
                color="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? '처리 중...' : '문의하기'}
              </Button>
            </div>
          </Form>
        </div>
      </div>
    </>
  );
}


