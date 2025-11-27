import { useMemo, useState } from 'react';
import './ApprovedDeliveryCompany.css';

const approvedVendors = [
  {
    id: 1,
    companyName: '해외직구 트레이딩',
    businessNumber: '234-56-78901',
    manager: '박서윤',
    email: 'global@example.com',
    phone: '010-2222-3333',
    category: '가전/기타',
    approvedDate: '2025-01-14',
    memo: '해외 직구 인기 상품 보유',
  },
  {
    id: 2,
    companyName: '생활잡화 마트',
    businessNumber: '789-01-23456',
    manager: '윤서아',
    email: 'daily@example.com',
    phone: '010-7777-8888',
    category: '생활용품',
    approvedDate: '2025-01-10',
    memo: '월 1,000개 이상 공급 가능',
  },
  {
    id: 3,
    companyName: '주방용품 전문',
    businessNumber: '456-78-90123',
    manager: '최민수',
    email: 'kitchen@example.com',
    phone: '010-4444-5555',
    category: '주방/식기',
    approvedDate: '2025-01-08',
    memo: '주방 소형가전 협업 제안',
  },
];

export default function ApprovedDeliveryCompany() {
  const [keyword, setKeyword] = useState('');
  const [category, setCategory] = useState('전체');
  const [sortKey, setSortKey] = useState('recent');

  const filteredVendors = useMemo(() => {
    let list = approvedVendors.filter((vendor) => {
      const matchKeyword =
        vendor.companyName.includes(keyword) ||
        vendor.manager.includes(keyword) ||
        vendor.businessNumber.includes(keyword);
      const matchCategory =
        category === '전체' || vendor.category === category;
      return matchKeyword && matchCategory;
    });

    if (sortKey === 'recent') {
      list = [...list].sort(
        (a, b) =>
          new Date(b.approvedDate) - new Date(a.approvedDate)
      );
    } else if (sortKey === 'name') {
      list = [...list].sort((a, b) =>
        a.companyName.localeCompare(b.companyName)
      );
    }

    return list;
  }, [keyword, category, sortKey]);

  return (
    <div className="approved-company-page">
      <div className="page-header">
        <div>
          <h1 className="page-title">승인된 납품 업체 조회</h1>
          <p className="page-description">
            납품 신청 중 승인된 업체만 모아 보고, 납품 상품 등록 시 선택할 수 있습니다.
          </p>
        </div>
      </div>

      <div className="filter-box">
        <div className="filter-row">
          <div className="filter-field">
            <label>업체명 / 담당자 / 사업자번호</label>
            <input
              type="text"
              placeholder="검색어를 입력하세요"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />
          </div>
          <div className="filter-field">
            <label>카테고리</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="전체">전체</option>
              <option value="생활용품">생활용품</option>
              <option value="주방/식기">주방/식기</option>
              <option value="가전/기타">가전/기타</option>
            </select>
          </div>
          <div className="filter-field">
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

      <div className="table-card">
        <div className="table-header">
          <h2>총 {filteredVendors.length}개 업체</h2>
        </div>
        <table className="approved-table">
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
            {filteredVendors.length === 0 ? (
              <tr>
                <td colSpan="8" className="no-data">
                  승인된 업체가 없습니다.
                </td>
              </tr>
            ) : (
              filteredVendors.map((vendor) => (
                <tr key={vendor.id}>
                  <td>{vendor.companyName}</td>
                  <td>{vendor.businessNumber}</td>
                  <td>{vendor.manager}</td>
                  <td>{vendor.phone}</td>
                  <td>{vendor.email}</td>
                  <td>{vendor.category}</td>
                  <td>{vendor.approvedDate}</td>
                  <td>{vendor.memo || '-'}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}