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
    <div className="wrapper">
      <div className="box_section">
        <div id="payment-method" />
        <div id="agreement" />
        <button
          disabled={!ready}
          onClick={async () => {
            try {
              await widgets.requestPayment({
                orderId: orderId,
                // productId : productId,
                orderName: productName || "상품 결제",
                // successUrl: window.location.origin + "/paycomplate", // ✅ :id 제거
                // successUrl: `${window.location.origin}/paycomplete?orderId=${orderId}&productId=${productId}&amount=${payAmount}`,
                successUrl: `${window.location.origin}/paycomplete?orderId=${orderId}&productId=${productId}&amount=${payAmount}`,
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
          결제하기
        </button>
      </div>
    </div>
  );
}
