import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import SearchFilter from './SearchFilter';
import './MemberDetail.css';

const MemberDetail = () => {
  const { id } = useParams();
  const [activeTab, setActiveTab] = useState('detail');
  
  const [purchasePage, setPurchasePage] = useState(1);
  const [proposalPage, setProposalPage] = useState(1);
  const [reviewPage, setReviewPage] = useState(1);
  const [pointPage, setPointPage] = useState(1);

  // 임시 회원 기본정보 데이터
  const memberInfo = {
    joinDate: '2025-11-01',
    userId: 'hong1234',
    nickname: 'hong',
    name: '홍길동',
    grade: 'SILVER',
    email: 'hong@gmail.com',
    points: 1243,
    status: '정상'
  };

  // 임시 상세정보 데이터
  const detailInfo = {
    phone: '010-1234-5678',
    address: '13425\n서울시 강남구 테헤란로 123\n동서빌딩4층번역',
    birthday: '2011-08-31'
  };

  // 임시 배송지 정보 데이터
  const shippingAddresses = [
    { id: 1, type: '집', recipient: '홍길동', phone: '', address: '' },
    { id: 2, type: '선물용', recipient: '성실', phone: '', address: '' }
  ];

  // 임시 공구내역 데이터
  const purchases = [
    { 
      id: 1, 
      code: '12343', 
      product: '영국 한정 출시 10주년 기념 마우스패드', 
      price: '12,800원', 
      date: '2024-11-06',
      status: '(배송 완료)' 
    },
    { 
      id: 2, 
      code: '12343', 
      product: '영국 한정 출시 10주년 기념 마우스패드', 
      price: '12,800원', 
      date: '2024-11-06',
      status: '(결제 완료)' 
    },
    { 
      id: 3, 
      code: '12343', 
      product: '영국 한정 출시 10주년 기념 마우스패드', 
      price: '12,800원', 
      date: '2024-11-06',
      status: '(배송중)' 
    }
  ];

  // 임시 제안 상품 데이터
  const proposals = [
    { 
      id: 1, 
      date: '2024-11-06', 
      store: 'UK-F12 헤드셋', 
      product: '9 엠티타단 데몬 플라타 헤드셋...', 
      views: 56 
    },
    { 
      id: 2, 
      date: '2024-11-06', 
      store: 'UK-F12 헤드셋', 
      product: ' 데몬 플라타 헤드셋...', 
      views: 56 
    },
    { 
      id: 3, 
      date: '2024-11-06', 
      store: 'UK-F12 헤드셋', 
      product: ' 엠티타단 데몬 플라타 헤드셋...', 
      views: 56 
    }
  ];

  // 임시 리뷰 데이터
  const reviews = [
    { 
      id: 1, 
      date: '2024-11-06', 
      store: 'UK-F12 헤드셋',
      content: '드디어 영국 만원된 헤드셋 시작 너무 ...',
      rating: 5
    }
  ];

  // 임시 포인트 데이터
  const pointHistory = [
    { 
      id: 1, 
      date: '2024-11-06', 
      type: '공구 상품 결제', 
      points: 2000, 
      status: '사용',
      expiry: '2025/01/023'
    }
  ];

  const handlePurchaseSearch = (filters) => {
    console.log('공구내역 검색:', filters);
  };

  const handlePurchaseReset = () => {
    console.log('공구내역 초기화');
  };

  return (
    <div className="admin-layout">
      <Sidebar />
      
      <div className="main-content">
        <Header title="회원 상세 보기" />
        
        <div className="content-area">
         {/* 회원 기본정보 */}
<div className="member-info-section">
  <h3>기본정보</h3>
  <div className="table-container">
    <table className="admin-table member-info-table">
      <colgroup>
        <col style={{ width: '100px' }} />  {/* 회원가입 날짜 */}
        <col style={{ width: '100px' }} />  {/* 아이디 */}
        <col style={{ width: '80px' }} />   {/* 닉네임 */}
        <col style={{ width: '80px' }} />   {/* 이름 */}
        <col style={{ width: '80px' }} />   {/* 등급 */}
        <col style={{ width: '150px' }} />  {/* 이메일 */}
        <col style={{ width: '80px' }} />   {/* 포인트 */}
        <col style={{ width: '80px' }} />   {/* 상태 */}
      </colgroup>
      <thead>
        <tr>
          <th>회원가입 날짜</th>
          <th>아이디</th>
          <th>닉네임</th>
          <th>이름</th>
          <th>등급</th>
          <th>이메일</th>
          <th>포인트</th>
          <th>상태</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>{memberInfo.joinDate}</td>
          <td>{memberInfo.userId}</td>
          <td>{memberInfo.nickname}</td>
          <td>{memberInfo.name}</td>
          <td>{memberInfo.grade}</td>
          <td>{memberInfo.email}</td>
          <td>{memberInfo.points}</td>
          <td>{memberInfo.status}</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

          {/* 탭 */}
          <div className="tabs-container">
            <div className="tabs">
              <button 
                className={`tab ${activeTab === 'detail' ? 'active' : ''}`}
                onClick={() => setActiveTab('detail')}
              >
                상세
              </button>
              <button 
                className={`tab ${activeTab === 'purchase' ? 'active' : ''}`}
                onClick={() => setActiveTab('purchase')}
              >
                공구내역
              </button>
              <button 
                className={`tab ${activeTab === 'activity' ? 'active' : ''}`}
                onClick={() => setActiveTab('activity')}
              >
                활동 내역
              </button>
            </div>
          </div>

          {/* 탭 내용 */}
          {activeTab === 'detail' && (
            <div>
              {/* 추가 회원정보 */}
              <div className="detail-info-section">
                <div className="table-container">
                  <table className="admin-table detail-info-table">
                    <tbody>
                      <tr>
                        <td className="label-cell">연락처</td>
                        <td className="value-cell">{detailInfo.phone}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">주소</td>
                        <td className="value-cell">{detailInfo.address}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">가입일</td>
                        <td className="value-cell">{detailInfo.birthday}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 기본 배송지 */}
              <div className="shipping-section">
                <h3>기본 배송지</h3>
                {shippingAddresses.map((shipping) => (
                  <div key={shipping.id} className="shipping-item">
                    <div className="table-container">
                      <table className="admin-table detail-info-table">
                        <tbody>
                          <tr>
                            <td className="label-cell">배송지명</td>
                            <td className="value-cell">{shipping.type}</td>
                          </tr>
                          <tr>
                            <td className="label-cell">받는분</td>
                            <td className="value-cell">{shipping.recipient}</td>
                          </tr>
                          <tr>
                            <td className="label-cell">연락처</td>
                            <td className="value-cell">{shipping.phone}</td>
                          </tr>
                          <tr>
                            <td className="label-cell">주소</td>
                            <td className="value-cell">{shipping.address}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'purchase' && (
            <div>
              <h3 className="purchase-section">결제한 공구 내역</h3>
              
              {/* 검색 필터 */}
              <SearchFilter 
                variant="withDate"
                onSearch={handlePurchaseSearch}
                onReset={handlePurchaseReset}
              />

              {/* 공구내역 테이블 */}
              <div className="table-container">
                <table className="admin-table">
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '120px' }} />
                    <col style={{ width: '150px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '120px' }} />
                    <col style={{ width: '120px' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>공구 코드</th>
                      <th>게시일 제목</th>
                      <th>공구명</th>
                      <th>가격</th>
                      <th>결제 날짜</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchases.map((purchase, index) => (
                      <tr key={purchase.id}>
                        <td>{index + 1}</td>
                        <td>{purchase.code}</td>
                        <td></td>
                        <td style={{ textAlign: 'left' }}>{purchase.product}</td>
                        <td>{purchase.price}</td>
                        <td>{purchase.date}</td>
                        <td>{purchase.status}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* 페이지네이션 */}
              <div className="pagination">
                <button className="page-btn active">1</button>
                <button className="page-btn">2</button>
                <button className="page-btn">3</button>
                <span className="page-dots">...</span>
                <button className="page-btn">67</button>
                <button className="page-btn">68</button>
              </div>
            </div>
          )}

          {activeTab === 'activity' && (
            <div>
              {/* 제안한 상품 */}
              <div className="activity-section">
                <h3>제안한 상품</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <colgroup>
                      <col style={{ width: '60px' }} />
                      <col style={{ width: '120px' }} />
                      <col style={{ width: '150px' }} />
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '100px' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>작성 날짜</th>
                        <th>게시일 제목</th>
                        <th>내용</th>
                        <th>투표</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposals.map((proposal, index) => (
                        <tr key={proposal.id}>
                          <td>{index + 1}</td>
                          <td>{proposal.date}</td>
                          <td>{proposal.store}</td>
                          <td style={{ textAlign: 'left' }}>{proposal.product}</td>
                          <td>{proposal.views}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <span className="page-dots">...</span>
                  <button className="page-btn">67</button>
                  <button className="page-btn">68</button>
                </div>
              </div>

              {/* 작성한 리뷰 */}
              <div className="activity-section">
                <h3>작성한 리뷰</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <colgroup>
                      <col style={{ width: '60px' }} />
                      <col style={{ width: '120px' }} />
                      <col style={{ width: '150px' }} />
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '120px' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>작성 날짜</th>
                        <th>공구 상품명</th>
                        <th>내용</th>
                        <th>별점</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.map((review, index) => (
                        <tr key={review.id}>
                          <td>{index + 1}</td>
                          <td>{review.date}</td>
                          <td>{review.store}</td>
                          <td style={{ textAlign: 'left' }}>{review.content}</td>
                          <td>{'⭐'.repeat(review.rating)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <span className="page-dots">...</span>
                  <button className="page-btn">67</button>
                  <button className="page-btn">68</button>
                </div>
              </div>

              {/* 포인트 내역 */}
              <div className="activity-section">
                <h3>포인트 내역</h3>
                <p className="point-current">현재 포인트: 2500 p</p>
                <div className="table-container">
                  <table className="admin-table">
                    <colgroup>
                      <col style={{ width: '60px' }} />
                      <col style={{ width: '120px' }} />
                      <col style={{ width: 'auto' }} />
                      <col style={{ width: '120px' }} />
                      <col style={{ width: '120px' }} />
                      <col style={{ width: '120px' }} />
                    </colgroup>
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>날짜</th>
                        <th>포인트 내역</th>
                        <th>포인트</th>
                        <th>사용 내역</th>
                        <th>소멸기 주문 반호</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointHistory.map((point, index) => (
                        <tr key={point.id}>
                          <td>{index + 1}</td>
                          <td>{point.date}</td>
                          <td style={{ textAlign: 'left' }}>{point.type}</td>
                          <td>{point.points}</td>
                          <td>{point.status}</td>
                          <td>{point.expiry}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="pagination">
                  <button className="page-btn active">1</button>
                  <button className="page-btn">2</button>
                  <button className="page-btn">3</button>
                  <span className="page-dots">...</span>
                  <button className="page-btn">67</button>
                  <button className="page-btn">68</button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;