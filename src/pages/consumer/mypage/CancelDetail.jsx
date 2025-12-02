import React from "react";
import {
    Container,
    Row,
    Col,
    Card,
    CardBody,
    Table,
    Button,
    Badge
} from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import "./exchRtrn.css";
import Sidebar from "../../../components/layout/Sidebar";

export default function CancelDetail() {
    const confirmBtnStyle = {
        backgroundColor: '#739FF2',
        padding: '10px 20px',
        width: '120px',
        color: 'white'
    }
    return (
        <Container fluid className="bg-light py-4" style={{ minWidth: "1440px" }}>
            <Container className="bg-white p-4 d-flex flex-row" style={{ maxWidth: "1220px" }}>
                <Sidebar />
                <div style={{ width: "100%", marginLeft: "24px" }}>

                    {/* 제목 및 주문 정보 */}
                    <Row className="mt-4">
                        <Col>
                            <h5 className="fw-bold">취소신청 상세보기</h5>
                            <div className="text-secondary mt-2">
                                주문일 : <b>2025-02-04</b> &nbsp;&nbsp; / &nbsp;&nbsp; 주문번호 :
                                <b> 32100094139406</b>
                            </div>
                        </Col>
                    </Row>

                    {/* 상품 목록 테이블 */}
                    <Row className="mt-3">
                        <Col>
                            <Table bordered hover responsive className="align-middle">
                                <thead>
                                    <tr>
                                        <th className="text-center" style={{ backgroundColor: '#eaf1ff' }}>상품</th>
                                        <th className="text-center" style={{ backgroundColor: '#eaf1ff' }}>수량</th>
                                        <th className="text-center" style={{ backgroundColor: '#eaf1ff' }}>금액</th>
                                        <th className="text-center" style={{ backgroundColor: '#eaf1ff' }}>진행상태</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>안다미로 디어 체지방컷</td>
                                        <td className="text-center">1개</td>
                                        <td className="text-center">373,440원</td>
                                        <td className="text-center">
                                            <div style={{ color: '#739FF2' }}>
                                                취소신청
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* 환불 안내 */}
                    <Row className="mt-4">
                        <Col>
                            <Card>
                                <CardBody>
                                    <h6 className="fw-bold mb-3 section-header">환불 내역</h6>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <th style={{ width: "180px" }}>상품금액</th>
                                                <td>373,440원</td>
                                            </tr>
                                            <tr>
                                                <th>배송비</th>
                                                <td>0원</td>
                                            </tr>
                                            <tr>
                                                <th>반품비</th>
                                                <td>0원</td>
                                            </tr>
                                            <tr>
                                                <th>포인트</th>
                                                <td>0원</td>
                                            </tr>
                                            <tr>
                                                <th>환불 수단</th>
                                                <td>
                                                    현대카드 / 3개월 할부 265,211원<br />
                                                    쿠팡캐시 108,229원
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>환불 금액</th>
                                                <td style={{ color: 'red', fontWeight: 'bold' }}>
                                                    373,440원
                                                </td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* 목록 버튼 */}
                    <Row className="mt-4 mb-5">
                        <Col className="text-center">
                            <Button color="primary" style={confirmBtnStyle} onClick={() => navigate('/mypage/cnclExchRtrnHisList')}>
                                목록
                            </Button>
                        </Col>
                    </Row>

                </div>
            </Container>
        </Container>
    );
}
