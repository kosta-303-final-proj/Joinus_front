import { Button,FormGroup,Label,Input, PaginationItem ,PaginationLink,Pagination, } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { baseUrl, myAxios } from "../../../config";

export default function OrderList({ id }) {
  const navigate = useNavigate();

  // ⭐ 리뷰 모달 상태
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
  const [orderList, setOrderList] = useState([]);
  const [page, setPage] = useState(0);
  const [size, setSize] = useState(10);
  const [totalPages, setTotalPages] = useState(0);

  const pageMove = () =>{
    navigate("/mypage/orderList/orderDetail/:id");
  }

  useEffect(() => {
    const fetchOrderList = async () => {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const username = userInfo?.username;

      try {
        const res = await myAxios().get("/orderList", { params: { username, page, size } });
        setOrderList(res.data.content);  // Page의 content
        setTotalPages(res.data.totalPages);
      } catch (err) {
        console.error("주문 목록 조회 실패", err);
      }
    };
    fetchOrderList();
  }, [page, size]);
  return (
    <>
        {/* 제목 영역 */}
        <div style={styles.pageWrapper}>
            <div style={styles.container}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0",}}>
                    <div className="mb-0 fw-bold text-start" style={{fontSize:'20px' }}>주문/배송조회</div>
                </div>
            </div>
        </div>

        {/* 조회 조건 영역 */}
        <div style={styles.pageWrapper}>
            <div style={{width:'860px', padding:'0'}}>

            {/* 조회 조건 박스 */}
                <div style={{border: "1px solid #ddd", padding: "20px", display: "flex", justifyContent: "space-between"}}>
                
                    <div>
                        <div style={{ marginBottom: "10px" }}>구매기간</div>

                        <div style={{ marginBottom: "15px" }}>
                            <button style={styles.periodBtn}>1개월</button>
                            <button style={styles.periodBtn}>3개월</button>
                            <button style={styles.periodBtn}>6개월</button>
                            <button style={styles.periodBtn}>12개월</button>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <FormGroup style={{ margin: 0 }}>
                            <Input id="startDate" name="startDate" type="date" />
                          </FormGroup>

                          <span style={{ fontSize: '20px' }}>~</span>

                          <FormGroup style={{ margin: 0 }}>
                            <Input id="endDate" name="endDate" type="date" />
                          </FormGroup>
                        </div>
                    </div>

                    {/* 조회 버튼 */}
                    <div style={{width: "120px", display: "flex",justifyContent: "center",alignItems: "center", padding:'0'}}>
                        <Button style={{padding: "10px 10px", backgroundColor: "#E7EBF3", border: "1px solid #ccc", borderRadius: "6px", fontSize:'12px', color:'black'}}>조회</Button>
                    </div>
                </div>
                
            </div>
        </div>

        <div style={styles.pageWrapper}>
            <div style={styles.container}>

                {/* 헤더 영역 */}
                <hr style={{margin:'0', border:'1px solid black'}}/>
                <div style={{ display: "flex", backgroundColor: "#E7EBF3", padding: "12px 0", fontSize:'12px'}}>
                    <div style={{ ...styles.rowHeader, width: "20%" }}>{orderList.id}({orderList.createdAt})</div>
                    <div style={{ ...styles.rowHeader, width: "45%" }}>상품 정보</div>
                    <div style={{ ...styles.rowHeader, width: "10%" }}>수량</div>
                    <div style={{ ...styles.rowHeader, width: "15%" }}>결제 금액</div>
                    <div style={{ ...styles.rowHeader, width: "10%" }}></div>
                </div>
                <hr style={{margin:'0', border:'1px solid black'}}/>


                {orderList.map((order, index) => (
                  <div key={order.id ?? index} style={{ ...styles.row, borderBottom: "1px solid #eee" }}>
                        {/* 주문일자 */}
                        <div style={{ ...styles.col, width: "20%" }}>
                            <span style={{ color: "#888", fontSize:'16x' }}>{order.id}</span>
                        </div>

                        {/* 상품 정보 */}
                        <div style={{ ...styles.col, width: "45%", display: "flex", alignItems: "center" }}>
                        <img src={`${baseUrl}/images/${order.thumbnailFileName}`} alt="" style={{ width: "80px", height: "80px", marginRight: "10px" }} />
                        <div style={{ flex: 1 }}>
                            <div style={{fontSize:'14px'}}>{order.productName}</div>
                            <div style={{ color: "#777", fontSize: "12px" }}>주문 날짜: {order.createdAt?.substring(0, 10)}</div>
                        </div>
                        <div style={{padding: "4px 10px", borderRadius: "6px", fontSize: "12px", marginLeft: "10px", whiteSpace: "nowrap", backgroundColor:'#F2F9FC', color:'#7693FC', border:'1px solid #7693FC'}}>
                          {order.status}
                        </div>
                        </div>

                        {/* 수량 */}
                        <div style={{ ...styles.col, width: "10%" }}>1</div>

                        {/* 가격 */}
                        <div style={{ ...styles.col, width: "15%" }}>{order.productPrice}원</div>

                        {/* 버튼 영역 —⭐ 상태별 조건 적용 */}
                        <div style={{ ...styles.col, width: "10%" }}>
                          {order.status === "READY" && (
                            <>
                            </>
                          )}

                          {order.status === "PAID" && (
                            <>
                              <button style={styles.smallBtn}  onClick={pageMove}>주문 상세</button>
                              <button style={styles.smallBtn}>취소 신청</button>
                            </>
                          )}

                          {order.status === "해외배송중" && (
                            <>
                              <button style={styles.smallBtn} onClick={pageMove}>주문 상세</button>
                            </>
                          )}

                          {order.status === "CANCELLED" && (
                            <>
                              <button style={styles.smallBtn}>취소 상세</button>
                            </>
                          )}

                          {order.status === "SHIPPING" && (
                            <>
                              <button style={styles.smallBtn} onClick={pageMove}>주문 상세</button>
                              <button style={styles.smallBtn}>배송 조회</button>
                            </>
                          )}

                          {order.status === "DELIVERED" && (
                            <>
                              <button style={styles.smallBtn} onClick={pageMove}>주문 상세</button>
                              <button style={styles.smallBtn}>배송 조회</button>
                              <button style={styles.smallBtn}>반품 신청</button>

                              <button style={styles.smallBtn} onClick={() => setReviewModalOpen(true)}>
                                리뷰 작성
                              </button>

                              <button style={styles.smallBtn}>교환 신청</button>
                            </>
                          )}
                        </div>
                    </div>
                ))}
                <Pagination>
                  <PaginationItem disabled={page === 0}>
                    <PaginationLink first onClick={() => setPage(0)} />
                  </PaginationItem>
                  <PaginationItem disabled={page === 0}>
                    <PaginationLink previous onClick={() => setPage(prev => Math.max(prev-1, 0))} />
                  </PaginationItem>

                  {[...Array(totalPages)].map((_, i) => (
                    <PaginationItem active={i === page} key={i}>
                      <PaginationLink onClick={() => setPage(i)}>{i+1}</PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem disabled={page === totalPages-1}>
                    <PaginationLink next onClick={() => setPage(prev => Math.min(prev+1, totalPages-1))} />
                  </PaginationItem>
                  <PaginationItem disabled={page === totalPages-1}>
                    <PaginationLink last onClick={() => setPage(totalPages-1)} />
                  </PaginationItem>
                </Pagination>
            </div>
        </div>

        {/* ⭐ 리뷰 작성 모달 */}
        {reviewModalOpen && <ReviewModal onClose={() => setReviewModalOpen(false)} />}
    </>
  );
}



/* ---------------- 리뷰 작성 모달 ---------------- */

function ReviewModal({ onClose }) {
  return (
    <>
      {/* 배경 */}
      <div style={modalOverlay}></div>

      {/* 모달 */}
      <div style={modalBox}>
        <div style={modalTop}>
          <span style={{ fontWeight: "bold" }}>리뷰 작성</span>
          <span style={closeBtn} onClick={onClose}>✕</span>
        </div>

        <div style={{ padding: "20px 30px" }}>
          
          {/* 별점 */}
          <div style={{ marginBottom: "10px", fontWeight: "bold" }}>
            상품은 어떠셨나요?
          </div>

          <div style={{ marginBottom: "15px" }}>
            ⭐⭐⭐⭐☆
          </div>

          {/* 리뷰 내용 */}
          <div style={{ fontWeight: "bold" }}>리뷰 내용</div>
          <textarea
            placeholder="내용을 입력해주세요."
            style={{
              width: "100%",
              height: "140px",
              border: "1px solid #aaa",
              marginTop: "5px",
              padding: "10px",
              resize: "none"
            }}
          />

          {/* 이미지 첨부 */}
          <div style={{ marginTop: "20px", fontWeight: "bold" }}>
            이미지 첨부
          </div>

          <div style={{ display: "flex", gap: "15px", marginTop: "10px" }}>
            {[1,2,3].map(n => (
              <div key={n} style={imgBox}>+</div>
            ))}
          </div>

          <button style={submitBtn}>등록하기</button>
        </div>
      </div>
    </>
  );
}


/* ---------------- 스타일 ---------------- */

const modalOverlay = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.5)",
  zIndex: 999
};

const modalBox = {
  position: "fixed",
  top: "50%", left: "50%",
  transform: "translate(-50%, -50%)",
  width: "420px",
  background: "#fff",
  borderRadius: "6px",
  zIndex: 1000
};

const modalTop = {
  background: "#f2f2f2",
  padding: "12px 15px",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "16px"
};

const closeBtn = {
  cursor: "pointer",
  fontSize: "18px"
};

const imgBox = {
  width: "80px",
  height: "80px",
  border: "1px solid #aaa",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  cursor: "pointer"
};

const submitBtn = {
  marginTop: "20px",
  width: "100%",
  background: "#5A83F7",
  color: "#fff",
  padding: "12px 0",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};


/* 기존 스타일 그대로 유지 */
const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    width: "860px",
    padding: "20px 0",
  },
  periodBtn: {
    padding: "6px 14px",
    marginRight: "8px",
    border: "1px solid #CCD1D8",
    borderRadius: "4px",
    backgroundColor: "#F5F6F8",
    cursor: "pointer",
    fontSize:'12px'
  },
  rowHeader: {
    fontWeight: "bold",
    textAlign: "center"
  },
  row: {
    display: "flex",
    padding: "15px 0",
    alignItems: "center"
  },
  col: {
    textAlign: "center"
  },
  smallBtn: {
    width: "80px",
    fontSize: "10px",
    marginBottom: "5px",
    padding: "5px 0",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  }
};
