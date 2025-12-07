import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../config';
import './PendingPayment.css';

export default function PendingPayment() {
  const navigate = useNavigate();
  const [pendingPayments, setPendingPayments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // 금액 포맷팅 함수
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₩ 0';
    return `₩ ${amount.toLocaleString()}`;
  };

  useEffect(() => {
    const fetchPendingPayments = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiFetch('/api/admin/pendingPayment');
        if (!response.ok) {
          throw new Error('결제 대기 목록 조회 실패');
        }
        const data = await response.json();
        
        // 백엔드 응답 데이터를 화면 표시 형식으로 매핑
        const mappedData = data.map((item) => ({
          gbProductId: item.gbProductId,
          groupBuyId: item.gbProductId, // 화면 표시용
          name: item.name,
          count: item.count,
          totalAmount: item.totalAmount, // 숫자 형태로 저장
          deadline: item.deadline
        }));
        
        setPendingPayments(mappedData);
      } catch (error) {
        console.error('결제 대기 목록 조회 실패:', error);
        // 연결 오류인 경우 더 명확한 메시지 표시
        if (error.message.includes('Failed to fetch') || error.message.includes('ERR_CONNECTION_REFUSED')) {
          setError('백엔드 서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요.');
        } else {
          setError('데이터를 불러올 수 없습니다.');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchPendingPayments();
  }, []);

  const handleDetailClick = (gbProductId) => {
    // TODO: 상세 페이지로 이동
    navigate(`/admin/pending-payment/${gbProductId}`);
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
        ) : error ? (
          <div className="loading" style={{ color: '#d32f2f' }}>{error}</div>
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
                    <tr key={item.gbProductId}>
                      <td>{item.groupBuyId}</td>
                      <td className="product-name">{item.name}</td>
                      <td>{item.count}건</td>
                      <td>{formatCurrency(item.totalAmount)}</td>
                      <td>{item.deadline}</td>
                      <td>
                        <button
                          className="detail-button"
                          onClick={() => handleDetailClick(item.gbProductId)}
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