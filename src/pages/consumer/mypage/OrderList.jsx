import { Button,FormGroup,Label,Input, PaginationItem ,PaginationLink,Pagination, } from "reactstrap";
import "bootstrap/dist/css/bootstrap.min.css";
import { useNavigate } from "react-router-dom";
import { useState, useEffect} from "react";
import { baseUrl, myAxios } from "../../../config";
import "./PaginationCom.css";

export default function OrderList({ id }) {
  const navigate = useNavigate();

  //  사용자 정보 추가
  const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
  const username = userInfo?.username;

  //  리뷰 모달 상태
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  
  //  추가: 주문 목록 상태
  const [orderList, setOrderList] = useState([]);
  const [loading, setLoading] = useState(false);

  //  추가: 페이징 상태
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 10;

  //  추가: 검색 조건 상태
  const [searchParams, setSearchParams] = useState({
    startDate: "",
    endDate: "",
    searchType: "",
    searchKeyword: ""
  });

  //  추가: 임시 검색 조건 (화면에서 입력 중)
  const [draftParams, setDraftParams] = useState({
    startDate: "",
    endDate: "",
    searchType: "",
    searchKeyword: ""
  });

  const [draftPeriod, setDraftPeriod] = useState(null);
  
  // 추가: 날짜 포맷팅 유틸리티
  const pad2 = (n) => String(n).padStart(2, "0");
  const toYMD = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;


  // 추가: 기간 버튼 클릭 핸들러
  const setPeriodMonths = (months) => {
    const today = new Date();
    const from = new Date(today);
    from.setMonth(from.getMonth() - months);

    setDraftParams({
      ...draftParams,
      startDate: toYMD(from),
      endDate: toYMD(today)
    });
  };

  // 추가: 주문 목록 조회 API 호출 함수
  const fetchOrderList = async (page = 0) => {
    if (!username) return;
    
    setLoading(true);
    try {
      const params = {
        username,
        page,
        size: pageSize
      };

      if (searchParams.startDate) params.startDate = searchParams.startDate;
      if (searchParams.endDate) params.endDate = searchParams.endDate;
      if (searchParams.searchType && searchParams.searchKeyword) {
        params.searchType = searchParams.searchType;
        params.searchKeyword = searchParams.searchKeyword;
      }

      const res = await myAxios().get("/mypage/orderList", { params });
      
      setOrderList(res.data.content || []);
      setTotalPages(res.data.totalPages || 0);
      setCurrentPage(res.data.number || 0);
    } catch (err) {
      console.error("주문 목록 조회 실패:", err);
      setOrderList([]);
    } finally {
      setLoading(false);
    }
  };

  // 추가: 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    setSearchParams(draftParams);
    setCurrentPage(0);
  };

  // 추가: 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  //날짜 포맷팅 함수
  const formatDate = (dateStr) => {
    if (!dateStr) return ""; // 기본값 제거
    return String(dateStr).substring(0, 10).replace(/-/g, ".");
  };
  //주문 상태별 버튼 렌더링 함수
