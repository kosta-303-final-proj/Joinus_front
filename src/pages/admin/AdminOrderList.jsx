import React, { useState } from "react";
import {
    Container,
    Row,
    Col,
    Input,
    Button,
    Table,
    Pagination,
    PaginationItem,
    PaginationLink,
    FormGroup,
    Label
} from "reactstrap";
import AdminHeader from "../../components/layout/AdminHeader";
import "bootstrap/dist/css/bootstrap.min.css";
export default function AdminOrderList() {
    const [searchType, setSearchType] = useState("");
    const [keyword, setKeyword] = useState("");
    const confirmBtnStyle = {
        backgroundColor: '#739FF2',
        padding: '10px 20px',
        width: '120px',
        color: 'white'
    }
    const cancelBtnStyle = {
        border: '1px solid #739FF2',
        backgroundColor: 'white',
        padding: '10px 20px',
        width: '120px',
        color: '#739FF2'
    }
    const tableData = Array.from({ length: 10 }).map((_, idx) => ({
        id: idx,
        supplyNo: "12343",
        name: "My Little Pony Toddler Girls Graphic Crewneck Sweatshirt with Long Sleeves, Sizes 12M–5T",
        qty: 100,
        date: "2025.11.16",
        price: "880,000원",
        adminNo: "ADMIN1234",
        adminDate: "2025.11.27",
    }));

    return (
        <div className="admin-layout">
          <div className="main-content">
            <AdminHeader title="공구관리 > 주문 공구 상품" />
            <div className="content-area">
        <Container fluid className="p-5">
            <h5 className="mb-4">공구관리 &gt; 주문 공구 상품</h5>

            {/* Search Section */}
            <div
                className="p-4 rounded mb-4"
                style={{ backgroundColor: "white" }}
            >
                <Row className="gap-4">

                    {/* 검색옵션 */}
                    <Col md="3">
                        <FormGroup>
                            <Label className="fw-bold mb-2">검색옵션</Label>
                            <Input
                                type="select"
                                value={searchType}
                                onChange={(e) => setSearchType(e.target.value)}
                            >
                                <option value="">검색옵션 선택</option>
                                <option value="supplyNo">공구번호</option>
                                <option value="name">공구명</option>
                            </Input>
                        </FormGroup>
                    </Col>

                    {/* 검색어 */}
                    <Col md="8">
                        <FormGroup>
                            <Label className="fw-bold mb-2">검색어</Label>
                            <Input
                                type="text"
                                placeholder="검색어 입력"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                            />
                        </FormGroup>
                    </Col>
                </Row>
                <Row className="gap-4">
                    {/* 버튼 영역 */}
                    <Col className="d-flex align-item-center justify-content-center">
                        <div className="d-flex">
                            <Button
                                style={confirmBtnStyle}
                            >
                                검색
                            </Button>

                            <Button
                                className="ms-3"
                                style={cancelBtnStyle}
                            >
                                설정 초기화
                            </Button>
                        </div>
                    </Col>

                </Row>
            </div>



            {/* Table */}
            <div className="bg-white rounded shadow-sm p-3">
                <Table bordered hover responsive className="text-center align-middle">
                    <thead style={{ background: "#E5EEFF" }}>
                        <tr>
                            <th style={{ background: "#E5EEFF" }}>공구번호</th>
                            <th style={{ background: "#E5EEFF" }}>공구명</th>
                            <th style={{ background: "#E5EEFF" }}>수량</th>
                            <th style={{ background: "#E5EEFF" }}>공구마감일</th>
                            <th style={{ background: "#E5EEFF" }}>가격</th>
                            <th style={{ background: "#E5EEFF" }}>관리자 주문번호</th>
                            <th style={{ background: "#E5EEFF" }}>관리자 주문일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {tableData.map((row) => (
                            <tr key={row.id}>
                                <td>{row.supplyNo}</td>
                                <td className="text-start">{row.name}</td>
                                <td>{row.qty}</td>
                                <td>{row.date}</td>
                                <td>{row.price}</td>
                                <td>{row.adminNo}</td>
                                <td>{row.adminDate}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>

                {/* Pagination */}
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
            </div>
        </Container>
            </div>
          </div>
        </div>
    );
}