import React, { useState, useEffect } from "react";
import { Button, FormGroup, Input } from "reactstrap";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.min.css";
import OrderItem from "./OrderItem";

export default function CnclExchRtrnHisList() {
  const [historyType, setHistoryType] = useState("all");
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(false);

  const username = "kakao_4633814946";

  const fetchHistory = async (type) => {
    setLoading(true);
    try {
      let url = "";

      if (type === "cancel") url = `/mypage/cnclExchRtrnHisList/cancel/${username}`;
      else if (type === "return") url = `/mypage/cnclExchRtrnHisList/return/${username}`;
      else if (type === "exchange") url = `/mypage/cnclExchRtrnHisList/exchange/${username}`;
      else url = `/mypage/cnclExchRtrnHisList/all/${username}`;

      const res = await axios.get(`http://localhost:8080${url}`);

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

  useEffect(() => {
    fetchHistory(historyType);
  }, [historyType]);

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

  const isActive = (t) => historyType === t;

  return (
    <>
      {/* 제목 */}
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
                    onClick={() => setHistoryType(t)}
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
                <button style={styles.periodBtn}>1개월</button>
                <button style={styles.periodBtn}>3개월</button>
                <button style={styles.periodBtn}>6개월</button>
                <button style={styles.periodBtn}>12개월</button>
              </div>

              <div style={{ display: "flex", gap: "20px" }}>
                <FormGroup style={{ margin: 0 }}>
                  <Input type="date" />
                </FormGroup>
                <span>~</span>
                <FormGroup style={{ margin: 0 }}>
                  <Input type="date" />
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
  periodBtn: {
    padding: "6px 14px",
    marginRight: "8px",
    border: "1px solid #CCD1D8",
    borderRadius: "4px",
    backgroundColor: "#F5F6F8",
    cursor: "pointer",
    fontSize: "12px",
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
