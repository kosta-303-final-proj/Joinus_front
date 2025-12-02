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

export default function ExchangeDetail() {
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
                            <h5 className="fw-bold">교환내역 상세보기</h5>
                            <div className="text-secondary mt-2">
                                주문일 : <b>2025/07/15</b> &nbsp;&nbsp; / &nbsp;&nbsp; 주문번호 :
                                <b> 8100126910234</b>
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
                                        <td>브리타 정수기 필터 엑스트라 프로 퓨어 퍼포먼스 3입</td>
                                        <td className="text-center">1개</td>
                                        <td className="text-center">21,900원</td>
                                        <td className="text-center">
                                            <div size="sm" style={{color: '#739FF2'}}>
                                                교환완료
                                            </div>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>

                    {/* 상세정보 박스 */}
                    <Row className="mt-4">
                        <Col>
                            <Card>
                                <CardBody>
                                    <h6 className="fw-bold mb-3 exch-rtrn-section-header">상세정보</h6>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <th style={{ width: "180px" }}>교환접수일자</th>
                                                <td>2025/07/16</td>
                                            </tr>
                                            <tr>
                                                <th>교환접수번호</th>
                                                <td>910031610875</td>
                                            </tr>
                                            <tr>
                                                <th>교환 사유</th>
                                                <td>상품이 파손되어 배송됨</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* 교환 상품 배송정보 */}
                    <Row className="mt-4">
                        <Col>
                            <Card>
                                <CardBody>
                                    <h6 className="fw-bold mb-3 exch-rtrn-section-header">교환 상품 배송정보</h6>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <th style={{ width: "180px" }}>배송 진행 상태</th>
                                                <td>배송완료</td>
                                            </tr>
                                            <tr>
                                                <th>택배회사</th>
                                                <td>쿠팡택배</td>
                                            </tr>
                                            <tr>
                                                <th>송장번호</th>
                                                <td>101001545354</td>
                                            </tr>
                                            <tr>
                                                <th>회수인</th>
                                                <td>박도름</td>
                                            </tr>
                                            <tr>
                                                <th>휴대폰</th>
                                                <td>010-8456-3770</td>
                                            </tr>
                                            <tr>
                                                <th>주소</th>
                                                <td>08007 서울특별시 양천구 목동 삼성아파트 103동 1501호</td>
                                            </tr>
                                        </tbody>
                                    </Table>
                                </CardBody>
                            </Card>
                        </Col>
                    </Row>

                    {/* 상품 회수정보 */}
                    <Row className="mt-4">
                        <Col>
                            <Card>
                                <CardBody>
                                    <h6 className="fw-bold mb-3 exch-rtrn-section-header">상품 회수정보</h6>
                                    <Table borderless>
                                        <tbody>
                                            <tr>
                                                <th style={{ width: "180px" }}>상품회수 진행여부</th>
                                                <td>판매자직접완료</td>
                                            </tr>
                                            <tr>
                                                <th>택배회사</th>
                                                <td>쿠팡택배</td>
                                            </tr>
                                            <tr>
                                                <th>송장번호</th>
                                                <td>4564842364</td>
                                            </tr>
                                            <tr>
                                                <th>회수인</th>
                                                <td>김현정</td>
                                            </tr>
                                            <tr>
                                                <th>휴대폰</th>
                                                <td>010-8456-3770</td>
                                            </tr>
                                            <tr>
                                                <th>주소</th>
                                                <td>
                                                    08007 서울특별시 양천구 목동동로122길 45 삼성아파트 103동
                                                    1501호
                                                </td>
                                            </tr>
                                            <tr>
                                                <th>회수 예정일</th>
                                                <td>2025/07/17(목)</td>
                                            </tr>
                                            <tr>
                                                <th>회수 요청사항</th>
                                                <td>문 앞</td>
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
                            <Button color="primary" style={confirmBtnStyle}>
                                목록
                            </Button>
                        </Col>
                    </Row>
                </div>
            </Container>
        </Container>
    );
}
