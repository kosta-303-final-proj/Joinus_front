import React, { useState } from "react";
import {
    Container, Row, Col, Card, CardBody,
    Nav, NavItem, NavLink,
    Form, FormGroup, Label, Input, Button,
    Badge,
} from 'reactstrap';
import "bootstrap/dist/css/bootstrap.min.css";
import "./exchRtrn.css";
// import Sidebar from "../../../components/layout/Sidebar";
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
    return (
        <Container fluid className="bg-light py-4" style={{ minWidth: "860px" }}>
            <Container className="bg-white p-4 d-flex flex-row" style={{ maxWidth: "860px" }}>
                {/* <Sidebar /> */}
                {/* <div style={{ width: "100%", marginLeft: "24px" }}> */}
                    <Card>
                        <CardBody>
                            <h5 className="mb-4">취소 / 반품 / 교환 / 환불 내역</h5>

                            {/* Filter Section */}
                            <div className="p-3 rounded mb-4" style={{ backgroundColor: "#E5EEFF" }}>
                                <Row className="align-items-center">
                                    <Col md={1} className="text-muted w-auto">처리내역</Col>
                                    <Col md={5} className="d-flex align-items-center gap-2">
                                        <Button size="sm" style={filterButtonStyle} className="me-2 w-100">전체</Button>
                                        <Button size="sm" outline className="me-2 w-100">취소</Button>
                                        <Button size="sm" outline className="me-2 w-100">반품</Button>
                                        <Button size="sm" outline className="me-2 w-100">교환</Button>
                                        <Button size="sm" outline className="w-100">환불</Button>
                                    </Col>
                                </Row>
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
                                    <Col md={1} className="text-muted" style={{width: '90px'}}>기간 선택</Col>
                                    <Col md={8} className="d-flex align-items-center flex-row gap-2">
                                        <Input
                                            id="exampleDate"
                                            name="date"
                                            style={{width: '250px'}}
                                            placeholder="date placeholder"
                                            type="date"
                                        />
                                        <span>~</span>
                                        <Input
                                            id="exampleDate"
                                            name="date"
                                            style={{width: '250px'}}
                                            placeholder="date placeholder"
                                            type="date"
                                        />
                                        <Button className="ms-3" style={buttonStyle}>조회하기</Button>
                                    </Col>
                                </Row>
                            </div>


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
                        </CardBody>
                    </Card>
                {/* </div> */}
            </Container>
        </Container>
    );
}