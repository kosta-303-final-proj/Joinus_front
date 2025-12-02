import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Form,
    FormGroup,
    Input,
    Label,
    Button,
    Card,
    CardBody,
    CardImg,
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import "./exchRtrn.css";
import Sidebar from "../../../components/layout/Sidebar";
export default function ReturnReq() {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    const [images, setImages] = useState([null, null, null, null]);

    return (
        <Container fluid className="bg-light py-4" style={{ minWidth: "1440px" }}>
            <Container className="bg-white p-4 d-flex flex-row" style={{ maxWidth: "1220px" }}>
                <Sidebar />
                <div style={{ width: "100%", marginLeft: "24px" }}>
                    {/* <UserInfo/> */}
                    {/* 타이틀 */}
                    <h5 className="mb-4 fw-bold">반품 신청</h5>
                    {/* 신청 상품 */}
                    <section className="border p-3 mb-4">
                        <h6 className="fw-bold mb-3 exch-rtrn-section-header">상품</h6>
                        <Row>
                            <Col md="2">
                                <Card className="border-0">
                                    <CardImg src="/productSampleImg.png" alt="상품 이미지" />
                                </Card>
                            </Col>
                            <Col md="10">
                                <div className="mb-2">상품명: Start Fuck 500ml 세트</div>
                                <hr />
                                <div className="mb-2">옵션: <strong>S-size</strong></div>
                                <hr />
                                <div>₩2000000 / 1개</div>
                            </Col>
                        </Row>
                    </section>

                    {/* 신청 사유 */}
                    <section className="border p-3 mb-4">
                        <h6 className="fw-bold mb-3 exch-rtrn-section-header">사유</h6>

                        <FormGroup>
                            <Input
                                type="select"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="">신청 사유를 선택하세요</option>
                                <option value="">배송문제 - 다른 상품이 배송됨</option>
                                <option value="">상품문제 -  상품 구성 누락</option>
                                <option value="">상품문제 - 상품 파손</option>
                                <option value="">상품문제 - 상품 결함/기능 이상</option>
                            </Input>
                        </FormGroup>

                        <FormGroup>
                            <Input
                                type="textarea"
                                rows={4}
                                placeholder="신청 사유의 자세한 내용을 입력하세요. (선택사항)"
                                value={details}
                                style={{ resize: 'none' }}
                                onChange={(e) => setDetails(e.target.value)}
                            />
                        </FormGroup>
                    </section>

                    {/* 상품 이미지 첨부 */}
                    <section className="border p-3 mb-4">
                        <h6 className="fw-bold mb-3 exch-rtrn-section-header">상품 이미지 첨부</h6>

                        <Row>
                            {images.map((img, index) => (
                                <Col md="3" key={index} className="text-center">
                                    <div
                                        className="border d-flex align-items-center justify-content-center"
                                        style={{
                                            height: "120px",
                                            cursor: "pointer",
                                            backgroundColor: "#fafafa",
                                        }}
                                    >
                                        <Label
                                            htmlFor={`upload-${index}`}
                                            className="w-100 h-100 d-flex align-items-center justify-content-center"
                                            style={{ cursor: "pointer" }}
                                        >
                                            {img ? (
                                                <img
                                                    src={URL.createObjectURL(img)}
                                                    alt="preview"
                                                    style={{ maxWidth: "100%", maxHeight: "100%" }}
                                                />
                                            ) : (
                                                <div className="d-flex flex-column justify-content-center text-center align-items-center"><FontAwesomeIcon icon={faPlus} />upload</div>
                                            )}
                                        </Label>
                                        <Input
                                            id={`upload-${index}`}
                                            type="file"
                                            hidden
                                            onChange={(e) => {
                                                const newImages = [...images];
                                                newImages[index] = e.target.files[0];
                                                setImages(newImages);
                                            }}
                                        />
                                    </div>
                                </Col>
                            ))}
                        </Row>
                    </section>

                    {/* 환불 계좌 */}
                    <section className="border p-3 mb-4">
                        <h6 className="fw-bold mb-3 exch-rtrn-section-header">환불 계좌</h6>

                        <FormGroup>
                            <Label className="sub-title">은행명</Label>
                            <Input type="text" placeholder="은행명 입력" />
                        </FormGroup>

                        <FormGroup>
                            <Label className="sub-title">계좌번호</Label>
                            <Input type="text" placeholder="계좌번호 입력" />
                        </FormGroup>

                        <FormGroup>
                            <Label className="sub-title">예금주</Label>
                            <Input type="text" placeholder="예금주 입력" />
                        </FormGroup>

                        <div className="text-muted small">
                            원 결제 방법으로 환불이 불가한 경우 입력하신 계좌로 환불됩니다.
                        </div>
                    </section>

                    {/* 회수 정보 */}
                    <section className="border p-3 mb-4">
                        <h6 className="fw-bold mb-3 exch-rtrn-section-header">회수 정보</h6>

                        <FormGroup>
                            <div className="d-flex flex-row justify-content-between gap-5">
                                <Label className="sub-title mt-0">성함</Label>
                                <div className="d-flex gap-2">
                                    <Input
                                        id="sameInfo"
                                        type="checkbox"
                                    />
                                    {' '}
                                    <Label check for="sameInfo">
                                        주문정보와 동일
                                    </Label>
                                </div>

                            </div>
                            <Input type="text" placeholder="보내는 분 성함" />
                        </FormGroup>

                        <FormGroup>
                            <Label className="sub-title">연락처</Label>
                            <Input type="text" placeholder="보내는 분 연락처" />
                        </FormGroup>

                        <FormGroup>
                            <Label className="sub-title">회수 방법</Label>
                            <div>
                                <Input type="radio" id="pickup" name="method" className="me-1" />
                                <Label for="pickup" className="me-3">회수 신청</Label>

                                <Input type="radio" id="direct" name="method" className="me-1" />
                                <Label for="direct">직접 배송</Label>
                            </div>
                        </FormGroup>

                        <FormGroup>
                            <Label className="sub-title">주소</Label>
                            <Row className="d-flex flex-row gap-1">
                                <Col md="4">
                                    <Input type="text" placeholder="우편번호" style={{ width: 300 }} />
                                </Col>
                                <Col md="3">
                                    <Button style={{ backgroundColor: '#739FF2' }} block>
                                        우편번호 검색
                                    </Button>
                                </Col>
                            </Row>
                            <Input className="mt-2" type="text" placeholder="기본 주소" />
                            <Input className="mt-2 mb-2" type="text" placeholder="상세 주소" />
                            <div className="d-flex flex-row">
                                <div>
                                    <Input type="radio" id="1" name="pickup" className="me-1" />
                                    <Label for="1" className="me-3">문앞</Label>
                                </div>
                                <div>
                                    <Input type="radio" id="2" name="pickup" className="me-1" />
                                    <Label for="2" className="me-3">경비실</Label>
                                </div>
                                <div className="d-flex flex-row gap-5">
                                    <div className="d-flex flex-row">
                                        <Input type="radio" id="etc" name="pickup" className="me-1" />
                                        <Label for="etc" style={{ width: "70px" }}>그 외 장소</Label>
                                    </div>
                                    {/* <Input type="text" className="w-auto" placeholder="상세 장소입력" /> */}
                                </div>
                            </div>
                        </FormGroup>
                    </section>

                    {/* 환불 안내 */}
                    <section className="border p-3 mb-4">
                        <h6 className="fw-bold mb-3 exch-rtrn-section-header">환불 안내</h6>

                        <div className="mb-2">상품금액: <span>₩2000000 / 1개</span></div>
                        <hr />
                        <div className="mb-2">반품비용차감: <span>-₩200</span></div>
                        <hr />
                        <div className="mb-2">환불수단: <span>신한카드</span></div>
                        <hr />
                        <div className="fw-bold">환불예상금액: <span>₩199800</span></div>

                        <div className="small text-muted mt-2">
                            포인트는 환불 완료 후 복구됩니다. (추가적 시간이 소요될 수 있습니다)
                        </div>
                    </section>

                    {/* 버튼 */}
                    <Row className="mt-4">
                        <Col className="text-center">
                            <Button color="secondary" className="me-2">
                                취소
                            </Button>
                            <Button style={{ backgroundColor: '#739FF2' }}>신청</Button>
                        </Col>
                    </Row>
                </div>
            </Container>
        </Container>
    );
}