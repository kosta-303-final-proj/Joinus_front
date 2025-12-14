import { loadTossPayments, ANONYMOUS } from "@tosspayments/tosspayments-sdk";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

const clientKey = "test_gck_docs_Ovk5rk1EwkEbP0W43n07xlzm";
const customerKey = "NWNmY8ZpgKTZUzoW8EKVJ";

export function CheckoutPage() {
  // ✅ Pay.jsx에서 전달한 값 받기
  const location = useLocation();
  const { amount: payAmount, productName } = location.state || {};

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

        {/* <div>
          <label htmlFor="coupon-box">
            <input
              id="coupon-box"
              type="checkbox"
              disabled={!ready}
              onChange={(e) => {
                setAmount({
                  ...amount,
                  value: e.target.checked
                    ? amount.value - 5_000
                    : amount.value + 5_000,
                });
              }}
            />
            <span>5,000원 쿠폰 적용</span>
          </label>
        </div> */}

        <button
          disabled={!ready}
          onClick={async () => {
            try {
              await widgets.requestPayment({
                orderId: "ORDER_" + Date.now(),        // ✅ 고정값 제거
                orderName: productName || "상품 결제", // ✅ Pay에서 받은 값
                successUrl: window.location.origin + "/success",
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
