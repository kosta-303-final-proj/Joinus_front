import { Button,FormGroup,Label,Input } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
  const navigate = useNavigate();
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
            <div style={{width:'100%', padding:'0'}}>

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
                            <Input
                              id="startDate"
                              name="startDate"
                              type="date"
                            />
                          </FormGroup>

                          <span style={{ fontSize: '20px' }}>~</span>

                          <FormGroup style={{ margin: 0 }}>
                            <Input
                              id="endDate"
                              name="endDate"
                              type="date"
                            />
                          </FormGroup>
                        </div>
                    </div>
                    {/* 조회 버튼 */}
                    <div style={{width: "120px", display: "flex",justifyContent: "center",alignItems: "center", padding:'0'}}>
                        <Button style={{padding: "10px 10px", backgroundColor: "#E7EBF3", border: "1px solid #ccc", borderRadius: "6px", fontSize:'12px'}}>조회</Button>
                    </div>
                </div>
                
            </div>
        </div>

        <div style={styles.pageWrapper}>
            <div style={styles.container}>

                {/* 헤더 영역 */}
                <hr style={{margin:'0', border:'1px solid black'}}/>
                <div style={{ display: "flex", backgroundColor: "#E7EBF3", padding: "12px 0", fontSize:'12px'}}>
                    <div style={{ ...styles.rowHeader, width: "20%" }}>주문일자(주문번호)</div>
                    <div style={{ ...styles.rowHeader, width: "45%" }}>상품 정보</div>
                    <div style={{ ...styles.rowHeader, width: "10%" }}>수량</div>
                    <div style={{ ...styles.rowHeader, width: "15%" }}>상품 금액</div>
                    <div style={{ ...styles.rowHeader, width: "10%" }}></div>
                </div>
                <hr style={{margin:'0', border:'1px solid black'}}/>
                {[...Array(3)].map((_, index) => (
                    <div key={index} style={{ ...styles.row, borderBottom: "1px solid #eee" }}>

                        {/* 주문일자 */}
                        <div style={{ ...styles.col, width: "20%" }}>
                            <span style={{ color: "#888", fontSize:'16x' }}>123456</span>
                        </div>

                        {/* 상품 정보 */}
                        <div style={{ ...styles.col, width: "45%", display: "flex", alignItems: "center" }}>
                        <img src="/computer.png" alt="" style={{ width: "80px", height: "80px", marginRight: "10px" }} />
                        <div style={{ flex: 1 }}>
                            <div style={{fontSize:'14px'}}>Start Fuck 500ml 세트 묶음</div>
                                <div style={{ color: "#777", fontSize: "12px" }}>주문 날짜: 2025-11-22</div>
                            </div>
                            <div style={{padding: "4px 10px", borderRadius: "6px", fontSize: "12px", marginLeft: "10px", whiteSpace: "nowrap", backgroundColor:'#F2F9FC', color:'#7693FC', border:'1px solid #7693FC'}}>배송완료</div>
                        </div>

                        {/* 수량 */}
                        <div style={{ ...styles.col, width: "10%" }}>1</div>

                        {/* 가격 */}
                        <div style={{ ...styles.col, width: "15%" }}>90,000원</div>

                        {/* 버튼 */}
                        <div style={{ ...styles.col, width: "10%" }}>
                        <button style={styles.smallBtn} onClick={()=> navigate('./orderDetail')}>주문 상세</button>
                        <button style={styles.smallBtn}>배송 조회</button>
                        <button style={styles.smallBtn}>리뷰 작성</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </>
  );
}


/* 스타일 */
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
    fontSize: "12px",
    marginBottom: "5px",
    padding: "5px 0",
    border: "1px solid #ccc",
    backgroundColor: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    display: "block",
    marginLeft: "auto",
    marginRight: "auto"
  },
  productBox: {
    display: "flex",
    alignItems: "center",
    padding: "10px"
  },
  pageNum: {
    display: "inline-block",
    padding: "6px 10px",
    margin: "0 3px",
    border: "1px solid #ddd",
    borderRadius: "4px",
    cursor: "pointer"
  }
};
