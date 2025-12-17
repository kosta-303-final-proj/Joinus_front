import { Link,useNavigate, useSearchParams, useLocation } from "react-router-dom";
import { Button } from "reactstrap";
import { useEffect, useRef,useState } from "react";
import { myAxios,baseUrl } from "../../../config";

export default function PayComplete(){
    const didRun = useRef(false); // ✅ StrictMode 방어
    const navigate = useNavigate();
    const location = useLocation(); // CheckoutPage에서 전달받은 state
    const searchParams = new URLSearchParams(window.location.search);

    const [paymentConfirmed, setPaymentConfirmed] = useState(false); // 결제 확인 상태
    const orderId = location.state?.orderId || searchParams.getAll("orderId")[0];
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

    useEffect(() => {
        if (didRun.current) return;
        didRun.current = true;

        async function confirmPayment() {
        try {
            //이미 결제 확인했는지 체크 (새로고침 방어)
            const confirmedKey = `payment_confirmed_${orderId}`;
            if (sessionStorage.getItem(confirmedKey)) {
                console.log("이미 결제 확인됨 - confirm 스킵");
                return;
            }
            
            // 서버에 orderId로 조회 후 금액 검증
            const response = await myAxios().post("/payments/confirm", {
            paymentKey,
            orderId,
            method: "CARD",
            status: "PAID",
            approvedAt: new Date().toISOString(),
            amount: location.state?.amount || 0,
            });

            console.log("결제 성공:", response.data);
            setPaymentConfirmed(true);

            // ✅ confirm 성공 표시 저장
            sessionStorage.setItem(confirmedKey, "true");

            // 2️⃣ OrderItem 생성 전에 필수 값 체크
            const productId = location.state?.productId;
            const quantity = location.state?.quantity || 1;
            // const amount = location.state?.amount || 0;
            const selectedOptions = location.state?.selectedOptions || [];

            if (!orderId || !gbProductId) {
                console.error("필수 데이터 누락", { orderId, gbProductId });
                return navigate(`/fail?message=필수 데이터 누락`);
            }


            // 3️⃣ OrderItem 생성
            await myAxios().post("/orderItems", {
            orderId,
            gbProductId,
            quantity,
            unitPrice: amount,
            lineSubtotal: amount * quantity,
            total: amount,
            gbProductOptionIds: optionIds, // 서버에서 JSON 변환
            });

            console.log("OrderItem 생성 완료");
            
        } catch (error) {
            console.error("결제 확인 에러:", error);
            navigate(`/fail?message=${error.message}`);
        }
        }

        confirmPayment();
    }, [navigate, location.state, orderId, paymentKey, gbProductId, selectedOptionsRaw]);

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (!orderId) return; // 안전하게 처리

        async function fetchOrder() {
            try {
            const res = await myAxios().get(`/orders/${orderId}`);
            setOrder(res.data);
            } catch (error) {
            console.log("주문 조회 실패", error);
            } 
            // finally {
            //     setLoading(false);
            // }
        }
        fetchOrder();
    }, [orderId, order]);

    if (!order) return <div>주문 정보를 불러올 수 없습니다.</div>;
    
    return(
        <>
            <div style={styles.pageWrapper}>
                <div style={styles.container}>
                    <hr style={{border:'2px solid black', marginBottom:'0'}}/>
                    <div style={{height:'200px',paddingTop: '40px',textAlign:'center', justifyContent:'center'}}>
                        <div className="fw-bold" style={{fontSize:'32px'}}>
                            주문이 완료되었습니다.
                        </div>
                        <div style={{border:'1px solid black', backgroundColor:'#A09B9B', width:'300px', margin:'20px auto'}}>
                            주문번호 : {order.orderId}
                        </div>
                        <Link to="">
                        <Button style={{backgroundColor:'#739FF2', color:'white', border:'none', fontSize:'12px'}}>
                            주문 상세
                        </Button>
                        </Link>
                    </div>
                    <hr style={{border:'2px solid black', marginTop:'0'}}/>

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
                            <div style={rightCol}>{order.total.toLocaleString()}</div>
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
