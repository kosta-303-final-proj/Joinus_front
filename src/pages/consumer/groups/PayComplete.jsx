import { Link,useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import { useEffect, useRef,useState } from "react";
import { myAxios,baseUrl } from "../../../config";

export default function PayComplete(){
    const didRun = useRef(false); // ✅ StrictMode 방어
    const navigate = useNavigate();
    const location = useLocation(); // CheckoutPage에서 전달받은 state
    const searchParams = new URLSearchParams(window.location.search);
   // 로그인 정보 확인
    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const memberUsername = userInfo.username;

    if (!memberUsername) {
        console.error("로그인 정보 없음");
        navigate(`/fail?message=로그인 정보 없음`);
        return null; // 렌더링 중단
    }
    

    const [paymentConfirmed, setPaymentConfirmed] = useState(false); // 결제 확인 상태
    const orderId = location.state?.orderId || searchParams.get("orderId");
    const gbProductId = location.state?.productId || searchParams.get("productId");
    const amount = location.state?.amount || parseInt(searchParams.get("amount")) || 0;
    const quantity = location.state?.quantity || parseInt(searchParams.get("quantity")) || 1;
    const selectedOptionsRaw = location.state?.selectedOptions || JSON.parse(searchParams.get("selectedOptions") || "[]");
    const paymentKey = searchParams.get("paymentKey");
    const optionIds = selectedOptionsRaw.map(opt => opt.optionId);

    
    if (!orderId) {
        console.error("orderId가 없음");
        return navigate(`/fail?message=orderId가 없음`);
    }

    if (!gbProductId) {
        console.error("gbProductId가 없음");
        return navigate(`/fail?message=gbProductId가 없음`);
    }

    const [order, setOrder] = useState(null);
    const [orderCreated, setOrderCreated] = useState(false); // ✅ OrderItem 생성 완료 체크

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        async function confirmPayment() {
            try {
                const confirmedKey = `payment_confirmed_${orderId}`;
                if (!sessionStorage.getItem(confirmedKey)) {
                    await myAxios().post("/payments/confirm", {
                        paymentKey,
                        orderId,
                        method: "CARD",
                        status: "PAID",
                        approvedAt: new Date().toISOString(),
                        amount,
                    });
                    sessionStorage.setItem(confirmedKey, "true");
                    setPaymentConfirmed(true);
                } else {
                    setPaymentConfirmed(true);
                }

                // OrderItem 생성
                await myAxios().post("/orderItems", {
                    orderId,
                    gbProductId,
                    quantity,
                    unitPrice: amount,
                    lineSubtotal: amount * quantity,
                    total: amount,
                    gbProductOptionIds: optionIds,
                    memberUsername
                });

                setOrderCreated(true); // ✅ 생성 완료 표시

            } catch (error) {
                console.error("결제/OrderItem 생성 에러:", error);
                navigate(`/fail?message=${error.message}`);
            }
        }

        confirmPayment();
    }, [navigate, location.state, orderId]);

    // 결제 + OrderItem 생성 완료 후 주문 조회
    useEffect(() => {
        if (!orderId || !orderCreated) return;

        async function fetchOrder() {
            try {
                const res = await myAxios().get(`/orders/${orderId}`);
                setOrder(res.data);
            } catch (error) {
                console.error("주문 조회 실패", error);
            }
        }

        fetchOrder();
    }, [orderId, orderCreated]);

    if (!order) return <div>주문 정보를 불러오고 있는 중입니다.</div>;
    
    return(
        <>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <hr style={{border:'2px solid black', marginBottom:'0'}}/>
                    <div style={{height:'200px',paddingTop: '30px',textAlign:'center', justifyContent:'center'}}>
                        <div className="fw-bold" style={{fontSize:'32px'}}>
                            주문이 완료되었습니다.
                        </div>
                        {/* <div style={{border:'1px solid black', backgroundColor:'#A09B9B', width:'300px', margin:'20px auto'}}>
                            주문번호 : {order.orderId}
                        </div> */}
                        <div style={orderNumberBox}>
                            <span style={orderNumberLabel}>주문번호</span>
                            <span style={orderNumberValue}>{order.orderId}</span>
                        </div>

                        <div>
                            <Link to={`/mypage/orderList/orderDetail/${order.orderId}`}>
                                <Button
                                    style={{
                                        backgroundColor: "#739FF2",
                                        color: "white",
                                        border: "none",
                                        fontSize: "12px",
                                        padding: "8px 20px",
                                        borderRadius: "8px",
                                    }}
                                >
                                    주문 상세
                                </Button>
                            </Link>
                        </div>
                    </div>
                    <hr style={{border:'2px solid black', marginTop:'20px'}}/>

                    <div style={{textAlign:'center', fontSize:'14px'}}>
                        <div>* 본 상품은 결제가 완료되었으며,  공구가 마감된 후에는 취소할 수 없습니다.</div>
                        <div>* 상품 수령 후 반품 요청 부탁드립니다.</div>
                    </div>
                    <hr />
                </div>
            </div>
            <div style={styles.pageWrapper}>
                <div style={{width:'1020px'}}>
                    <div>
                        <h3 className="mb-0 fw-bold text-start" style={{fontSize:'20px'}}>주문 정보</h3>
                    </div>
                </div>
            </div>
            {/* 주문 정보 영역 */}
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <div style={{border: '1px solid black',borderRadius: '5px',overflow: 'hidden'}}>
                        <div style={row}>
                            <div style={leftCol}>주문 일자</div>
                            <div style={rightCol}>{new Date(order.createdAt).toLocaleDateString()}</div>
                        </div>

                        {/* 상품 정보 */}
                        <div style={row}>
                            <div style={leftCol }>상품 정보</div>
                            <div style={{ ...rightCol, display: 'flex', alignItems: 'center', gap: '10px' }}>
                                
                                <img  src={`${baseUrl}/files/${order.thumbnailFileName}`} style={{width: '80px',height: '80px',borderRadius: '8px', objectFit: 'cover'}}/>
                                <div>{order.productName}</div>
                            </div>
                        </div>

                        {/* 수량 */}
                        <div style={row}>
                            <div style={leftCol}>수량</div>
                            <div style={rightCol}>{order.quantity}</div>
                        </div>

                        {/* 가격 */}
                        <div style={row}>
                            <div style={leftCol}>결제 가격</div>
                            <div style={rightCol}>{order.total.toLocaleString()}원</div>
                        </div>

                        {/* 요청사항 */}
                        <div style={row}>
                            <div style={leftCol}>요청사항</div>
                            <div style={rightCol}>{order.orderNote || "요청사항 없음"}</div>
                        </div>
                    </div>
                    <br/><br/>
                    <div style={{display:'flex',justifyContent:'center', gap: '40px', margin: '10px 0'}}>
                        <Link to="/myPage/orderList">
                            <Button style={{backgroundColor:'#739FF2', color:'white', border:'none',fontSize:'12px'}}>주문 배송 조회</Button>
                        </Link>
                        <Link to="/gbProductList">
                            <Button style={{backgroundColor:'#F7F7F7', color:'black', border:'none',fontSize:'12px'}}>공구 목록</Button>
                        </Link>
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
    padding: "20px 0",
  },
};
const row = {
    display: 'flex',
    borderBottom: '1px solid #A09B9B',
    
};

const leftCol = {
    width: '200px',
    padding: '20px',
    fontWeight: 'bold',
    borderRight: '1px solid #A09B9B',
    backgroundColor: '#E5EEFF',
    display: 'flex',          
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center'
};
const rightCol = {
    flex: 1,
    padding: '20px',
};

const orderNumberBox = {
    display: "inline-flex",
    alignItems: "center",
    gap: "12px",
    padding: "12px 24px",
    margin: "20px auto",
    borderRadius: "12px",
    backgroundColor: "#F4F7FF",
    border: "1px solid #D6E2FF",
    boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
};

const orderNumberLabel = {
    fontSize: "14px",
    fontWeight: "600",
    color: "#4A6CF7",
};

const orderNumberValue = {
    fontSize: "16px",
    fontWeight: "700",
    color: "#222",
    letterSpacing: "0.5px",
};