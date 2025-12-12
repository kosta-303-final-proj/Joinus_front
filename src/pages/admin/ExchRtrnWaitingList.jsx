import React, { useState } from "react";
import {
    Container, Row, Col,
    Button, Input, Table,
    InputGroup, InputGroupText
} from "reactstrap";
import AdminHeader from "../../components/layout/AdminHeader";
import "bootstrap/dist/css/bootstrap.min.css";

export default function ExchangeReturnList() {
    const confirmBtnStyle = {
        backgroundColor: '#739FF2',
        padding: '10px 20px',
        border: 'none',
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
    const [filter, setFilter] = useState({
        type: "exchange",
        periodStart: "2025-09-02", // 이미지 기준 초기값 설정
        periodEnd: "2025-09-06",   // 이미지 기준 초기값 설정
        searchType: "",
        keyword: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilter({ ...filter, [name]: value });
    };

    return (
        <div className="admin-layout">
          <div className="main-content">
            <AdminHeader title="교환 및 반품 관리" />
            <div className="content-area">
        <div className="page-wrapper">
            <div className="content-wrapper" style={{ padding: "30px" }}>
                <h4 style={{ fontWeight: 600 }}>교환 및 반품 관리</h4>

                {/* 필터 섹션 */}
                <div
                    className="filter-box"
                    style={{
                        background: "#fff",
                        padding: "20px",
                        marginTop: "20px",
                        borderRadius: "8px",
                        border: "1px solid #eee"
                    }}
                >
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "collapse",
                            fontSize: "14px"
                        }}
                    >
                        <tbody>

                            {/* 교환 */}
                            <tr>
                                <th
                                    style={{
                                        width: "120px",
                                        padding: "12px",
                                        background: "#f7f8fa",
                                        borderRight: "1px solid #eee",
                                        verticalAlign: "top"
                                    }}
                                >
                                    교환
                                </th>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <Button outline color="secondary">교환신청</Button>
                                        <Button outline color="secondary">교환승인</Button>
                                        <Button outline color="secondary">교환회수중</Button>
                                        <Button outline color="secondary">교환완료</Button>
                                        <Button outline color="secondary">교환거절</Button>
                                    </div>
                                </td>
                            </tr>

                            {/* 반품 */}
                            <tr>
                                <th
                                    style={{
                                        width: "120px",
                                        padding: "12px",
                                        background: "#f7f8fa",
                                        borderRight: "1px solid #eee",
                                        verticalAlign: "top"
                                    }}
                                >
                                    반품
                                </th>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                                        <Button outline color="secondary">반품신청</Button>
                                        <Button outline color="secondary">반품승인</Button>
                                        <Button outline color="secondary">반품회수중</Button>
                                        <Button outline color="secondary">반품완료</Button>
                                        <Button outline color="secondary">반품거절</Button>
                                    </div>
                                </td>
                            </tr>

                            {/* 기간 */}
                            <tr>
                                <th
                                    style={{
                                        width: "120px",
                                        padding: "12px",
                                        background: "#f7f8fa",
                                        borderRight: "1px solid #eee"
                                    }}
                                >
                                    기간
                                </th>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Input type="date" style={{ width: "180px" }} />
                                        <span>~</span>
                                        <Input type="date" style={{ width: "180px" }} />
                                    </div>
                                </td>
                            </tr>

                            {/* 검색 분류 */}
                            <tr>
                                <th
                                    style={{
                                        width: "120px",
                                        padding: "12px",
                                        background: "#f7f8fa",
                                        borderRight: "1px solid #eee"
                                    }}
                                >
                                    검색 분류
                                </th>
                                <td style={{ padding: "12px" }}>
                                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                        <Input
                                            type="select"
                                            style={{ width: "180px" }}
                                        >
                                            <option value="">게시글 제목</option>
                                            <option value="reqNo">신청 번호</option>
                                            <option value="orderNo">주문 번호</option>
                                        </Input>
                                        <Input
                                            type="text"
                                            placeholder="검색어 입력"
                                            style={{ width: "250px" }}
                                        />
                                    </div>
                                </td>
                            </tr>

                        </tbody>
                    </table>

                    {/* 버튼 영역 */}
                    <div className="d-flex flex-row justify-content-center gap-2" style={{ marginTop: "20px", display: "flex", gap: "10px" }}>
                        <Button style={confirmBtnStyle}>검색</Button>
                        <Button style={cancelBtnStyle}>설정 초기화</Button>
                    </div>
                </div>


                {/* 테이블 리스트 (기존 코드 유지) */}
                <div className="table-box"
                    style={{
                        background: "#fff",
                        padding: "20px",
                        marginTop: "20px",
                        borderRadius: "8px",
                        border: "1px solid #eee"
                    }}>
                    <Table bordered hover responsive>
                        <thead style={{ background: "#739FF2", fontSize: "14px" }}>
                            <tr>
                                <th style={{ background: "#E5EEFF" }}>신청일</th>
                                <th style={{ background: "#E5EEFF" }}>신청번호</th>
                                <th style={{ background: "#E5EEFF" }}>주문번호</th>
                                <th style={{ background: "#E5EEFF" }}>주문자</th>
                                <th style={{ background: "#E5EEFF" }}>공구명</th>
                                <th style={{ background: "#E5EEFF" }}>수량</th>
                                <th style={{ background: "#E5EEFF" }}>금액</th>
                                <th style={{ background: "#E5EEFF" }}>결제수단</th>
                                <th style={{ background: "#E5EEFF" }}>처리상태</th>
                                <th style={{ background: "#E5EEFF" }}>운송장</th>
                                <th style={{ background: "#E5EEFF" }}>작업</th>
                            </tr>
                        </thead>

                        <tbody>
                            {Array(10).fill(0).map((_, i) => (
                                <tr key={i}>
                                    <td>20251116</td>
                                    <td>REF20251118</td>
                                    <td>cs20251118</td>
                                    <td>박길동</td>
                                    <td>매화품 염석기 100일 이상 대량 육용 판매</td>
                                    <td>2</td>
                                    <td>30,000원</td>
                                    <td>간편결제</td>
                                    <td>교환완료</td>
                                    <td>123123123123</td>
                                    <td>
                                        <Button size="sm" color="secondary">
                                            신청 상세 보기
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Pagination */}
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        marginTop: "20px"
                    }}>
                        <ul className="pagination">
                            <li className="page-item"><span className="page-link">1</span></li>
                            <li className="page-item"><span className="page-link">2</span></li>
                            <li className="page-item"><span className="page-link">3</span></li>
                            <span className="mx-2">…</span>
                            <li className="page-item"><span className="page-link">67</span></li>
                            <li className="page-item"><span className="page-link">68</span></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
            </div>
          </div>
        </div>
    );
}
