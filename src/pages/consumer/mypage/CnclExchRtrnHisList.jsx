import React, { useState, useEffect } from "react";
import {
    Container, Row, Col, Card, CardBody,
    Nav, NavItem, NavLink,
    Form, FormGroup, Label, Input, Button,
    Badge,
} from 'reactstrap';
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import "./exchRtrn.css";
import OrderItem from "./OrderItem";

export default function CnclExchRtrnHisList() {
    const buttonStyle = {
        backgroundColor: '#739FF2',
        padding: '10px 20px',
        width: '120px',
        color: 'white'
    }
    const filterButtonStyle = {
        backgroundColor: '#739FF2',
        width: '65px',
        color: 'white'
    }
    const badgeStyle = {
        color: '#739FF2'
    }

    // -------------------------
    // 상태 정의
    // -------------------------
    const [historyType, setHistoryType] = useState("all"); // all / cancel / return / exchange
    const [historyList, setHistoryList] = useState([]);
    const [loading, setLoading] = useState(false);

    // TODO: 실제 로그인한 사용자 username으로 대체
    const username = "kakao_4633814946";

    // -------------------------
    // axios로 내역 조회
    // -------------------------
    const fetchHistory = async (type) => {
        setLoading(true);
        try {
            let url = "";

            if (type === "cancel") {
                url = `/mypage/cnclExchRtrnHisList/cancel/${username}`;
            } else if (type === "return") {
                url = `/mypage/cnclExchRtrnHisList/return/${username}`;
            } else if (type === "exchange") {
                url = `/mypage/cnclExchRtrnHisList/exchange/${username}`;
            } else {
                // 전체
                url = `/mypage/cnclExchRtrnHisList/all/${username}`;
            }

            const res = await axios.get(`http://localhost:8080${url}`);
            
            if (type === "all") {
            const items = res.data?.items ?? [];
            // 접수일(requestedAt) 최신순 정렬(없으면 createdAt fallback)
                const sorted = [...items].sort(
                (a, b) =>
                    new Date(b.requestedAt ?? b.createdAt ?? 0) -
                    new Date(a.requestedAt ?? a.createdAt ?? 0)
                );
                setHistoryList(sorted);
                return;
            }
            // ✅ 개별(취소/반품/교환)은 아직 기존 응답구조를 유지한다고 가정
            // (컨트롤러를 나중에 맞출 거라서, 현재 백엔드 구조도 대응해둠)
            if (type === "cancel") {
                setHistoryList(res.data?.cancels ?? res.data ?? []);
            } else if (type === "return") {
                setHistoryList(res.data?.returns ?? res.data ?? []);
            } else if (type === "exchange") {
                setHistoryList(res.data?.exchanges ?? res.data ?? []);
            } else {
                setHistoryList([]);
            }
        } catch (e) {
            console.error("취소/반품/교환 내역 조회 실패:", e);
            setHistoryList([]);
        } finally {
            setLoading(false);
        }
    };

    // 처음 렌더링 + historyType 변경될 때마다 호출
    useEffect(() => {
        fetchHistory(historyType);
    }, [historyType]);

    // 날짜 포맷 (Timestamp 문자열 기준)
    const formatDate = (value) => {
        if (!value) return "";
        // value가 "2024-03-26T10:20:30" 이런 식이면 앞 10자리만 사용
        return String(value).substring(0, 10).replaceAll("-", "/");
    };

    return (
        <Container className="bg-white p-4" style={{ maxWidth: "860px" }}>
            <div className="d-flex flex-row" style={{ width: "100%", marginLeft: "24px" }}>
                <Card>
                    <CardBody>
                        <h5 className="mb-4">취소 / 반품 / 교환 / 환불 내역</h5>

                        {/* Filter Section */}
                        <div className="p-3 rounded mb-4" style={{ backgroundColor: "#E5EEFF" }}>
                            <Row className="align-items-center">
                                <Col md={1} className="text-muted w-auto">처리내역</Col>
                                <Col md={5} className="d-flex align-items-center gap-2">
                                    <Button size="sm" style={filterButtonStyle} className="me-2 w-100" onClick={() => setHistoryType("all")}>전체</Button>
                                    <Button size="sm" outline className="me-2 w-100" onClick={() => setHistoryType("cancel")}>취소</Button>
                                    <Button size="sm" outline className="me-2 w-100" onClick={() => setHistoryType("return")}>반품</Button>
                                    <Button size="sm" outline className="me-2 w-100" onClick={() => setHistoryType("exchange")}>교환</Button>
                                    <Button size="sm" outline className="w-100" disabled>환불</Button>
                                </Col>
                            </Row>

                            {/* ======================== 구매 기간 ======================== */}
                            <Row className="align-items-center mt-2">
                                <Col md={1} className="text-muted w-auto">구매기간</Col>
                                <Col md={5} className="d-flex align-items-center gap-2">
                                    <Button size="sm" style={filterButtonStyle} className="me-2 w-100">1개월</Button>
                                    <Button size="sm" outline className="me-2 w-100">3개월</Button>
                                    <Button size="sm" outline className="me-2 w-100">6개월</Button>
                                    <Button size="sm" outline className="w-100">12개월</Button>
                                </Col>
                            </Row>
                            <Row className="align-items-center mt-2">
                                <Col md={1} className="text-muted" style={{ width: '90px' }}>기간 선택</Col>
                                <Col md={8} className="d-flex align-items-center flex-row gap-2">
                                    <Input
                                        id="exampleDate"
                                        name="date"
                                        style={{ width: '250px' }}
                                        placeholder="date placeholder"
                                        type="date"
                                    />
                                    <span>~</span>
                                    <Input
                                        id="exampleDate"
                                        name="date"
                                        style={{ width: '250px' }}
                                        placeholder="date placeholder"
                                        type="date"
                                    />
                                    <Button className="ms-3" style={buttonStyle}>조회하기</Button>
                                </Col>
                            </Row>
                            {/* ====================================================== */}
                        </div>
                        
                        {/* -------------------------- */}
                        {/*   내역 리스트 영역           */}
                        {/* -------------------------- */}

                        <div className="mt-4">
                            {loading && <p>불러오는 중...</p>}

                            {!loading && historyList.length === 0 && (
                                <p>취소/반품/교환 내역이 없습니다.</p>
                            )}

                            {!loading && historyList.length > 0 && historyList.map((item, idx) => {
                                
                                const statusText = item.status ?? "상태";
                                const orderNum = item.orderId ?? item.order?.id ?? "-";

                                const requestedAt = item.requestedAt ?? item.createdAt; // fallback
                                const orderAt = item.orderAt ?? item.orderDate ?? item.createdAt; // fallback

                                const quantity = item.quantity ?? 1;

                                const priceText = Number(item.price ?? 0).toLocaleString();

                                const key = `${item.requestId ?? item.id ?? idx}-${item.orderItemId ?? "noItem"}-${orderNum}`;

                                return (
                                    <OrderItem
                                    key={key}
                                    status={statusText}
                                    product={item.productName ?? "상품명 없음"}
                                    options={item.optionName ?? "옵션 없음"}
                                    quantity={quantity} // ✅ 추가
                                    price={priceText}
                                    // ✅ 접수일/주문일 분리해서 전달
                                    requestedAt={formatDate(requestedAt)}
                                    orderDate={formatDate(orderAt)}
                                    orderNum={orderNum}
                                    />
                                );
                            })}
                        </div>

                        {/* ============= 예시 =============
                        <div className="mt-4">
                            <OrderItem
                                status="취소완료"
                                product="인바디 다이얼 체지방계"
                                options="소프트 화이트, H30NW"
                                price="339,000"
                                orderDate="2024/2/27"
                                orderNum="32100035064952"
                                returnDate="2024/2/27"
                            />
                            <OrderItem
                                status="반품완료"
                                product="네오플램 글라스캠 내열유리 반찬통 밀폐용기 3p세트 1000ml"
                                options="1000ml, 3개, 단품"
                                price="17,010"
                                orderDate="2024/3/26"
                                returnDate="2024/4/08"
                                orderNum="32100039566498"
                            />
                            <OrderItem
                                status="교환완료"
                                product="필기도구 12세트"
                                options="12세트, 1개, 단품"
                                price="17,010"
                            />
                            <Row className="mb-3 p-3 bg-white border rounded">
                                <Col xs={12} className="mb-2 d-flex flex-row gap-2">
                                    <small className="text-muted">
                                        취소접수일:
                                        <span>2024/4/08 </span>
                                    </small>
                                    <small>
                                        |
                                    </small>
                                    <small className="text-muted">
                                        주문일:  <span>2024/4/08</span>
                                    </small>
                                    <small>
                                        |
                                    </small>
                                    <small className="text-muted">
                                        주문번호: <span>32100039566498</span>
                                    </small>
                                </Col>
                                <Col md={5} className="d-flex flex-column justify-content-center">
                                    <strong>필기도구 12세트</strong>
                                    <small className="text-muted mt-1">12세트, 1개, 단품</small>
                                </Col>
                                <Col md={1} className="d-flex align-items-center justify-content-end">
                                    <span className="text-muted">1개</span>
                                </Col>
                                <Col md={2} className="d-flex align-items-center justify-content-end">
                                    <strong>17,010 원</strong>
                                </Col>
                                <Col md={2} className="d-flex flex-column align-items-end justify-content-center gap-1">
                                    <div size="sm" outline style={badgeStyle}>취소완료</div>
                                    <div size="sm" outline style={badgeStyle}>반품완료</div>
                                    <div size="sm" outline style={badgeStyle}>교환완료</div>
                                </Col>
                                <Col md={2} className="d-flex flex-column align-items-end justify-content-center gap-1">
                                    <Button size="sm" outline style={buttonStyle}>반품상세</Button>
                                    <Button size="sm" outline style={buttonStyle}>교환상세</Button>
                                </Col>
                            </Row>
                        </div>
                         */}
                    </CardBody>
                </Card>
            </div>
        </Container>
    );
}