import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "../../config";
import SearchFilter from './SearchFilter';
import AdminHeader from "../../components/layout/AdminHeader";
import './admin-common.css';

export default function AdminOrderList() {
    const navigate = useNavigate();

    // ========================================
    // State
    // ========================================
    const [filters, setFilters] = useState({
        searchType: '',
        searchKeyword: ''
    });

    const [orderPage, setOrderPage] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0
    });
    const [currentPage, setCurrentPage] = useState(0);


    // ========================================
    // 데이터 조회
    // ========================================
    const fetchOrders = async (page = 0) => {
        try {
            const params = {
                searchType: filters.searchType || null,
                keyword: filters.searchKeyword || null,
                page,
                size: 10
            };

            console.log('🔍 API 요청:', params);

            const response = await myAxios().get('/admin/adminOrderList', { params });

            console.log('📥 API 응답:', response.data);

            setOrderPage(response.data);
            setCurrentPage(page);

        } catch (error) {
            console.error("구매 대기 목록 조회 실패:", error);
            alert("구매 대기 목록을 불러오는 데 실패했습니다.");
        }
    };


    // ========================================
    // 초기 로드
    // ========================================
    useEffect(() => {
        fetchOrders();
    }, []);


    // ========================================
    // 검색
    // ========================================
    const handleSearch = (searchFilters) => {
        setFilters({
            searchType: searchFilters.searchType || '',
            searchKeyword: searchFilters.searchKeyword || ''
        });
        fetchOrders(0);
    };

    const handleReset = () => {
        setFilters({
            searchType: '',
            searchKeyword: ''
        });
        fetchOrders(0);
    };


    // ========================================
    // 페이지 변경
    // ========================================
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < orderPage.totalPages) {
            fetchOrders(pageNumber);
        }
    };


    // ========================================
    // 상세 페이지 이동
    // ========================================
    const handleRowClick = (gbProductId) => {
        navigate(`/admin/adminOrderDetail/${gbProductId}`);
    };


    return (
        <div className="admin-layout">
            <div className="main-content">
                <AdminHeader title="공구 관리 > 구매 대기 상품" />
                
                <div className="content-area">
                    {/* 검색 필터 */}
                    <SearchFilter
                        variant="default"
                        searchOptions={[
                            { value: 'id', label: '공구코드' },
                            { value: 'name', label: '공구명' }
                        ]}
                        showResetButton={true}
                        onSearch={handleSearch}
                        onReset={handleReset}
                    />

                    {/* 테이블 */}
                    <div className="table-container">
                        <table className="admin-table">
                            <thead>
                                <tr>
                                    <th>공구번호</th>
                                    <th>공구명</th>
                                    <th>수량</th>
                                    <th>공구마감일</th>
                                    <th>가격</th>
                                    <th>관리자 주문번호</th>
                                    <th>관리자 주문일</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderPage.content.length === 0 ? (
                                    <tr>
                                        <td colSpan="7">
                                            <div className="empty-state">
                                                <p>구매 대기 중인 공구가 없습니다.</p>
                                            </div>
                                        </td>
                                    </tr>
                                ) : (
                                    orderPage.content.map((order) => (
                                        <tr
                                            key={order.gbProductId}
                                            onClick={() => handleRowClick(order.gbProductId)}
                                            style={{ cursor: 'pointer' }}
                                        >
                                            <td>{order.gbProductId}</td>
                                            <td className="text-start">{order.gbProductName}</td>
                                            <td>{order.totalQuantity}</td>
                                            <td>
                                                {order.endDate
                                                    ? order.endDate.substring(0, 10).replace(/-/g, '.')
                                                    : 'N/A'}
                                            </td>
                                            <td>{order.totalAmount?.toLocaleString()}원</td>
                                            <td>
                                                {order.adminOrderId || (
                                                    <span style={{ color: '#999' }}>입력 필요</span>
                                                )}
                                            </td>
                                            <td>
                                                {order.adminOrderDt
                                                    ? order.adminOrderDt.substring(0, 10).replace(/-/g, '.')
                                                    : <span style={{ color: '#999' }}>-</span>}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* 페이지네이션 */}
                    {orderPage.totalPages > 0 && (
                        <div className="pagination">
                            {Array.from({ length: orderPage.totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    className={`page-btn ${currentPage === i ? 'active' : ''}`}
                                    onClick={() => handlePageChange(i)}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}