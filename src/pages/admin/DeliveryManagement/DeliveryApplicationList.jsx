import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicationList } from '../../../services/supplyApi';
import './DeliveryApplicationList.css';

const FILTERS = ['전체', '신청', '승인', '반려'];

// 날짜 포맷팅 함수
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DeliveryApplicationList() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApplicationList(filter);
        setApplications(data || []);
      } catch (err) {
        console.error('신청 목록 조회 실패:', err);
        setError('데이터를 불러올 수 없습니다.');
        setApplications([]);
      } finally {
        setIsLoading(false);
      }
    };

    load();
  }, [filter]);

  const handleDetailClick = (id) => {
    navigate(`/admin/suppliy/application/${id}`);
  };

  // 상태별 통계 계산
  const summary = useMemo(() => {
    const stats = { 신청: 0, 승인: 0, 반려: 0 };
    applications.forEach((app) => {
      if (stats.hasOwnProperty(app.status)) {
        stats[app.status]++;
      }
    });
    return stats;
  }, [applications]);

  return (
    <div className="delivery-application-list-page">
      <div className="page-header">
        <div className="header-content">
          <h1 className="page-title">납품 업체 신청 목록</h1>
          <p className="page-description">
            납품 신청을 검토하고 승인/반려를 처리합니다.
          </p>
        </div>
        <div className="summary-chip-wrapper">
          {Object.entries(summary).map(([key, value]) => (
            <span key={key} className="summary-chip">
              {key} {value}건
            </span>
          ))}
        </div>
      </div>

      <div className="filter-section">
        <div className="filter-buttons">
          {FILTERS.map((item) => (
            <button
              key={item}
              className={`filter-btn ${filter === item ? 'active' : ''}`}
              onClick={() => setFilter(item)}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="list-section">
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <div className="table-container">
            <table className="application-table">
              <thead>
                <tr>
                  <th>업체명</th>
                  <th>사업자 번호</th>
                  <th>담당자</th>
                  <th>이메일</th>
                  <th>연락처</th>
                  <th>카테고리</th>
                  <th>신청일</th>
                  <th>상태</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="no-data">
                      신청 내역이 없습니다.
                    </td>
                  </tr>
                ) : (
                  applications.map((item) => (
                    <tr key={item.id}>
                      <td className="company-name">
                        <button
                          type="button"
                          className="link-button"
                          onClick={() => handleDetailClick(item.id)}
                        >
                          {item.companyName}
                        </button>
                      </td>
                      <td>{item.businessNumber || '-'}</td>
                      <td>{item.manager}</td>
                      <td>{item.email || '-'}</td>
                      <td>{item.phone}</td>
                      <td>{item.category || '-'}</td>
                      <td>{formatDate(item.appliedDate)}</td>
                      <td>
                        <span
                          className={`status-badge ${
                            item.status === '승인'
                              ? 'approved'
                              : item.status === '반려'
                              ? 'rejected'
                              : 'pending'
                          }`}
                        >
                          {item.status}
                        </span>
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