import { useState, useEffect, useMemo } from 'react';
import { getApprovedSupplierList, getSupplyProductList } from '../../../services/supplyApi';
import AdminHeader from '../../../components/layout/AdminHeader';
import './DeliveryProductList.css';

// 날짜 포맷팅 함수
const formatDate = (timestamp) => {
  if (!timestamp) return '';
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function DeliveryProductList() {
  const [vendorId, setVendorId] = useState('전체');
  const [status, setStatus] = useState('전체');
  const [keyword, setKeyword] = useState('');
  const [records, setRecords] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 승인된 업체 목록 로드 (드롭다운용)
  useEffect(() => {
    const fetchVendors = async () => {
      try {
        const data = await getApprovedSupplierList('', '전체', 'name');
        setVendors(data || []);
      } catch (err) {
        console.error('업체 목록 조회 실패:', err);
      }
    };

    fetchVendors();
  }, []);

  // 납품 상품 목록 조회
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const selectedVendorId = vendorId === '전체' ? null : Number(vendorId);
        const data = await getSupplyProductList(selectedVendorId, status, keyword);
        setRecords(data || []);
      } catch (err) {
        console.error('납품 상품 목록 조회 실패:', err);
        setError('데이터를 불러올 수 없습니다.');
        setRecords([]);
      } finally {
        setIsLoading(false);
      }
    };

    // 디바운싱: 검색어 입력 후 500ms 후에 API 호출
    const timer = setTimeout(() => {
      fetchProducts();
    }, keyword ? 500 : 0);

    return () => clearTimeout(timer);
  }, [vendorId, status, keyword]);

  // 총 수량/금액 계산
  const { totalQuantity, totalAmount } = useMemo(() => {
    const quantity = records.reduce((sum, item) => sum + (item.quantity || 0), 0);
    const amount = records.reduce(
      (sum, item) => sum + (item.quantity || 0) * (item.unitPrice || 0),
      0
    );
    return { totalQuantity: quantity, totalAmount: amount };
  }, [records]);

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="납품상품 조회" />
        <div className="content-area">
    <div className="delivery-product-list-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">납품 상품 조회</h1>
          <p className="page-description">
            승인된 납품 업체 기준으로 납품 이력을 확인할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="filter-panel">
        <div className="filter-field">
          <label>납품 업체</label>
          <select
            value={vendorId}
            onChange={(e) => setVendorId(e.target.value)}
          >
            <option value="전체">전체</option>
            {vendors.map((vendor) => (
              <option value={vendor.id} key={vendor.id}>
                {vendor.companyName}
              </option>
            ))}
          </select>
        </div>
        <div className="filter-field">
          <label>상태</label>
          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="전체">전체</option>
            <option value="납품 완료">납품 완료</option>
            <option value="검수 중">검수 중</option>
            <option value="입고 예정">입고 예정</option>
          </select>
        </div>
        <div className="filter-field grow">
          <label>상품명 / 업체명</label>
          <input
            type="text"
            placeholder="예) 텀블러, 생활잡화"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </div>
      </div>

      <div className="table-card">
        <div className="table-info">
          <span>총 {records.length}건</span>
          <span>총 수량 {totalQuantity.toLocaleString()}개</span>
          <span>총 금액 {totalAmount.toLocaleString()}원</span>
        </div>
        {isLoading ? (
          <div className="loading">로딩 중...</div>
        ) : error ? (
          <div className="error">{error}</div>
        ) : (
          <table className="delivery-table">
            <thead>
              <tr>
                <th>상품명</th>
                <th>납품 업체</th>
                <th>카테고리</th>
                <th>수량</th>
                <th>단가</th>
                <th>납품일</th>
                <th>상태</th>
                <th>비고</th>
              </tr>
            </thead>
            <tbody>
              {records.length === 0 ? (
                <tr>
                  <td colSpan="8" className="no-data">
                    조회된 납품 이력이 없습니다.
                  </td>
                </tr>
              ) : (
                records.map((record) => (
                  <tr key={record.id}>
                    <td>{record.productName}</td>
                    <td>{record.supplierName}</td>
                    <td>{record.category || '-'}</td>
                    <td>{(record.quantity || 0).toLocaleString()}개</td>
                    <td>{(record.unitPrice || 0).toLocaleString()}원</td>
                    <td>{formatDate(record.deliveryDate)}</td>
                    <td>
                      <span className={`status-chip status-${record.status?.replace(/\s/g, '') || ''}`}>
                        {record.status || '-'}
                      </span>
                    </td>
                    <td>{record.memo || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
        </div>
      </div>
    </div>
  );
}