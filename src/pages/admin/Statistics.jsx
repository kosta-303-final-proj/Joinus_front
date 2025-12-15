// final_project/src/pages/admin/Statistics.jsx

import { useState, useEffect } from 'react';
import { apiFetch } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import './Statistics.css';

export default function Statistics() {
  const [startMonth, setStartMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [endMonth, setEndMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });
  const [unit, setUnit] = useState('일'); // 일/주/월
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // API 데이터 상태
  const [statisticsData, setStatisticsData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // API 호출 함수
  const fetchStatistics = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams({
        startMonth,
        endMonth,
        unit
      });
      const response = await apiFetch(`/api/admin/statistics?${params}`);
      if (!response.ok) {
        throw new Error('통계 데이터 조회 실패');
      }
      const data = await response.json();
      setStatisticsData(data);
      setCurrentPage(1); // 데이터 변경 시 첫 페이지로
    } catch (err) {
      console.error('통계 데이터 조회 실패:', err);
      setError('데이터를 불러올 수 없습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 초기 로드 및 필터 변경 시 API 호출
  useEffect(() => {
    fetchStatistics();
  }, [unit]); // unit 변경 시 자동 재조회

  // 조회 버튼 클릭 핸들러
  const handleSearch = () => {
    fetchStatistics();
  };

  // 단위 변경 핸들러
  const handleUnitChange = (newUnit) => {
    setUnit(newUnit);
    // useEffect에서 자동으로 재조회됨
  };

  // 데이터 추출 (null 체크 포함)
  const monthlyRevenue = statisticsData?.monthlyRevenue || [];
  const summary = statisticsData?.summary || {
    totalRevenue: 0,
    totalOrders: 0,
    netProfit: 0
  };
  const allSalesDetails = statisticsData?.salesDetails || [];

  // 페이지네이션 계산
  const totalPages = Math.ceil(allSalesDetails.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const salesDetails = allSalesDetails.slice(startIndex, endIndex);

  // 도넛 차트 계산 (매출별)
  const totalRevenueForChart = monthlyRevenue.length > 0 
    ? monthlyRevenue.reduce((sum, m) => sum + (m.revenue || 0), 0) 
    : 1;
  const revenueChartData = monthlyRevenue.map((item, index) => {
    const percentage = totalRevenueForChart > 0 ? (item.revenue / totalRevenueForChart) * 100 : 0;
    const offset = monthlyRevenue.slice(0, index).reduce((sum, m) => sum + ((m.revenue || 0) / totalRevenueForChart) * 100, 0);
    return {
      ...item,
      percentage,
      offset
    };
  });

  // 도넛 차트 계산 (순익별)
  const totalProfitForChart = monthlyRevenue.length > 0
    ? monthlyRevenue.reduce((sum, m) => sum + (m.profit || 0), 0)
    : 1;
  const profitChartData = monthlyRevenue.map((item, index) => {
    const percentage = totalProfitForChart > 0 ? (item.profit / totalProfitForChart) * 100 : 0;
    const offset = monthlyRevenue.slice(0, index).reduce((sum, m) => sum + ((m.profit || 0) / totalProfitForChart) * 100, 0);
    return {
      ...item,
      percentage,
      offset
    };
  });

  const formatCurrency = (amount) => {
    return `₩ ${amount.toLocaleString()}`;
  };

  const DonutChart = ({ data, title, colorScheme, valueKey }) => {
    const radius = 70;
    const circumference = 2 * Math.PI * radius;
    const centerX = 100;
    const centerY = 100;
    
    // 누적 각도 계산
    let currentOffset = 0;
    const segments = data.map((item, index) => {
      const percentage = item.percentage;
      const segmentLength = (percentage / 100) * circumference;
      const offset = currentOffset;
      currentOffset += segmentLength;
      
      return {
        ...item,
        segmentLength,
        offset,
        color: colorScheme[index % colorScheme.length]
      };
    });
    
    return (
      <div className="donut-chart-container">
        <h3 className="chart-title">{title}</h3>
        <div className="donut-chart-wrapper">
          <svg width="200" height="200" viewBox="0 0 200 200" className="donut-svg">
            {segments.map((segment, index) => (
              <circle
                key={index}
                cx={centerX}
                cy={centerY}
                r={radius}
                fill="none"
                stroke={segment.color}
                strokeWidth="35"
                strokeDasharray={`${segment.segmentLength} ${circumference}`}
                strokeDashoffset={-segment.offset}
                transform={`rotate(-90 ${centerX} ${centerY})`}
                className="donut-segment"
              />
            ))}
            {/* 중앙 텍스트 */}
            <text
              x={centerX}
              y={centerY - 5}
              textAnchor="middle"
              className="donut-center-text"
              fontSize="14"
              fill="#333"
              fontWeight="600"
            >
              {title}
            </text>
            <text
              x={centerX}
              y={centerY + 15}
              textAnchor="middle"
              className="donut-center-value"
              fontSize="12"
              fill="#666"
            >
              총 {formatCurrency(data.reduce((sum, item) => sum + (item[valueKey] || 0), 0))}
            </text>
          </svg>
          <div className="chart-legend">
            {data.map((item, index) => (
              <div key={index} className="legend-item">
                <span className="legend-color" style={{ backgroundColor: colorScheme[index % colorScheme.length] }}></span>
                <span className="legend-text">
                  <strong>{item.month}</strong>: {formatCurrency(item[valueKey] || 0)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  };

  // 로딩 상태
  if (isLoading && !statisticsData) {
    return (
      <div className="statistics-page">
        <div className="loading" style={{ padding: '2rem', textAlign: 'center' }}>로딩 중...</div>
      </div>
    );
  }

  // 에러 상태
  if (error && !statisticsData) {
    return (
      <div className="statistics-page">
        <div className="error" style={{ padding: '2rem', textAlign: 'center', color: 'red' }}>{error}</div>
      </div>
    );
  }

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="매출 통계" />
        <div className="content-area">
    <div className="statistics-page">
      {/* 헤더 */}
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">매출 통계</h1>
          <p className="page-description">
            월별 기간을 기준으로 매출을 확인하고, 수수료 및 정산 금액을 조회합니다.
          </p>
        </div>
        <div className="header-date">
          기준일: {new Date().toISOString().slice(0, 10)}
        </div>
      </div>

      {/* 조회월 필터 */}
      <div className="filter-section">
        <div className="filter-row">
          <label className="filter-label">조회 월</label>
            <div className="month-range">
              <input
                type="month"
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
              />
              <span className="month-separator">~</span>
              <input
                type="month"
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
            />
            </div>
            <span className="filter-note">(최대 6개월 조회)</span>
            <button className="search-button" onClick={handleSearch} disabled={isLoading}>
            {isLoading ? '조회 중...' : '조회'}
          </button>
        </div>
      </div>

      {/* 기간별 매출 그래프 (도넛 차트) */}
      {monthlyRevenue.length > 0 && (
        <div className="chart-section">
          <div className="chart-header">
            <h2 className="section-title">기간별 매출 그래프</h2>
            <span className="chart-unit">단위: 월별</span>
          </div>
          <div className="donut-charts-container">
            <DonutChart
              data={revenueChartData}
              title="매출별"
              colorScheme={['#3b82f6', '#8b5cf6', '#ec4899']}
              valueKey="revenue"
            />
            <DonutChart
              data={profitChartData}
              title="순익별"
              colorScheme={['#10b981', '#f59e0b', '#ef4444']}
              valueKey="profit"
            />
          </div>
          <p className="formula-note">
            매출액 = (배송비 제외) 구매가 - 포인트 + 수수료 5%
          </p>
        </div>
      )}

      {/* 요약 지표 */}
      <div className="stats-section">
        <div className="stat-card">
          <div className="stat-label">총 매출액</div>
          <div className="stat-value">{formatCurrency(summary.totalRevenue)}</div>
          <div className="stat-note">(선택한 기간 전체 (배송비 제외))</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">총 주문 수</div>
          <div className="stat-value">{summary.totalOrders}건</div>
          <div className="stat-note">(취소 제외 확정 주문만 집계)</div>
        </div>
        <div className="stat-card">
          <div className="stat-label">순이익</div>
          <div className="stat-value">{formatCurrency(summary.netProfit)}</div>
          <div className="stat-note">(매출액의 5% 기준)</div>
        </div>
      </div>

      {/* 매출 상세 */}
      <div className="details-section">
        <div className="statistics-section-header">
          <h2 className="section-title">매출 상세</h2>
        </div>
        <div className="unit-selector">
          <p className="unit-note">단위 선택에 따라 일/주/월 데이터를 조회합니다.</p>
          <div className="unit-buttons">
            <button
              className={`unit-btn ${unit === '일' ? 'active' : ''}`}
              onClick={() => handleUnitChange('일')}
              disabled={isLoading}
            >
              일
            </button>
            <button
              className={`unit-btn ${unit === '주' ? 'active' : ''}`}
              onClick={() => handleUnitChange('주')}
              disabled={isLoading}
            >
              주
            </button>
            <button
              className={`unit-btn ${unit === '월' ? 'active' : ''}`}
              onClick={() => handleUnitChange('월')}
              disabled={isLoading}
            >
              월
            </button>
          </div>
        </div>
        <div className="table-container">
          <table className="sales-table">
            <thead>
              <tr>
                <th>날짜</th>
                <th>주문 수</th>
                <th>구매가 합계</th>
                <th>포인트 사용</th>
                <th>수수료 (5%)</th>
                <th>매출액</th>
                <th>정산 예정 금액</th>
              </tr>
            </thead>
            <tbody>
              {salesDetails.length === 0 ? (
                <tr>
                  <td colSpan="7" className="no-data">데이터가 없습니다.</td>
                </tr>
              ) : (
                salesDetails.map((item, index) => (
                  <tr key={index}>
                    <td className="date-cell">{item.date}</td>
                    <td className="number-cell">{item.orders}</td>
                    <td className="number-cell">{formatCurrency(item.purchasePrice)}</td>
                    <td className="number-cell">{formatCurrency(item.pointsUsed)}</td>
                    <td className="number-cell">{formatCurrency(item.commission)}</td>
                    <td className="number-cell sales-amount">{formatCurrency(item.salesAmount)}</td>
                    <td className="number-cell settlement-amount">{formatCurrency(item.settlementAmount)}</td>
                  </tr>
                ))
              )}
            </tbody>
            {allSalesDetails.length > 0 && (
              <tfoot>
                <tr className="table-total">
                  <td className="total-label">합계</td>
                  <td className="number-cell">{allSalesDetails.reduce((sum, item) => sum + (item.orders || 0), 0)}</td>
                  <td className="number-cell">{formatCurrency(allSalesDetails.reduce((sum, item) => sum + (item.purchasePrice || 0), 0))}</td>
                  <td className="number-cell">{formatCurrency(allSalesDetails.reduce((sum, item) => sum + (item.pointsUsed || 0), 0))}</td>
                  <td className="number-cell">{formatCurrency(allSalesDetails.reduce((sum, item) => sum + (item.commission || 0), 0))}</td>
                  <td className="number-cell sales-amount">{formatCurrency(allSalesDetails.reduce((sum, item) => sum + (item.salesAmount || 0), 0))}</td>
                  <td className="number-cell settlement-amount">{formatCurrency(allSalesDetails.reduce((sum, item) => sum + (item.settlementAmount || 0), 0))}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
        <div className="table-notes">
          <p>정산 완료된 금액은 정산내역 화면에서 별도로 관리됩니다.</p>
          <p>취소/환불 주문은 매출집계에서 제외하거나, 별도 컬럼으로 분리할 수 있습니다.</p>
        </div>

        {/* 페이지네이션 */}
        {totalPages > 0 && (
          <div className="pagination">
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
            >
              이전
            </button>
            <div className="pagination-numbers">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <button
                  key={page}
                  className={`pagination-number ${currentPage === page ? 'active' : ''}`}
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </button>
              ))}
            </div>
            <button
              className="pagination-button"
              onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
              disabled={currentPage === totalPages}
            >
              다음
            </button>
          </div>
        )}
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}