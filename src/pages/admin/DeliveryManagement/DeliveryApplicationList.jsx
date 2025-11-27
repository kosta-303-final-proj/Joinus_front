import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import './DeliveryApplicationList.css';

const mockApplications = [
  {
    id: 1,
    companyName: '친환경용품 상사',
    businessNumber: '123-45-67890',
    manager: '김지연',
    email: 'eco@example.com',
    phone: '010-1111-2222',
    category: '생활용품',
    appliedDate: '2025-01-15',
    status: '신청',
    formData: {
      address: '서울시 강남구',
      description: '친환경 생활용품 전문 납품 업체입니다.'
    }
  },
  {
    id: 2,
    companyName: '해외직구 트레이딩',
    businessNumber: '234-56-78901',
    manager: '박서윤',
    email: 'global@example.com',
    phone: '010-2222-3333',
    category: '가전/기타',
    appliedDate: '2025-01-14',
    status: '승인',
    formData: {
      address: '서울시 서초구',
      description: '해외 직구 상품 납품 전문'
    }
  },
  {
    id: 3,
    companyName: '주방용품 전문',
    businessNumber: '456-78-90123',
    manager: '최민수',
    email: 'kitchen@example.com',
    phone: '010-4444-5555',
    category: '주방/식기',
    appliedDate: '2025-01-13',
    status: '반려',
    rejectionReason: '필수 서류 미비',
    formData: {
      address: '서울시 마포구',
      description: '주방용품 전문 납품'
    }
  }
];

const FILTERS = ['전체', '신청', '승인', '반려'];

export default function DeliveryApplicationList() {
  const navigate = useNavigate();
  const [applications, setApplications] = useState([]);
  const [filter, setFilter] = useState('전체');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      await new Promise((r) => setTimeout(r, 200)); // 모킹
      const filtered =
        filter === '전체'
          ? mockApplications
          : mockApplications.filter((item) => item.status === filter);
      setApplications(filtered);
      setIsLoading(false);
    };

    load();
  }, [filter]);

  const handleApprove = (id) => {
    if (!window.confirm('이 신청을 승인하시겠습니까?')) return;

    setApplications((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: '승인' } : item
      )
    );
    alert('승인 처리되었습니다. (추후 API 연동 예정)');
  };

  const handleReject = (id) => {
    const reason = window.prompt('반려 사유를 입력하세요.');
    if (!reason) return;

    setApplications((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, status: '반려', rejectionReason: reason }
          : item
      )
    );
    alert('반려 처리되었습니다. (업체에 이메일 발송 예정)');
  };

  const handleDetailClick = (id) => {
    navigate(`/admin/delivery/application/${id}`);
  };

  const summary = useMemo(
    () =>
      FILTERS.reduce((acc, key) => {
        if (key === '전체') return acc;
        acc[key] = mockApplications.filter(
          (app) => app.status === key
        ).length;
        return acc;
      }, {}),
    []
  );

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
                  <th>관리</th>
                </tr>
              </thead>
              <tbody>
                {applications.length === 0 ? (
                  <tr>
                    <td colSpan="9" className="no-data">
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
                      <td>{item.businessNumber}</td>
                      <td>{item.manager}</td>
                      <td>{item.email}</td>
                      <td>{item.phone}</td>
                      <td>{item.category}</td>
                      <td>{item.appliedDate}</td>
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
                      <td>
                        {item.status === '신청' && (
                          <div className="action-buttons">
                            <button
                              className="btn-approve"
                              onClick={() => handleApprove(item.id)}
                            >
                              승인
                            </button>
                            <button
                              className="btn-reject"
                              onClick={() => handleReject(item.id)}
                            >
                              반려
                            </button>
                          </div>
                        )}
                        {item.status === '반려' && (
                          <span className="rejection-reason">
                            {item.rejectionReason}
                          </span>
                        )}
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