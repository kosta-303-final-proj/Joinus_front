// import { useEffect, useRef } from "react";
// import { useNavigate, useSearchParams, useLocation } from "react-router-dom";
// import { myAxios } from "./config";

// export function SuccessPage() {
//   const didRun = useRef(false); // ✅ StrictMode 방어
//   const navigate = useNavigate();
//   const location = useLocation(); // CheckoutPage에서 전달받은 state
//   const [searchParams] = useSearchParams();

//   const orderId = searchParams.get("orderId");
//   const paymentKey = searchParams.get("paymentKey");

//   useEffect(() => {
//     if (didRun.current) return;
//     didRun.current = true;

//     async function confirmPayment() {
//       try {
//         // 서버에 orderId로 조회 후 금액 검증
//         const response = await myAxios().post("/payments/confirm", {
//           paymentKey,
//           orderId,
//           method: "CARD",
//           status: "PAID",
//           approvedAt: new Date().toISOString(),
//         });

//         console.log("결제 성공:", response.data);

//         // ✅ 결제 확인 후 /payCompleteSuccess로 이동
//         navigate("/payCompleteSuccess", {
//           state: {
//             orderId,
//             productId: location.state?.productId || null,
//           },
//         });
//       } catch (error) {
//         console.error("결제 확인 에러:", error);
//         navigate(`/fail?message=${error.message}`);
//       }
//     }

//     confirmPayment();
//   }, [navigate, location.state, orderId, paymentKey]);

//   return (
//     <div>
//       <h1>결제 완료</h1>
//       {orderId && <p>주문 번호: {orderId}</p>}
//     </div>
//   );
// }