const renderActionButtons = (order) => {
  // 서버에서 내려주는 실제 상태 필드를 확인
  const status = order.status; // 기존 order.orderStatus → order.status

  switch(status) {
    case "READY":
    case "PAID":
      return (
        <>
          <button 
            style={styles.smallBtn}
            onClick={() => navigate(`/mypage/orderList/orderDetail/${order.id}`)}
          >
            주문 상세
          </button>
          <button style={styles.smallBtn}>취소 신청</button>
        </>
      );
    case "PREPARING":
      return (
        <button 
          style={styles.smallBtn}
          onClick={() => navigate(`/mypage/orderList/orderDetail/${order.id}`)}
        >
          주문 상세
        </button>
      );
    case "SHIPPING":
      return (
        <>
          <button 
            style={styles.smallBtn}
            onClick={() => navigate(`/mypage/orderList/orderDetail/${order.id}`)}
          >
            주문 상세
          </button>
          <button style={styles.smallBtn}>배송 조회</button>
        </>
      );
    case "DELIVERED":
      return (
        <>
          <button 
            style={styles.smallBtn}
            onClick={() => navigate(`/mypage/orderList/orderDetail/${order.id}`)}
          >
            주문 상세
          </button>
          {/* <button style={styles.smallBtn}>배송 조회</button>
          <button style={styles.smallBtn}>반품 신청</button> */}
          {/* <button 
            style={styles.smallBtn} 
            onClick={() => setReviewModalOpen(true)}
          >
            리뷰 작성
          </button> */}
          {/* <button style={styles.smallBtn}>교환 신청</button> */}
        </>
      );
    case "CANCELLED":
      return (
        <button style={styles.smallBtn}>취소 상세</button>
      );
    default:
      return (
        <button 
          style={styles.smallBtn}
          onClick={() => navigate(`/mypage/orderList/orderDetail/${order.id}`)}
        >
          주문 상세
        </button>
      );
  }
};

  // 추가: 데이터 로드 useEffect
  useEffect(() => {
    fetchOrderList(currentPage);
  }, [currentPage, searchParams, username]);


  const ORDER_STATUS_KR = {
    PAID: "결제완료",
    PREPARING: "상품준비중",
    SHIPPING: "배송중",
    DELIVERED: "배송완료",

    CANCELLED: "취소완료",

    COLLECTING: "상품 회수중",

    EXCHANGE_REQUESTED: "교환신청",
    EXCHANGE_PREPARATION: "교환준비",
    EXCHANGE_RETRIEVAL: "교환 회수중",
    EXCHANGE_SHIPPING: "교환 배송중",
    EXCHANGE_REJECTED: "교환거절",
    EXCHANGE_COMPLETED: "교환완료",

    RETURN_REQUESTED: "반품신청",
    RETURN_PREPARATION: "반품준비",
    RETURNS_RETRIEVAL: "반품회수중",
    RETURN_REJECTED: "반품거절",
    RETURN_COMPLETED: "반품완료",
  };

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
                            {[1, 3, 6, 12].map((m) => (
                              <button
                                key={m}
                                style={draftPeriod === m ? styles.periodBtnActive : styles.periodBtn}
                                onClick={() => {
                                  setDraftPeriod(m);
                                  setPeriodMonths(m);
                                }}
                              >
                                {m}개월
                              </button>
                            ))}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                          <FormGroup style={{ margin: 0 }}>
                            <Input 
                              id="startDate" 
                              name="startDate" 
                              type="date"
                              value={draftParams.startDate}
                              onChange={(e) => setDraftParams({ ...draftParams, startDate: e.target.value })}
                            />
                          </FormGroup>

                          <span style={{ fontSize: '20px' }}>~</span>

                          <FormGroup style={{ margin: 0 }}>
                            <Input 
                              id="endDate" 
                              name="endDate" 
                              type="date"
                              value={draftParams.endDate}
                              onChange={(e) => setDraftParams({ ...draftParams, endDate: e.target.value })}
                            />
                          </FormGroup>
                        </div>
                    </div>

                    {/* 조회 버튼 */}
                    <div style={{width: "120px", display: "flex",justifyContent: "center",alignItems: "center", padding:'0'}}>
                        <Button 
                          style={{padding: "10px 10px", backgroundColor: "#E7EBF3", border: "1px solid #ccc", borderRadius: "6px", fontSize:'12px', color:'black'}}
                          onClick={handleSearch}
                        >
                          조회
                        </Button>
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
                    <div style={{ ...styles.rowHeader, width: "15%" }}>결제 금액</div>
                    <div style={{ ...styles.rowHeader, width: "10%" }}></div>
                </div>
                <hr style={{margin:'0', border:'1px solid black'}}/>

                {/* 로딩 상태 표시 */}
                {loading && (
                  <div style={{ padding: "20px", textAlign: "center" }}>로딩 중...</div>
                )}

                {/* 주문 목록이 없을 때 표시 */}
                {!loading && orderList.length === 0 && (
                  <div style={{ padding: "40px", textAlign: "center", color: "#888" }}>
                    주문 내역이 없습니다.
                  </div>
                )}

                {/* 주문 목록 */}
                {!loading && orderList.map((order, index) => (
                    <div key={order.orderItemId || index} style={{ ...styles.row, borderBottom: "1px solid #eee" }}>

                        {/* 주문일자 */}
                        <div style={{ ...styles.col, width: "20%" }}>
                            <div style={{ fontSize: '14px', marginBottom: '4px' }}>
                              {formatDate(order.orderedAt)}
                            </div>
                            <div style={{ color: "#888", fontSize: '12px' }}>{order.id}</div>
                        </div>

                        {/* 상품 정보 */}
                        <div style={{ ...styles.col, width: "45%", display: "flex", alignItems: "center" }}>
                        <img 
                          src={order.thumbnailFileName ? `${baseUrl}/file/order/${order.thumbnailFileName}` : "/computer.png"}
                          alt={order.gbProductName}
                          style={{ width: "80px", height: "80px", marginRight: "10px", objectFit: "cover" }} 
                        />
                        <div style={{ flex: 1 }}>
                            <div style={{fontSize:'14px', marginBottom: '4px'}}>{order.productName}</div>
                            <div style={{ color: "#777", fontSize: "12px" }}>주문 날짜: {formatDate(order.createdAt)}</div>
                        </div>
                        <div style={{padding: "4px 10px", borderRadius: "6px", fontSize: "12px", marginLeft: "10px", whiteSpace: "nowrap", backgroundColor:'#F2F9FC', color:'#7693FC', border:'1px solid #7693FC'}}>
                          {ORDER_STATUS_KR[order.status] || "상태 없음"}
                        </div>
                        </div>

                        {/* 수량 : 기본값 1 */} 
                        <div style={{ ...styles.col, width: "10%" }}>{1}</div>

                        {/* 가격 */}
                        <div style={{ ...styles.col, width: "15%" }}>
                          {order.totalAmount?.toLocaleString() || 0}원
                        </div>

                        {/* 버튼 영역 */}
                        <div style={{ ...styles.col, width: "10%" }}>
                          {renderActionButtons(order)}
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 페이징 */}
        <Pagination className="paginationContainer">
          {/* 이전 */}
          <PaginationItem disabled={currentPage === 0}>
            <PaginationLink onClick={() => handlePageChange(currentPage - 1)}>
              이전
            </PaginationLink>
          </PaginationItem>

          {/* 페이지 번호 */}
          {[...Array(totalPages)].map((_, idx) => (
            <PaginationItem key={idx} active={currentPage === idx}>
              <PaginationLink onClick={() => handlePageChange(idx)}>
                {idx + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          {/* 다음 */}
          <PaginationItem disabled={currentPage === totalPages - 1}>
            <PaginationLink onClick={() => handlePageChange(currentPage + 1)}>
              다음
            </PaginationLink>
          </PaginationItem>
        </Pagination>

        {/* ⭐ 리뷰 작성 모달 */}
        {reviewModalOpen && <ReviewModal onClose={() => setReviewModalOpen(false)} />}
    </>
  );
}

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
  periodBtnActive: {
    padding: "6px 14px",
    marginRight: "8px",
    border: "1px solid #7693FC",
    borderRadius: "4px",
    backgroundColor: "#7693FC",
    color: "#fff",
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
  },
  pageBtn: {
    padding: "6px 12px",
    border: "1px solid #ddd",
    backgroundColor: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  },
  pageBtnActive: {
    padding: "6px 12px",
    border: "1px solid #7693FC",
    backgroundColor: "#7693FC",
    color: "#fff",
    borderRadius: "4px",
    cursor: "pointer",
    fontSize: "14px"
  }
};

const pageing = {

}