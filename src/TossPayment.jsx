import { loadTossPayments } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "NWNmY8ZpgKTZUzoW8EKVJ";

export function CheckoutPage() {
  const location = useLocation();
  const {
    productId,
    orderId,
    amount: payAmount,
    productName,
    quantity,
    selectedOptions,
  } = location.state || {};

  if (!productId) {
    alert("상품 정보가 올바르게 전달되지 않았습니다.");
    return null;
  }

  const [amount, setAmount] = useState({
    currency: "KRW",
    value: payAmount,
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function init() {
      const tossPayments = await loadTossPayments(clientKey);
      const widgets = tossPayments.widgets({ customerKey });
      setWidgets(widgets);
    }
    init();
  }, []);

  useEffect(() => {
    if (!widgets) return;

    async function render() {
      await widgets.setAmount(amount);
      await Promise.all([
        widgets.renderPaymentMethods({
          selector: "#payment-method",
          variantKey: "DEFAULT",
        }),
        widgets.renderAgreement({
          selector: "#agreement",
          variantKey: "AGREEMENT",
        }),
      ]);
      setReady(true);
    }
    render();
  }, [widgets]);

  return (
    <div style={styles.page}>
      <div style={styles.wrapper}>
        {/* 왼쪽: 주문 요약 */}
        <div style={styles.summary}>
          <h3 style={styles.sectionTitle}>주문 상품 정보</h3>

          <div style={styles.summaryRow}>
            <span>상품명</span>
            <strong>{productName}</strong>
          </div>

          <div style={styles.summaryRow}>
            <span>수량</span>
            <strong>{quantity}개</strong>
          </div>

          <div style={styles.summaryRow}>
            <span>선택 옵션</span>
            <strong>
              {selectedOptions.map(opt => `${opt.groupName}: ${opt.optionName}`).join(", ")}
            </strong>
          </div>

          <hr style={styles.divider} />

          <div style={styles.totalRow}>
            <span>총 결제 금액</span>
            <strong>{payAmount.toLocaleString()}원</strong>
          </div>
        </div>

        {/* 오른쪽: 결제 */}
        <div style={styles.payment}>
          <h3 style={styles.sectionTitle}>결제 수단 선택</h3>

          <div id="payment-method" />
          <div id="agreement" />

          <button
            disabled={!ready}
            style={{
              ...styles.payButton,
              ...(ready ? {} : styles.disabledButton),
            }}
            onClick={async () => {
              await widgets.requestPayment({
                orderId,
                orderName: productName,
                successUrl: `${window.location.origin}/paycomplete?orderId=${orderId}&productId=${productId}`,
                failUrl: window.location.origin + "/fail",
                customerName: "Global Buyer",
                customerEmail: "buyer@email.com",
              });
            }}
          >
            {payAmount.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* =====================
   🌍 GLOBAL PURCHASE STYLE
===================== */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F2F4F7",
    padding: "40px 0",
  },
  wrapper: {
    maxWidth: "1100px",
    margin: "0 auto",
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "40px",
    padding: "0 20px",
  },
  summary: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
  },
  payment: {
    background: "#FFFFFF",
    padding: "24px",
    borderRadius: "8px",
    border: "1px solid #E5E7EB",
  },
  sectionTitle: {
    fontSize: "18px",
    fontWeight: "700",
    marginBottom: "16px",
  },
  summaryRow: {
    display: "flex",
    justifyContent: "space-between",
    marginBottom: "12px",
    fontSize: "14px",
    color: "#374151",
  },
  divider: {
    margin: "16px 0",
    border: "none",
    borderTop: "1px solid #E5E7EB",
  },
  totalRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "16px",
    fontWeight: "700",
  },
  payButton: {
    marginTop: "24px",
    width: "100%",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#FFFFFF",
    backgroundColor: "#111827",
    border: "none",
    cursor: "pointer",
  },
  disabledButton: {
    backgroundColor: "#9CA3AF",
    cursor: "not-allowed",
  },
};
