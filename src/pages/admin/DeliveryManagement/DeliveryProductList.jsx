import { useMemo, useState } from 'react';
import './DeliveryProductList.css';

const approvedVendors = [
  { id: 1, name: '해외직구 트레이딩' },
  { id: 2, name: '생활잡화 마트' },
  { id: 3, name: '주방용품 전문' }
];

const deliveryRecords = [
  {
    id: 1001,
    productName: '친환경 텀블러 세트',
    vendorId: 1,
    vendorName: '해외직구 트레이딩',
    category: '생활용품',
    quantity: 300,
    unitPrice: 8000,
    deliveryDate: '2025-02-05',
    status: '납품 완료',
    memo: '2월 공구'
  },
  {
    id: 1002,
    productName: '주방 멀티쿠커',
    vendorId: 3,
    vendorName: '주방용품 전문',
    category: '주방/식기',
    quantity: 120,
    unitPrice: 52000,
    deliveryDate: '2025-02-12',
    status: '검수 중',
    memo: '주방 릴레이'
  },
  {
    id: 1003,
    productName: '휴대용 공기청정기',
    vendorId: 2,
    vendorName: '생활잡화 마트',
    category: '가전/기타',
    quantity: 200,
    unitPrice: 35000,
    deliveryDate: '2025-02-03',
    status: '입고 예정',
    memo: '회원 리워드'
  }
];

export default function DeliveryProductList() {
  const [vendorId, setVendorId] = useState('전체');
  const [status, setStatus] = useState('전체');
  const [keyword, setKeyword] = useState('');

  const filteredRecords = useMemo(() => {
    return deliveryRecords.filter((record) => {
      const vendorMatch =
        vendorId === '전체' || record.vendorId === Number(vendorId);
      const statusMatch =
        status === '전체' || record.status === status;
      const keywordMatch =
        keyword === '' ||
        record.productName.includes(keyword) ||
        record.vendorName.includes(keyword);
      return vendorMatch && statusMatch && keywordMatch;
    });
  }, [vendorId, status, keyword]);

  const totalQuantity = filteredRecords.reduce(
    (sum, item) => sum + item.quantity,
    0
  );
  const totalAmount = filteredRecords.reduce(
    (sum, item) => sum + item.quantity * item.unitPrice,
    0
  );

  return (
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
            {approvedVendors.map((vendor) => (
              <option value={vendor.id} key={vendor.id}>
                {vendor.name}
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
          <span>총 {filteredRecords.length}건</span>
          <span>총 수량 {totalQuantity.toLocaleString()}개</span>
          <span>총 금액 {totalAmount.toLocaleString()}원</span>
        </div>
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
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  조회된 납품 이력이 없습니다.
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id}>
                  <td>{record.productName}</td>
                  <td>{record.vendorName}</td>
                  <td>{record.category}</td>
                  <td>{record.quantity.toLocaleString()}개</td>
                  <td>{record.unitPrice.toLocaleString()}원</td>
                  <td>{record.deliveryDate}</td>
                  <td>
                    <span className={`status-chip status-${record.status}`}>
                      {record.status}
                    </span>
                  </td>
                  <td>{record.memo || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}