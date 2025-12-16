import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button, FormGroup, Input } from "reactstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderItem from "./OrderItem";

export default function CnclExchRtrnHisList() {
  
  // 실제 조회에 적용되는 값(조회 버튼 눌렀을 때만 변경)
  const [historyType, setHistoryType] = useState("all");
    
  // ============= 화면에서 선택 중인 값 =============
  const [draftHistoryType, setDraftHistoryType] = useState("all");
  const [draftPeriod, setDraftPeriod] = useState(null);
  // 1 | 3 | 6 | 12 | null
  const [draftStartDate, setDraftStartDate] = useState("");
  const [draftEndDate, setDraftEndDate] = useState("");
  
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  // 임시 사용자
  const username = "kakao_4633814946";

  // ============= 구매기간 버튼/날짜 추가 =============
  const pad2 = (n) => String(n).padStart(2, "0");
  const toYMD = (d) =>
    `${d.getFullYear()}-${pad2(d.getMonth() + 1)}-${pad2(d.getDate())}`;

  const setPeriodMonths = (months) => {
    const today = new Date();
    const from = new Date(today);
    from.setMonth(from.getMonth() - months);

    setDraftStartDate(toYMD(from));
    setDraftEndDate(toYMD(today));
  };

  // ============= 기간 필터 =============
    const parseTime = (v) => {
    const t = new Date(v ?? 0)  .getTime();
    return Number.isNaN(t) ? 0 : t;
  };

  // 조회 버튼 눌렀을 때 
  const onSearch = async () => {
    // 1) 적용값 업데이트
    setHistoryType(draftHistoryType);

    // 2) 서버 조회
    await fetchHistory(draftHistoryType);

  };

  const fetchHistory = async (type) => {
    setLoading(true);
    try {
      let url = "";

      if (type === "cancel") url = `/mypage/cnclExchRtrnHisList/cancel/${username}`;
      else if (type === "return") url = `/mypage/cnclExchRtrnHisList/return/${username}`;
      else if (type === "exchange") url = `/mypage/cnclExchRtrnHisList/exchange/${username}`;
      else url = `/mypage/cnclExchRtrnHisList/all/${username}`;

      // 백엔드 기간 필터 사용 (쿼리 파라미터)
      const params = {};
      if (draftStartDate) params.startDate = draftStartDate;
      if (draftEndDate) params.endDate = draftEndDate;

      const res = await axios.get(`http://localhost:8080${url}`, { params });

      if (type === "all") {
        const items = res.data?.items ?? [];
        const sorted = [...items].sort(
          (a, b) =>
            new Date(b.requestedAt ?? b.createdAt ?? 0) -
            new Date(a.requestedAt ?? a.createdAt ?? 0)
        );
        setHistoryList(sorted);
        return;
      }

      if (type === "cancel") setHistoryList(res.data?.cancels ?? []);
      else if (type === "return") setHistoryList(res.data?.returns ?? []);
      else if (type === "exchange") setHistoryList(res.data?.exchanges ?? []);
    } catch (e) {
      console.error("취소/반품/교환 내역 조회 실패:", e);
      setHistoryList([]);
    } finally {
      setLoading(false);
    }
  };

  // 기본 all 조회
  useEffect(() => {
    fetchHistory("all");
  }, []);

  const formatDate = (value) => {
    if (!value) return "-";
    return String(value).substring(0, 10).replaceAll("-", "/");
  };

  const STATUS_LABEL = {
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

  const toStatus = (raw) => {
    const key = String(raw ?? "").trim().toUpperCase();
    return STATUS_LABEL[key] ?? raw ?? "-";
  };

  // 탭 누르면 표시만 바뀌고, 실제 조회는 조회 버튼 눌러야 반영
  const isActive = (t) => draftHistoryType === t;

  // 버튼 클릭 시 이동
  const navigate = useNavigate();

  return (
    <>
      {/* 조회 조건 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          <div style={{ fontSize: "20px", fontWeight: "bold" }}>
            취소/반품/교환/환불 내역
          </div>
        </div>
      </div>

      {/* 조회 조건 */}
      <div style={styles.pageWrapper}>
        <div style={{ width: "860px" }}>
          <div style={styles.filterBox}>
            <div style={{ flex: 1 }}>
              <div style={{ marginBottom: "10px" }}>처리내역</div>
              <div style={{ marginBottom: "15px" }}>
                {["all", "cancel", "return", "exchange"].map((t) => (
                  <button
                    key={t}
                    style={isActive(t) ? styles.tabBtnActive : styles.tabBtn}
                    onClick={() => setDraftHistoryType(t)}
                    type="button"
                  >
                    {t === "all"
                      ? "전체"
                      : t === "cancel"
                      ? "취소"
                      : t === "return"
                      ? "반품"
                      : "교환"}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: "10px" }}>구매기간</div>
              <div style={{ marginBottom: "15px" }}>
                {[1, 3, 6, 12].map((m) => (
                  <button
                    key={m}
                    type="button"
                    style={draftPeriod === m ? styles.tabBtnActive : styles.tabBtn}
                    onClick={() => {
                      setDraftPeriod(m);
                      setPeriodMonths(m);
                    }}
                  >
                    {m}개월
                  </button>
              ))}
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <FormGroup style={{ margin: 0 }}>
                  <Input type="date" 
                        value={draftStartDate}
                        onChange={(e) => {
                          setDraftStartDate(e.target.value);
                          setDraftPeriod(null); // ⬅ 기간 버튼 선택 해제
                        }}
                  />
                </FormGroup>
                <span>~</span>
                <FormGroup style={{ margin: 0 }}>
                  <Input type="date" 
                          value={draftEndDate}
                          onChange={(e) => setDraftEndDate(e.target.value)}/>
                </FormGroup>
              </div>
            </div>

            {/* 조회 버튼 */}
                    <div style={{width: "120px", display: "flex",justifyContent: "center",alignItems: "center", padding:'0'}}>
                        <Button style={{padding: "10px 10px", backgroundColor: "#E7EBF3", border: "1px solid #ccc", borderRadius: "6px", fontSize:'12px', color:'black'}} 
                        onClick={onSearch}
                        disabled={loading}
                        >조회</Button>
                    </div>
          </div>
        </div>
      </div>

      {/* 테이블 */}
      <div style={styles.pageWrapper}>
        <div style={styles.container}>
          {/* 헤더 */}
          <div style={styles.tableHeader}>
            <div style={{ width: "10%" }}>접수일</div>
            <div style={{ width: "10%" }}>주문일</div>
            <div style={{ width: "15%" }}>주문번호</div>
            <div style={{ width: "30%" }}>상품정보</div>
            <div style={{ width: "5%" }}>수량</div>
            <div style={{ width: "10%" }}>가격</div>
            <div style={{ width: "10%" }}>상태</div>
            <div style={{ width: "10%" }}>상세</div>
          </div>

          {loading && (
            <div style={{ padding: "20px", textAlign: "center" }}>불러오는 중...</div>
          )}

          {!loading && historyList.length === 0 && (
            <div style={{ padding: "20px", textAlign: "center" }}>
              취소/반품/교환 내역이 없습니다.
            </div>
          )}

          {!loading &&
            historyList.map((item, idx) => {
              const statusText = toStatus(item.status);
              const requestedAt = item.requestedAt ?? item.createdAt;
              const orderAt = item.orderAt ?? item.orderDate ?? item.createdAt;
              const quantity = item.quantity ?? 1;
              
              // ========== 금액 관련 ==========
              // const priceText = Number(item.price ?? 0).toLocaleString();
              const getPriceText = (item) => {
                // 교환은 환불 금액 표시 안 함
                if (item.type === "교환") return "-";

                // 전체조회: price 사용
                if (item.price != null) {
                  return Number(item.price).toLocaleString();
                }

                // 취소 / 반품 개별조회: returnTotalPrice 사용
                if (item.returnTotalPrice != null) {
                  return Number(item.returnTotalPrice).toLocaleString();
                }

                return "-";
              };

              const orderNum = item.orderId ?? item.order?.id ?? "-";

              const key = `${item.requestId ?? item.id ?? idx}-${orderNum}`;

              return (
                <OrderItem
                  key={key}
                  thumbnailFileId={item.thumbnailFileId ?? item.thumbnail_file_id ?? item.thumbnailFile?.id}
                  requestedAt={formatDate(requestedAt)}
                  orderDate={formatDate(orderAt)}
                  orderNum={orderNum}
                  product={item.productName ?? "상품명 없음"}
                  options={
                  item.optionName
                    ? item.optionName.replace(/,\s*/g, " | ")
                    : "옵션 없음"
                  }
                  quantity={quantity}
                  price={getPriceText(item)}
                  status={statusText}
                  onDetailClick={() => {
                  // 1) 현재 row의 타입 결정 (all이면 item.type, 개별탭이면 draftHistoryType 기반)
                  const type =
                    draftHistoryType === "all"
                      ? item.type // "취소" | "반품" | "교환"
                      : draftHistoryType === "cancel"
                      ? "취소"
                      : draftHistoryType === "return"
                      ? "반품"
                      : "교환";

                  // 2) 상세 조회에 사용할 ID 결정
                  // - all: HistoryItemDto.requestId
                  // - 개별탭: Cancel/Return/ExchangeListDto.id
                  const detailId =
                    draftHistoryType === "all"
                      ? (item.requestId ?? item.id)
                      : (item.id ?? item.requestId);

                  if (!detailId) return;

                  // 3) 타입별 상세 페이지로 이동 (App.jsx)
                  if (type === "교환") navigate(`/mypage/exchangeDetail/${detailId}`);
                  else if (type === "반품") navigate(`/mypage/returnDetail/${detailId}`);
                  else if (type === "취소") navigate(`/mypage/cancelDetail/${detailId}`);
                }}
                />
              );
            })}
        </div>
      </div>
    </>
  );
}

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
  filterBox: {
    border: "1px solid #ddd",
    padding: "20px",
    display: "flex",
    justifyContent: "space-between",
    gap: "20px",
  },
  tabBtn: {
    padding: "6px 14px",
    marginRight: "8px",
    border: "1px solid #CCD1D8",
    borderRadius: "4px",
    backgroundColor: "#fff",
    cursor: "pointer",
    fontSize: "12px",
  },
  tabBtnActive: {
    padding: "6px 14px",
    marginRight: "8px",
    border: "1px solid #7693FC",
    borderRadius: "4px",
    backgroundColor: "#F2F9FC",
    cursor: "pointer",
    fontSize: "12px",
    color: "#7693FC",
  },
  searchBtnWrap: {
    width: "120px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  searchBtn: {
    padding: "10px",
    backgroundColor: "#E7EBF3",
    border: "1px solid #ccc",
    borderRadius: "6px",
    fontSize: "12px",
  },
  tableHeader: {
    display: "flex",
    backgroundColor: "#E7EBF3",
    padding: "12px 0",
    fontSize: "12px",
    fontWeight: "bold",
    textAlign: "center",
    borderTop: "1px solid #000",
    borderBottom: "1px solid #000",
  },
};
