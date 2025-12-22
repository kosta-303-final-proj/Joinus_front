import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { myAxios } from "../../config";
import AdminHeader from "../../components/layout/AdminHeader";
import './admin-common.css';

export default function AdminOrderDetail() {
    const { gbProductId } = useParams();
    
    // State
    const [orderDetail, setOrderDetail] = useState(null);
    const [adminOrderNo, setAdminOrderNo] = useState("");
    
    const [participantPage, setParticipantPage] = useState({
        content: [],
        totalPages: 0,
        totalElements: 0,
        number: 0
    });
    const [currentPage, setCurrentPage] = useState(0);
    
    const [trackingInputs, setTrackingInputs] = useState({});
    const [carrierInputs, setCarrierInputs] = useState({});
    
    
    // 공구 상품 정보 조회
    const fetchOrderDetail = async () => {
        try {
            const response = await myAxios().get(
                `/admin/adminOrderDetail/${gbProductId}`
            );
            
            console.log('📥 공구 상품 정보:', response.data);
            
            setOrderDetail(response.data);
            setAdminOrderNo(response.data.adminOrderId || "");
            
        } catch (error) {
            console.error("공구 상품 정보 조회 실패:", error);
            alert("공구 상품 정보를 불러오는 데 실패했습니다.");
        }
    };
    
    
    // 참여자 목록 조회
    const fetchParticipants = async (page = 0) => {
        try {
            const response = await myAxios().get(
                `/admin/adminOrderDetail/${gbProductId}/participants`,
                { params: { page, size: 10 } }
            );
            
            console.log('📥 참여자 목록:', response.data);
            
            setParticipantPage(response.data);
            setCurrentPage(page);
            
        } catch (error) {
            console.error("참여자 목록 조회 실패:", error);
            alert("참여자 목록을 불러오는 데 실패했습니다.");
        }
    };
    
    
    // 초기 로드
    useEffect(() => {
        fetchOrderDetail();
        fetchParticipants();
    }, [gbProductId]);
    
    
    // 페이지 변경
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 0 && pageNumber < participantPage.totalPages) {
            fetchParticipants(pageNumber);
        }
    };
    
    
    // 관리자 주문번호 저장
    const handleSaveAdminOrder = async () => {
        if (!adminOrderNo.trim()) {
            alert("관리자 주문번호를 입력해주세요.");
            return;
        }
        
        try {
            await myAxios().post(
                `/admin/adminOrderDetail/${gbProductId}/admin-order`,
                { adminOrderId: adminOrderNo }
            );
            
            alert("관리자 주문번호가 저장되었습니다.");
            fetchOrderDetail();
            
        } catch (error) {
            console.error("관리자 주문번호 저장 실패:", error);
            alert("저장에 실패했습니다.");
        }
    };
    
    
    // 송장번호 입력 핸들러
    const handleTrackingChange = (orderId, value) => {
        setTrackingInputs(prev => ({
            ...prev,
            [orderId]: value
        }));
    };
    
    const handleCarrierChange = (orderId, value) => {
        setCarrierInputs(prev => ({
            ...prev,
            [orderId]: value
        }));
    };
    
    
    // 송장번호 저장
    const handleSaveTracking = async (orderId) => {
        const trackingNo = trackingInputs[orderId];
        const carrierName = carrierInputs[orderId] || "CJ대한통운";
        
        if (!trackingNo || !trackingNo.trim()) {
            alert("송장번호를 입력해주세요.");
            return;
        }
        
        try {
            await myAxios().post(
                `/admin/adminOrderDetail/${orderId}/tracking`,
                { 
                    trackingNo: trackingNo,
                    carrierName: carrierName
                }
            );
            
            alert("송장번호가 저장되었습니다.");
            
            setTrackingInputs(prev => {
                const newInputs = { ...prev };
                delete newInputs[orderId];
                return newInputs;
            });
            setCarrierInputs(prev => {
                const newInputs = { ...prev };
                delete newInputs[orderId];
                return newInputs;
            });
            
            fetchParticipants(currentPage);
            
        } catch (error) {
            console.error("송장번호 저장 실패:", error);
            alert("저장에 실패했습니다.");
        }
    };
    
    
    // 로딩 중
    if (!orderDetail) {
        return (
            <div className="admin-layout">
                <div className="main-content">
                    <AdminHeader title="참여인원 조회 및 배송관리" />
                    <div className="content-area">
                        <div className="empty-state">
                            <p>로딩 중...</p>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
    
    
    return (
        <div className="admin-layout">
            <div className="main-content">
                <AdminHeader title="참여인원 조회 및 배송관리" />
                <div className="content-area">
                    
                    {/* 공구 상품 카드 */}
                    <div style={{ marginBottom: '32px' }}>
                        <h6 
                            style={{ 
                                background: '#eaf1ff', 
                                padding: '10px 16px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '16px',
                                marginBottom: '16px'
                            }}
                        >
                            공구 상품
                        </h6>
                        <div 
                            style={{ 
                                background: 'white',
                                border: '1px solid #e0e0e0',
                                borderRadius: '8px',
                                padding: '24px',
                                display: 'flex',
                                gap: '24px',
                                alignItems: 'flex-start'
                            }}
                        >
                            {/* 이미지 */}
                            <div style={{ flexShrink: 0 }}>
                                <img
                                    src={orderDetail.thumbnailFileId 
                                        ? `http://localhost:8080/file/view/${orderDetail.thumbnailFileId}` 
                                        : "/productSampleImg.png"}
                                    alt="product"
                                    style={{ 
                                        width: '200px',
                                        height: '200px',
                                        objectFit: 'cover',
                                        borderRadius: '8px'
                                    }}
                                    onError={(e) => {
                                        console.log('이미지 로드 실패');
                                        e.target.src = "/productSampleImg.png";
                                    }}
                                />
                            </div>

                            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                {/* 주문번호 입력 */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <strong style={{ minWidth: '100px' }}>주문번호:</strong>
                                    <input 
                                        type="text" 
                                        placeholder="주문번호 입력"
                                        value={adminOrderNo}
                                        onChange={(e) => setAdminOrderNo(e.target.value)}
                                        disabled={!!orderDetail.adminOrderId}
                                        style={{
                                            flex: 1,
                                            maxWidth: '400px',
                                            padding: '8px 12px',
                                            border: '1px solid #d1d5db',
                                            borderRadius: '6px'
                                        }}
                                    />
                                    <button 
                                        className="admin-button primary small"
                                        onClick={handleSaveAdminOrder}
                                        disabled={!!orderDetail.adminOrderId}
                                    >
                                        저장
                                    </button>
                                </div>
                                
                                {/* 상품 상세정보 */}
                                <div style={{ fontSize: '14px', lineHeight: 1.6 }}>
                                    <strong>상품명:</strong> {orderDetail.gbProductName}
                                </div>
                                
                                {/* 옵션별 수량 */}
                                {orderDetail.optionSummaries?.map((option) => (
                                    <div key={option.optionId} style={{ fontSize: '14px', lineHeight: 1.6 }}>
                                        <strong>옵션:</strong> {option.optionName} / <strong>수량:</strong> {option.totalQuantity}
                                    </div>
                                ))}

                                {orderDetail.originalSiteUrl && (
                                    <div style={{ marginTop: '12px', fontSize: '14px' }}>
                                        <a 
                                            href={orderDetail.originalSiteUrl} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            style={{ 
                                                color: '#0066cc',
                                                textDecoration: 'none'
                                            }}
                                        >
                                            🔗 원 사이트 주소: {orderDetail.originalSiteUrl}
                                        </a>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* 참여자 테이블 */}
                    <div style={{ marginTop: '32px' }}>
                        <h6 
                            style={{ 
                                background: '#eaf1ff', 
                                padding: '10px 16px',
                                borderRadius: '6px',
                                fontWeight: 600,
                                fontSize: '16px',
                                marginBottom: '16px'
                            }}
                        >
                            참여자 목록
                        </h6>
                        <div className="table-container">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th style={{ width: '100px' }}>주문번호</th>
                                        <th style={{ width: '100px' }}>주문일</th>
                                        <th style={{ width: '50px' }}>주문자명</th>
                                        <th style={{ width: '50px' }}>옵션명</th>
                                        <th style={{ width: '50px' }}>수량</th>
                                        <th style={{ width: '80px' }}>결제수단</th>
                                        <th style={{ width: '100px' }}>결제금액</th>
                                        <th style={{ width: '100px' }}>택배사</th>
                                        <th style={{ width: '100px' }}>송장번호</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {participantPage.content.length === 0 ? (
                                        <tr>
                                            <td colSpan="10">
                                                <div className="empty-state">
                                                    <p>참여자가 없습니다.</p>
                                                </div>
                                            </td>
                                        </tr>
                                    ) : (
                                        participantPage.content.map((participant) => (
                                            <tr key={participant.orderId}>
                                                <td>{participant.orderId}</td>
                                                <td>
                                                    {participant.orderDate 
                                                        ? participant.orderDate.substring(0, 10).replace(/-/g, '.') 
                                                        : 'N/A'}
                                                </td>
                                                <td>{participant.customerName}</td>
                                                <td className="text-start">
                                                    {participant.options?.map((opt, idx) => (
                                                        <div key={idx}>{opt.optionName}</div>
                                                    ))}
                                                </td>
                                                <td>
                                                    {participant.options?.map((opt, idx) => (
                                                        <div key={idx}>{opt.quantity}</div>
                                                    ))}
                                                </td>
                                                <td>{participant.paymentMethod}</td>
                                                <td>{participant.paymentAmount?.toLocaleString()}원</td>
                                                
                                                {/* 택배사 */}
                                                <td>
                                                    {participant.trackingNo ? (
                                                        participant.carrierName || '-'
                                                    ) : (
                                                        <select 
                                                            value={carrierInputs[participant.orderId] || "CJ대한통운"}
                                                            onChange={(e) => handleCarrierChange(participant.orderId, e.target.value)}
                                                            style={{ 
                                                                minWidth: '120px',
                                                                padding: '6px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px'
                                                            }}
                                                        >
                                                            <option>CJ대한통운</option>
                                                            <option>우체국택배</option>
                                                            <option>한진택배</option>
                                                            <option>롯데택배</option>
                                                        </select>
                                                    )}
                                                </td>
                                                
                                                {/* 송장번호 */}
                                                <td>
                                                    {participant.trackingNo ? (
                                                        participant.trackingNo
                                                    ) : (
                                                        <input 
                                                            type="text"
                                                            placeholder="송장번호 입력"
                                                            value={trackingInputs[participant.orderId] || ""}
                                                            onChange={(e) => handleTrackingChange(participant.orderId, e.target.value)}
                                                            style={{
                                                                padding: '6px',
                                                                border: '1px solid #d1d5db',
                                                                borderRadius: '4px'
                                                            }}
                                                        />
                                                    )}
                                                </td>
                                                
                                                <td>
                                                    <button 
                                                        className="admin-button primary small"
                                                        onClick={() => handleSaveTracking(participant.orderId)}
                                                        disabled={!!participant.trackingNo}
                                                    >
                                                        저장
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* 페이지네이션 */}
                    {participantPage.totalPages > 0 && (
                        <div className="pagination">
                            {Array.from({ length: participantPage.totalPages }, (_, i) => (
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