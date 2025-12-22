import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "NWNmY8ZpgKTZUzoW8EKVJ";

export function CheckoutPage() {
  // ✅ Pay.jsx에서 전달한 값 받기
  const location = useLocation();
  const { productId } = location.state || {};
  if (!productId) {
    alert("상품 정보가 올바르게 전달되지 않았습니다.");
    return null;
  }
  const { orderId, amount: payAmount, productName, quantity, selectedOptions } = location.state || {};
  const [amount, setAmount] = useState({
    currency: "KRW",
    value: payAmount || 0,   // ✅ 하드코딩 제거
  });
  const [ready, setReady] = useState(false);
  const [widgets, setWidgets] = useState(null);

  useEffect(() => {
    async function fetchPaymentWidgets() {
      const tossPayments = await loadTossPayments(clientKey);

      const widgets = tossPayments.widgets({
        customerKey,
      });

      setWidgets(widgets);
    }

    fetchPaymentWidgets();
  }, []);

  useEffect(() => {
    async function renderPaymentWidgets() {
      if (widgets == null) return;

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

    renderPaymentWidgets();
  }, [widgets]);

  useEffect(() => {
    if (widgets == null) return;
    widgets.setAmount(amount);
  }, [widgets, amount]);

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h2 style={styles.title}>결제하기</h2>

        <div style={styles.card}>
          <div id="payment-method" />
          <div id="agreement" />

          <button
            disabled={!ready}
            style={{
              ...styles.payButton,
              ...(ready ? {} : styles.disabledButton),
            }}
            onClick={async () => {
              try {
                await widgets.requestPayment({
                  orderId: orderId,
                  orderName: productName || "상품 결제",
                  successUrl: `${window.location.origin}/paycomplete?orderId=${orderId}&productId=${productId}&amount=${payAmount}&quantity=${quantity}&selectedOptions=${encodeURIComponent(JSON.stringify(selectedOptions))}`,
                  failUrl: window.location.origin + "/fail",
                  customerEmail: "customer123@gmail.com",
                  customerName: "김토스",
                  customerMobilePhone: "01012341234",
                });
              } catch (error) {
                console.error(error);
              }
            }}
          >
            {payAmount.toLocaleString()}원 결제하기
          </button>
        </div>
      </div>
    </div>
  );
}

/* ===========================
   🎨 STYLE OBJECT
=========================== */

const styles = {
  page: {
    minHeight: "100vh",
    backgroundColor: "#F5F7FA",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "100%",
    maxWidth: "420px",
    padding: "20px",
  },
  title: {
    textAlign: "center",
    fontSize: "22px",
    fontWeight: "700",
    marginBottom: "20px",
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: "16px",
    padding: "20px",
    boxShadow: "0 10px 30px rgba(0, 0, 0, 0.08)",
  },
  payButton: {
    width: "100%",
    marginTop: "24px",
    padding: "14px",
    fontSize: "16px",
    fontWeight: "700",
    color: "#FFFFFF",
    backgroundColor: "#0064FF",
    border: "none",
    borderRadius: "12px",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  disabledButton: {
    backgroundColor: "#AAB6FF",
    cursor: "not-allowed",
  },
};