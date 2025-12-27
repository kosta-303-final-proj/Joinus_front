import { Button } from "reactstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../../config";

export default function OrderDetail(){
    const navigate = useNavigate();
    const { id } = useParams();
    console.log("🔥 useParams id =", id);
    const [orderDetail, setOrderDetail] = useState(null);

    useEffect(() => {
        if (!id) return;
        async function fetchOrderdetail() {
            try {
                const res = await myAxios().get(`/orderDetail/${id}`);
                setOrderDetail(res.data);
            } catch (error) {
                console.error("주문 상품이 없습니다.", error);
            }
        }
        fetchOrderdetail();
    }, [id]);

    const items = orderDetail?.items || [];

    const totalQuantity = items.reduce(
        (sum, item) => sum + item.quantity,
        0
    );

    const totalProductAmount = items.reduce(
        (sum, item) => sum + item.lineSubtotal,
        0
    );

    if (!orderDetail) {
        return <div style={{ textAlign: "center", padding: '50px' }}>주문 정보를 불러오는 중입니다...</div>;
    }

    return(
        <>
            {/* 페이지 타이틀 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: '40px 0 20px 0' }}>
                        <h2 style={{ fontSize: '28px', fontWeight: '700', color: '#222', margin: 0 }}>
                            주문 상세 조회
                        </h2>
                        
                        <div style={{ display: "flex", gap: "10px" }}>
                            <button style={{
                                backgroundColor: '#739FF2',
                                border: 'none',
                                color: 'white',
                                fontSize: '14px',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                상품 조회
                            </button>
                            <button style={{
                                backgroundColor: '#FFB84D',
                                border: 'none',
                                color: 'white',
                                fontSize: '14px',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                교환 신청
                            </button>
                            <button style={{
                                backgroundColor: '#FF6B6B',
                                border: 'none',
                                color: 'white',
                                fontSize: '14px',
                                padding: '10px 20px',
                                borderRadius: '6px',
                                fontWeight: '600',
                                cursor: 'pointer'
                            }}>
                                환불 신청
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* 주문 완료 안내 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{
                        background: '#E8F5E9',
                        border: '1px solid #A5D6A7',
                        borderRadius: '8px',
                        padding: '16px 20px',
                        marginBottom: '30px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px'
                    }}>
                        <div style={{
                            width: '32px',
                            height: '32px',
                            backgroundColor: '#4CAF50',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0
                        }}>
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3">
                                <polyline points="20 6 9 17 4 12"></polyline>
                            </svg>
                        </div>
                        <div style={{ fontSize: '15px', color: '#2E7D32', fontWeight: '600' }}>
                            주문이 정상적으로 완료되었습니다. 배송 상황은 마이페이지에서 확인 가능합니다.
                        </div>
                    </div>
                </div>
            </div>
            
            {/* 주문 정보 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.sectionTitle}>주문 정보</div>
                    <div style={styles.card}>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>주문 일자</div>
                            <div style={styles.formValue}>
                                {new Date(orderDetail.createdAt).toLocaleDateString()}
                            </div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>상품 정보</div>
                            <div style={{ ...styles.formValue, display: 'flex', alignItems: 'center', gap: '16px' }}>
                                <img 
                                    src={`${baseUrl}/image/${orderDetail.thumbnailFileId}`} 
                                    style={{
                                        width: '80px',
                                        height: '80px',
                                        borderRadius: '8px',
                                        objectFit: 'cover',
                                        border: '1px solid #eaeaea'
                                    }}
                                    alt="상품"
                                />
                                <div style={{ fontSize: '14px', color: '#222' }}>{orderDetail.productName}</div>
                            </div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>수량</div>
                            <div style={styles.formValue}>{totalQuantity}개</div>
                        </div>
                        <div style={{ ...styles.formRow, border: 'none' }}>
                            <div style={styles.formLabel}>가격</div>
                            <div style={styles.formValue}>{orderDetail.porductPrice.toLocaleString()}원</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 결제 정보 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.sectionTitle}>결제 정보</div>
                    <div style={styles.card}>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>총 주문금액</div>
                            <div style={styles.formValue}>{totalProductAmount.toLocaleString()}원</div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>국내 배송비</div>
                            <div style={styles.formValue}>{orderDetail.shippingAmount.toLocaleString()}원</div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>포인트 사용</div>
                            <div style={styles.formValue}>- {orderDetail.usingPoint.toLocaleString()}P</div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>결제 수단</div>
                            <div style={styles.formValue}>{orderDetail.method}</div>
                        </div>
                        <div style={{ ...styles.formRow, border: 'none', backgroundColor: '#fafafa' }}>
                            <div style={{ ...styles.formLabel, fontSize: '15px', fontWeight: '700' }}>최종 결제 금액</div>
                            <div style={{ ...styles.formValue, fontSize: '18px', fontWeight: '800', color: '#ff4444' }}>
                                {orderDetail.totalAmount.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 배송 정보 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={styles.sectionTitle}>배송 정보</div>
                    <div style={styles.card}>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>주문자 이름</div>
                            <div style={styles.formValue}>{orderDetail.memberName}</div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>주소</div>
                            <div style={styles.formValue}>
                                {orderDetail.streetAddress} {orderDetail.addressDetail}
                            </div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>이메일</div>
                            <div style={styles.formValue}>{orderDetail.email}</div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>전화번호</div>
                            <div style={styles.formValue}>{orderDetail.phone}</div>
                        </div>
                        <div style={styles.formRow}>
                            <div style={styles.formLabel}>배송 요청사항</div>
                            <div style={styles.formValue}>{orderDetail.note || '-'}</div>
                        </div>
                        <div style={{ ...styles.formRow, border: 'none' }}>
                            <div style={styles.formLabel}>출입 요청사항</div>
                            <div style={styles.formValue}>{orderDetail.accessInstructions || '-'}</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 주문 목록 버튼 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{ textAlign: 'center', margin: '30px 0 60px 0' }}>
                        <button
                            style={{
                                backgroundColor: '#739FF2',
                                color: 'white',
                                border: 'none',
                                padding: '14px 40px',
                                borderRadius: '8px',
                                fontSize: '15px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                            }}
                            onClick={() => navigate('/mypage/orderList')}
                            onMouseEnter={(e) => e.target.style.backgroundColor = '#5a7cd6'}
                            onMouseLeave={(e) => e.target.style.backgroundColor = '#739FF2'}
                        >
                            주문 목록으로 돌아가기
                        </button>
                    </div>
                </div>
            </div>
        </>
    )
}

const styles = {
    pageWrapper: {
        display: "flex",
        justifyContent: "center",
        width: "100%",
        backgroundColor: "#fff",
    },
    container: {
        width: "1020px",
        padding: "0 20px",
    },
    sectionTitle: {
        fontSize: '18px',
        fontWeight: '700',
        color: '#222',
        marginBottom: '16px',
        paddingBottom: '8px',
        borderBottom: '2px solid #222',
    },
    card: {
        border: '1px solid #e0e0e0',
        borderRadius: '8px',
        overflow: 'hidden',
        backgroundColor: '#fff',
        marginBottom: '30px',
    },
    formRow: {
        display: 'flex',
        borderBottom: '1px solid #eaeaea',
        minHeight: '56px',
    },
    formLabel: {
        width: '180px',
        padding: '16px 20px',
        fontSize: '14px',
        fontWeight: '600',
        color: '#444',
        backgroundColor: '#F2F9FC',
        display: 'flex',
        alignItems: 'center',
    },
    formValue: {
        flex: 1,
        padding: '16px 20px',
        fontSize: '14px',
        color: '#222',
        display: 'flex',
        alignItems: 'center',
    },
};