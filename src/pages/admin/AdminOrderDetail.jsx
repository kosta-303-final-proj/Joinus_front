import React from "react";
import {
    Container,
    Row,
    Col,
    Input,
    Button,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink
} from "reactstrap";
import AdminHeader from "../../components/layout/AdminHeader";
import "bootstrap/dist/css/bootstrap.min.css";
export default function AdminOrderDetail() {
    const rows = Array.from({ length: 10 }).map((_, i) => ({
        orderNo: "ORD20251118",
        date: "2025.11.18",
        buyer: "홍길동",
        option1: "s size",
        option2: "m size",
        qty1: 2,
        qty2: 3,
        method: "간편결제",
        amount: "880,000원",
    }));

    return (
        <div className="admin-layout">
          <div className="main-content">
            <AdminHeader title="공구관리 > 주문 공구 상품" />
            <div className="content-area">
        <Container fluid className="p-5">
            <h5 className="mb-4">공구관리 &gt; 주문 공구 상품</h5>
            {/* 공구 상품 카드 */}
            <div>
                <h6 className="fw-bold mb-3 admin-order-section-header" style={{ background: '#eaf1ff' }}>공구 상품</h6>
                <Row className="align-items-start align-items-center justify-content-center" style={{ backgroundColor: 'white', height: '250px' }}>
                    <Col md="2">
                        <img
                            src="/productSampleImg.png"
                            alt="product"
                            className="img-fluid rounded"
                            style={{width: '200px'}}
                        />
                    </Col>

                    <Col md="10">
                        {/* 주문번호 입력 */}
                        <div className="d-flex flex-row gap-2 text-center align-items-center">
                            <div>
                                주문번호:
                            </div>
                            <div>
                                <Input type="text" placeholder="주문번호 입력" />
                            </div>
                            <div>
                                <Button  style={{backgroundColor: '#739FF2'}}>
                                    저장
                                </Button>
                            </div>
                        </div>
                        {/* 상품 상세정보 */}
                        <div className="mb-1">상품명: Start Fuck 500ml 세트 묶음</div>
                        <div className="mb-1">옵션:S size / 수량: 15</div>
                        <div className="mb-1">옵션:M size / 수량: 30</div>

                        <a href="https://drop.com/buy/drop-ctrl1-metal-gmk?mecha=00&keycap=set7&defaultSelectionIds=988595" target="_blank" className="mt-3 text-muted" style={{ fontSize: "0.9rem" }}>
                            원 사이트 주소:
                            https://drop.com/buy/drop-ctrl1-metal-gmk?mecha=00&keycap=set7&defaultSelectionIds=988595
                        </a>
                    </Col>
                </Row>
            </div>

            {/* 테이블 */}
            <Table bordered hover className="align-middle text-center mt-5">
                <thead  style={{ background: '#eaf1ff' }} >
                    <tr>
                        <th style={{ background: '#eaf1ff' }}>주문번호</th>
                        <th style={{ background: '#eaf1ff' }}>주문일</th>
                        <th style={{ background: '#eaf1ff' }}>주문자명</th>
                        <th style={{ background: '#eaf1ff' }}>옵션명</th>
                        <th style={{ background: '#eaf1ff' }}>수량</th>
                        <th style={{ background: '#eaf1ff' }}>결제수단</th>
                        <th style={{ background: '#eaf1ff' }}>결제금액</th>
                        <th style={{ background: '#eaf1ff'}}>송장번호</th>
                        <th style={{ background: '#eaf1ff'}}></th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            <td>{r.orderNo}</td>
                            <td>{r.date}</td>
                            <td>{r.buyer}</td>
                            <td className="text-start">
                                {r.option1}
                                <br />
                                {r.option2}
                            </td>
                            <td>
                                {r.qty1}
                                <br />
                                {r.qty2}
                            </td>
                            <td>{r.method}</td>
                            <td>{r.amount}</td>
                            {/* 송장번호 */}
                            <td>
                                <Input placeholder="" disabled />
                            </td>
                            <td>
                                <Button className="px-3" style={{backgroundColor: '#739FF2'}}>
                                    저장
                                </Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>

            {/* 페이지네이션 */}
            <div className="d-flex justify-content-center mt-4">
                <Pagination>
                    <PaginationItem active>
                        <PaginationLink>1</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>2</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>3</PaginationLink>
                    </PaginationItem>
                    <PaginationItem disabled>
                        <PaginationLink>…</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>67</PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink>68</PaginationLink>
                    </PaginationItem>
                </Pagination>
            </div>
        </Container>
            </div>
          </div>
        </div>
    );
}