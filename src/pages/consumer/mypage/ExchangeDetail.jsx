import React, {useEffect, useState} from "react";
import { Container, Row, Col, Card, CardBody, Table, Button } from "reactstrap";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./exchRtrn.css";

export default function ExchangeDetail() {

    const { id } = useParams(); // exchangeId
    const navigate = useNavigate();

    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    const confirmBtnStyle = {
        backgroundColor: '#739FF2',
        padding: '10px 20px',
        width: '120px',
        color: 'white'
    };

    const formatDate = (value) => {
    if (!value) return "-";
    return String(value).substring(0, 10).replaceAll("-", "/");
    };

    // 상태
    const STATUS_LABEL = {
    EXCHANGE_REQUESTED: "교환신청",
    EXCHANGE_PREPARATION: "교환준비",
    EXCHANGE_RETRIEVAL: "교환회수중",
    EXCHANGE_SHIPPING: "교환배송중",
    EXCHANGE_REJECTED: "교환거절",
    EXCHANGE_COMPLETED: "교환완료",
    };

    const toStatus = (raw) => {
    const key = String(raw ?? "").trim().toUpperCase();
    return STATUS_LABEL[key] ?? raw ?? "-";
    };

    useEffect(() => {
    const fetchDetail = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `http://localhost:8080/mypage/cnclExchRtrnHisList/exchangeDetail/${id}`
        );
        setData(res.data);
      } catch (e) {
        console.error("교환 상세 조회 실패:", e);
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
    }, [id]);

    if (loading) {
        return (
        <Container className="bg-white p-4" style={{ maxWidth: "860px" }}>
            <div style={{ padding: "40px", textAlign: "center" }}>불러오는 중...</div>
        </Container>
        );
    }

    if (!data) {
        return (
        <Container className="bg-white p-4" style={{ maxWidth: "860px" }}>
            <div style={{ padding: "40px", textAlign: "center" }}>
            교환 상세 정보를 불러오지 못했습니다.
            </div>
            <Row className="mt-4 mb-5">
            <Col className="text-center">
                <Button style={confirmBtnStyle} onClick={() => navigate(-1)}>
                목록
                </Button>
            </Col>
            </Row>
        </Container>
        );
    }

    const statusText = toStatus(data.status);
    const priceText =
        data.price != null ? Number(data.price).toLocaleString() : "-";

    // 화면에 “배송 진행 상태 / 회수 진행 여부”가 필요하면 status/returnPart로 분기해도 됨
    // 여기서는 최소 구현: statusText를 그대로 표/진행상태로 표시

    return (
        <Container className="bg-white p-4" style={{ maxWidth: "860px" }}>
            {/* 제목 및 주문 정보 */}
            <Row className="mt-4">
                <Col>
                    <h5 className="fw-bold">교환내역 상세보기</h5>
                    <div className="text-secondary mt-2">
                        주문일 : <b>{formatDate(data.orderAt)}</b> &nbsp;&nbsp; / &nbsp;&nbsp;
                        주문번호 : <b>{data.orderId ?? "-"}</b>
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
                                <td>{data.productName ?? "-"}</td>
                                <td className="text-center">
                                    {data.quantity != null ? `${data.quantity}개` : "-"}
                                </td>
                                <td className="text-center">{priceText}원</td>
                                <td className="text-center">
                                    <div style={{ color: "#739FF2" }}>{statusText}</div>
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
                                        <td>{formatDate(data.requestedAt)}</td>
                                    </tr>
                                    <tr>
                                        <th>교환접수번호</th>
                                        <td>{data.exchangeId ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>교환 사유</th>
                                        <td>{data.reqReason ?? "-"}</td>
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
                                        <td>{statusText}</td>
                                    </tr>
                                    <tr>
                                        <th>택배회사</th>
                                        <td>{data.shippingCarrierName ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>송장번호</th>
                                        <td>{data.shippingTrackingNo ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>회수인</th>
                                        <td>{data.shippingUsername ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>휴대폰</th>
                                        <td>{data.shippingTel ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>주소</th>
                                        <td>
                                            {(data.shippingPostcode ?? "") +
                                                " " +
                                                (data.shippingAddress ?? "") +
                                                " " +
                                                (data.shippingDetailAddress ?? "") || "-"}
                                        </td>
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
                                        <td>{data.returnPart ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>택배회사</th>
                                        <td>{data.returnCarrierName ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>송장번호</th>
                                        <td>{data.returnTrackingNo ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>회수인</th>
                                        <td>{data.returnName ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>휴대폰</th>
                                        <td>{data.returnTel ?? "-"}</td>
                                    </tr>
                                    <tr>
                                        <th>주소</th>
                                        <td>
                                        {(data.returnPostcode ?? "") +
                                            " " +
                                            (data.returnAddress ?? "") +
                                            " " +
                                            (data.returnDetailAddress ?? "") || "-"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th>회수 예정일</th>
                                        <td>미구현</td>
                                    </tr>
                                    <tr>
                                        <th>회수 요청사항</th>
                                        <td>{data.returnNote ?? "-"}</td>
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
                <Button
                    color="primary"
                    style={confirmBtnStyle}
                    onClick={() => navigate(-1)}
                >
                    목록
                </Button>
                </Col>
            </Row>
        </Container>
    );
}
