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
import "./exchRtrn.css";
import Sidebar from "../../../components/layout/Sidebar";
export default function CancelReq() {
    const [reason, setReason] = useState("");
    const [details, setDetails] = useState("");
    return (
        <Container fluid className="bg-light py-4" style={{ minWidth: "1440px" }}>
            <Container className="bg-white p-4 d-flex flex-row" style={{ maxWidth: "1220px" }}>
                <Sidebar />
                <div style={{ width: "100%", marginLeft: "24px" }}>
                    {/* <UserInfo/> */}
                    {/* 타이틀 */}
                    <h5 className="mb-4 fw-bold">취소 신청</h5>
                    {/* 신청 상품 */}
                    <section className="border p-3 mb-4">
                        <h6 className="fw-bold mb-3 section-header">상품</h6>
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
                        <h6 className="fw-bold mb-3 section-header">사유</h6>

                        <FormGroup>
                            <Input
                                type="select"
                                value={reason}
                                onChange={(e) => setReason(e.target.value)}
                            >
                                <option value="">신청 사유를 선택하세요</option>
                                <option value="">단순변심 - 상품이 마음에 들지 않음</option>
                                <option value="">단순변심 - 더 저렴한 상품을 발견함</option>
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