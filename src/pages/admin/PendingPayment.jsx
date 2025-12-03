import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './PendingPayment.css';

export default function PendingPayment() {
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 더미 데이터 (백엔드 연동 전까지)
  const dummyPayments = [
    { 
      id: 1, 
      groupBuyId: 'GG-1024',
      name: '친환경 텀블러 500ml', 
      count: 5,
      totalAmount: '₩ 375,000',
      deadline: '2025-01-20',
      status: '결제 대기'
    },
    { 
      id: 2, 
      groupBuyId: 'GG-1025',
      name: '해외 직구 커피머신', 
      count: 3,
      totalAmount: '₩ 1,980,000',
      deadline: '2025-01-22',
      status: '결제 대기'
    },
    { 
      id: 3, 
      groupBuyId: 'GG-1026',
      name: '유기농 식물성 샴푸 세트', 
      count: 2,
      totalAmount: '₩ 89,000',
      deadline: '2025-01-25',
      status: '결제 대기'
    },
  ];

  useEffect(() => {
    const fetchPendingPayments = async () => {
      setIsLoading(true);
      try {
        // TODO: 백엔드 연동 시 아래 주석 해제하고 실제 API 호출
        // const baseUrl = 'http://localhost:8080';
        // const response = await fetch(`${baseUrl}/admin/pending-payments`);
        // const data = await response.json();
        // setPendingPayments(data.items || []);

        // 임시: 더미 데이터 사용
        setPendingPayments(dummyPayments);
      } catch (error) {
        console.error('결제 대기 목록 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

  const handleDetailClick = (id) => {
    // TODO: 상세 페이지로 이동
    navigate(`/admin/pending-payment/${id}`);
  };

  return (
    <div className="pending-payment-page">
      {/* 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">주문 대기 공구상품 건</h1>
          <p className="page-description">
            주문 대기 중인 공구상품 목록을 확인하고 관리합니다.
          </p>
        </div>
      </div>

      {/* 목록 테이블 */}
      <div className="list-section">
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : (
          <div className="table-container">
            <table className="pending-payment-table">
              <thead>
                <tr>
                  <th>공구 ID</th>
                  <th>상품명</th>
                  <th>결제 대기 건수</th>
                  <th>총 결제 금액</th>
                  <th>마감일</th>
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="no-data"> 
                      주문 대기 중인 공구상품이 없습니다.
                    </td>
                  </tr>
                ) : (
                  pendingPayments.map((item) => (
                    <tr key={item.id}>
                      <td>{item.groupBuyId}</td>
                      <td className="product-name">{item.name}</td>
                      <td>{item.count}건</td>
                      <td>{item.totalAmount}</td>
                      <td>{item.deadline}</td>
                      <td>
                        <button
                          className="detail-button"
                          onClick={() => handleDetailClick(item.id)}
                        >
                          상세보기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}