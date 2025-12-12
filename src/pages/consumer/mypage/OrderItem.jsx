import React from "react";
import {
    Row, Col, Button, Badge,
} from 'reactstrap';
export default function OrderItem({ status, product, options, quantity, price, requestedAt, orderDate, orderNum }) {
    
    const safeStatus = String(status ?? "");
    
    return (
    <Row className="mb-3 p-3 bg-white border rounded">
        <Col xs={12} className="mb-2">
            <small className="text-muted">
                {requestedAt ? `반품접수일: ${requestedAt} | ` : ''}
                {orderDate ? `주문일: ${orderDate} | ` : ''}
                주문번호: {orderNum ?? "-"}
            </small>
        </Col>
        <Col md={1} className="d-flex align-items-center">
            <div className="bg-light p-3 border rounded w-100 text-center">이미지</div>
        </Col>
        <Col md={7} className="d-flex flex-column justify-content-center">
            <strong>{product ?? "상품명 없음"}</strong>
            <small className="text-muted mt-1">{options ?? "옵션 없음"}</small>
        </Col>
        <Col md={1} className="d-flex align-items-center justify-content-end">
            <span className="text-muted">{quantity}개</span>
        </Col>
        <Col md={1} className="d-flex align-items-center justify-content-end">
            <strong>{price ?? "0"} 원</strong>
        </Col>
        <Col md={2} className="d-flex flex-column align-items-end justify-content-center gap-1">
            <Badge color={safeStatus.includes("완료") ? "secondary" : "primary"}>
                {safeStatus || "상태"}
            </Badge>
            {status.includes('반품') && <Button size="sm" outline>반품상세</Button>}
            {status.includes('교환') && <Button size="sm" outline>교환상세</Button>}
            {status.includes('취소') && <Button size="sm" outline>취소상세</Button>}
        </Col>
    </Row>
    );
}