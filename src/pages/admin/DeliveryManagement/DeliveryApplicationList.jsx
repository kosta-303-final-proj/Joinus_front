import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { getApplicationList } from '../../../services/supplyApi';
import AdminHeader from '../../../components/layout/AdminHeader';
import './DeliveryApplicationList.css';

const FILTERS = ['전체', '신청', '승인', '반려'];

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
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="납품신청업체" />
        <div className="content-area">
          <div className="applying-supplier-page">
            <div className="applying-supplier-header">
              <div className="applying-supplier-header-content">
                <h1 className="applying-supplier-title">납품 업체 신청 목록</h1>
                <p className="applying-supplier-description">
                  납품 신청을 검토하고 승인/반려를 처리합니다.
                </p>
              </div>
              <div className="applying-supplier-summary">
                {Object.entries(summary).map(([key, value]) => (
                  <span key={key} className="applying-supplier-chip">
                    {key} {value}건
                  </span>
                ))}
              </div>
            </div>

            <div className="applying-supplier-filter">
              <div className="applying-supplier-filter-buttons">
                {FILTERS.map((item) => (
                  <button
                    key={item}
                    className={`applying-supplier-filter-btn ${filter === item ? 'active' : ''}`}
                    onClick={() => setFilter(item)}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>

            <div className="applying-supplier-list">
              {isLoading ? (
                <div className="applying-supplier-loading">로딩 중...</div>
              ) : error ? (
                <div className="applying-supplier-error">{error}</div>
              ) : (
                <div className="applying-supplier-table-container">
                  <table className="applying-supplier-table">
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
                          <td colSpan="8" className="applying-supplier-no-data">
                            신청 내역이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        applications.map((item) => (
                          <tr key={item.id}>
                            <td className="applying-supplier-company-name">
                              <button
                                type="button"
                                className="applying-supplier-link-button"
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
                                className={`applying-supplier-status-badge ${
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
        </div>
      </div>
    </div>
  );
}