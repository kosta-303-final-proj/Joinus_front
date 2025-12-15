import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiFetch } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import './Dashboard.css';

export default function Dashboard() {
  const navigate = useNavigate();
  const [dashboardData, setDashboardData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 숫자 포맷팅 함수
  const formatCurrency = (amount) => {
    if (amount === null || amount === undefined) return '₩ 0';
    return `₩ ${amount.toLocaleString()}`;
  };

  const formatChangeRate = (rate) => {
    if (rate === null || rate === undefined) return '';
    const sign = rate >= 0 ? '+' : '';
    return `${sign}${rate.toFixed(1)}%`;
  };

  // 대시보드 데이터 로드
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        const response = await apiFetch('/api/admin/dashboard');
        if (!response.ok) {
          throw new Error('대시보드 데이터 조회 실패');
        }
        const data = await response.json();
        setDashboardData(data);
      } catch (error) {
        console.error('대시보드 데이터 조회 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (isLoading) {
    return (
      <div className="dashboard-page">
        <div className="loading">로딩 중...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="dashboard-page">
        <div className="error">데이터를 불러올 수 없습니다.</div>
      </div>
    );
  }

  const { stats, topProposals, pendingPayments, ongoingGroupBuys } = dashboardData;

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="대시보드" />
        <div className="content-area">
    <div className="dashboard-page">
      {/* 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">대시보드</h1>
          <p className="page-description">
            오늘/이번 주 매출, 진행 중 공구 현황을 한 눈에 확인합니다.
          </p>
        </div>
        <div className="header-date">
          {/* Date는 내장 객체이므로 별도 import 없이 사용 */}
          오늘 기준: {new Date().toISOString().slice(0, 10)}
        </div>
      </div>

      {/* 통계 카드 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-label">이번주 매출</div>
          <div className="stat-value">{formatCurrency(stats?.weeklyRevenue || 0)}</div>
          <div className="stat-note">
            오늘 매출: {formatCurrency(stats?.todayRevenue || 0)} 
            {stats?.revenueChangeRate !== null && stats?.revenueChangeRate !== undefined && (
              ` (어제 대비 ${formatChangeRate(stats.revenueChangeRate)})`
            )}
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-label">진행 중 공구 수</div>
          <div className="stat-value">{stats?.ongoingGroupBuyCount || 0}건</div>
          <div className="stat-note">마감 임박: {stats?.deadlineSoonCount || 0}건</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">주문 대기 건수</div>
          <div className="stat-value">{stats?.pendingOrderCount || 0}건</div>
          <div className="stat-note">처리 필요</div>
        </div>
      </div>

      {/* 제안상품 탑 3 & 결제 대기 공구상품 */}
      <div className="content-row">
        <div className="content-card">
          <h2 className="card-title">제안상품 탑 3</h2>
          <div className="proposal-list">
            {topProposals && topProposals.length > 0 ? (
              topProposals.map((item) => (
                <div key={item.id} className="proposal-item">
                  <div className="proposal-info">
                    <div className="proposal-name">{item.name}</div>
                    <div className="proposal-votes">투표수: {item.votes}개</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="no-data">제안상품이 없습니다.</div>
            )}
          </div>
        </div>

        <div className="content-card">
          <div className="card-header">
            <div className="d-flex flex-row justify-content-between">
              <h2 className="card-title">주문 대기 공구상품 건</h2>
              <div className="payment-list">
                <a
                  href="/admin/pendingPayment"
                  className="card-more-link"
                  onClick={(e) => {
                    e.preventDefault();
                    navigate('/admin/pendingPayment');
                  }}
                >
                  더 보기 &gt;
                </a>
              </div>
            </div>

            <div className="payment-list">
              {pendingPayments && pendingPayments.length > 0 ? (
                pendingPayments.map((item, index) => (
                  <div key={item.gbProductId || index} className="payment-item">
                    <div className="payment-info">
                      <div className="payment-name">{item.name}</div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="no-data">주문 대기 공구상품이 없습니다.</div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 진행 중 공구 목록 */}
      <div className="list-section">
        <div className="list-header">
          <h2 className="list-title">진행 중 공구 목록</h2>
          <a
            href="/admin/statistics"
            className="list-link"
            onClick={(e) => {
              e.preventDefault();
              navigate('/admin/statistics');
            }}
          >
            전체 공구 통계 보기
          </a>
        </div>
        <div className="table-container">
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>공구 ID</th>
                <th>상품명</th>
                <th>참여수 / 최소 인원수</th>
                <th>마감까지</th>
              </tr>
            </thead>
            <tbody>
              {ongoingGroupBuys && ongoingGroupBuys.length > 0 ? (
                ongoingGroupBuys.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{item.participants} / {item.minParticipants}</td>
                    <td>{item.deadline}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="no-data">진행 중인 공구가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}

