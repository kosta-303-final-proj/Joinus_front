import { useState, useEffect, useMemo } from 'react';
import { getApprovedSupplierList } from '../../../services/supplyApi';
import { myAxios } from '../../../config';
import AdminHeader from '../../../components/layout/AdminHeader';
import './ApprovedDeliveryCompany.css';

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function ApprovedDeliveryCompany() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('전체');
  const [sortKey, setSortKey] = useState('recent');
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await myAxios().get('/admin/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('카테고리 조회 실패:', error);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchVendors = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getApprovedSupplierList(keyword, category, sortKey);
        setVendors(data || []);
      } catch (err) {
        console.error('승인된 업체 목록 조회 실패:', err);
        setError('데이터를 불러올 수 없습니다.');
        setVendors([]);
      } finally {
        setIsLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchVendors();
    }, keyword ? 500 : 0);

    return () => clearTimeout(timer);
  }, [keyword, category, sortKey]);

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="납품회사조회" />
        <div className="content-area">
          <div className="approved-supplier-page">
            <div className="approved-supplier-header">
              <div>
                <h1 className="approved-supplier-title">승인된 납품 업체 조회</h1>
                <p className="approved-supplier-description">
                  납품 신청 중 승인된 업체만 모아 보고, 납품 상품 등록 시 선택할 수 있습니다.
                </p>
              </div>
            </div>

            <div className="approved-supplier-filter">
              <div className="approved-supplier-filter-row">
                <div className="approved-supplier-filter-field">
                  <label>업체명 / 담당자 / 사업자번호</label>
                  <input
                    type="text"
                    placeholder="검색어를 입력하세요"
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                  />
                </div>
                <div className="approved-supplier-filter-field">
                  <label>카테고리</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                  >
                    <option value="전체">전체</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.name}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="approved-supplier-filter-field">
                  <label>정렬</label>
                  <select
                    value={sortKey}
                    onChange={(e) => setSortKey(e.target.value)}
                  >
                    <option value="recent">최근 승인 순</option>
                    <option value="name">업체명 순</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="approved-supplier-table-card">
              <div className="approved-supplier-table-header">
                <h2>총 {vendors.length}개 업체</h2>
              </div>
              {isLoading ? (
                <div className="approved-supplier-loading">로딩 중...</div>
              ) : error ? (
                <div className="approved-supplier-error">{error}</div>
              ) : (
                <div className="approved-supplier-table-container">
                  <table className="approved-supplier-table">
                    <thead>
                      <tr>
                        <th>업체명</th>
                        <th>사업자번호</th>
                        <th>담당자</th>
                        <th>연락처</th>
                        <th>이메일</th>
                        <th>카테고리</th>
                        <th>승인일</th>
                        <th>메모</th>
                      </tr>
                    </thead>
                    <tbody>
                      {vendors.length === 0 ? (
                        <tr>
                          <td colSpan="8" className="approved-supplier-no-data">
                            승인된 업체가 없습니다.
                          </td>
                        </tr>
                      ) : (
                        vendors.map((vendor) => (
                          <tr key={vendor.id}>
                            <td className="approved-supplier-company-name">{vendor.companyName}</td>
                            <td>{vendor.businessNumber || '-'}</td>
                            <td>{vendor.manager}</td>
                            <td>{vendor.phone}</td>
                            <td>{vendor.email || '-'}</td>
                            <td>{vendor.category || '-'}</td>
                            <td>{formatDate(vendor.approvedDate)}</td>
                            <td>{vendor.memo || '-'}</td>
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