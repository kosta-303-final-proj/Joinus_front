import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import SearchFilter from './SearchFilter';
import './admin-common.css';
import './MemberDetail.css';

const MemberDetail = () => {
  const { username } = useParams();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('detail');
  const [loading, setLoading] = useState(true);

  // 회원 정보
  const [memberInfo, setMemberInfo] = useState(null);
  const [shippingAddresses, setShippingAddresses] = useState([]);

  // 공구내역 State
  const [purchasePage, setPurchasePage] = useState({
    content: [],
    totalPages: 0,
    totalElements: 0,
    number: 0
  });
  const [purchaseFilters, setPurchaseFilters] = useState({
    startDate: '',
    endDate: '',
    searchType: 'gbProductName',
    searchKeyword: ''
  });

  const [proposalPage, setProposalPage] = useState({
    content: [],
    totalPages: 0,
    number: 0
  });
  const [reviewPage, setReviewPage] = useState({
    content: [],
    totalPages: 0,
    number: 0
  });
  const [pointPage, setPointPage] = useState({
    content: [],
    totalPages: 0,
    number: 0
  });


  // ========================================
  // 공구내역 조회
  // ========================================
  const fetchPurchases = async (page = 0) => {
    try {
      const params = {
        startDate: purchaseFilters.startDate || null,
        endDate: purchaseFilters.endDate || null,
        searchType: purchaseFilters.searchType || null,
        searchKeyword: purchaseFilters.searchKeyword || null,
        page,
        size: 10
      };

      const response = await myAxios().get(
        `/admin/memberDetail/${username}/purchases`,
        { params }
      );

      setPurchasePage(response.data);
    } catch (error) {
      console.error('공구내역 조회 실패:', error);
    }
  };


  // ========================================
  // 제안 목록 조회
  // ========================================
  const fetchProposals = async (page = 0) => {
    try {
      const response = await myAxios().get(
        `/admin/memberDetail/${username}/proposals`,
        { params: { page, size: 10 } }
      );
      setProposalPage(response.data);
    } catch (error) {
      console.error('제안 목록 조회 실패:', error);
    }
  };

  // ========================================
  // 리뷰 목록 조회
  // ========================================
  const fetchReviews = async (page = 0) => {
    try {
      const response = await myAxios().get(
        `/admin/memberDetail/${username}/reviews`,
        { params: { page, size: 10 } }
      );
      setReviewPage(response.data);
    } catch (error) {
      console.error('리뷰 목록 조회 실패:', error);
    }
  };

  // ========================================
  // 포인트 내역 조회
  // ========================================
  const fetchPoints = async (page = 0) => {
    try {
      const response = await myAxios().get(
        `/admin/memberDetail/${username}/points`,
        { params: { page, size: 10 } }
      );
      setPointPage(response.data);
    } catch (error) {
      console.error('포인트 내역 조회 실패:', error);
    }
  };

  // ========================================
  // 공구내역 검색
  // ========================================
  const handlePurchaseSearch = (filters) => {
    setPurchaseFilters({
      startDate: filters.startDate || '',
      endDate: filters.endDate || '',
      searchType: filters.searchType || 'gbProductName',
      searchKeyword: filters.searchKeyword || ''
    });
  };

  const handlePurchaseReset = () => {
    setPurchaseFilters({
      startDate: '',
      endDate: '',
      searchType: 'gbProductName',
      searchKeyword: ''
    });
  };

  // ========================================
  // 공구 상세로 이동
  // ========================================
  const handleGbProductClick = (gbProductId) => {
    navigate(`/gbProduct/${gbProductId}`);
    // 또는 새 창: window.open(`/gbProduct/${gbProductId}`, '_blank');
  };


  // ========================================
  // 회원 상세 정보 조회
  // ========================================
  useEffect(() => {
    const fetchMemberDetail = async () => {
      try {
        console.log('========== 회원 정보 조회 시작 ==========');
        console.log('Username:', username);

        setLoading(true);
        const response = await myAxios().get(`/admin/memberDetail/${username}`);

        console.log('✅ 응답:', response.data);

        setMemberInfo(response.data);

        if (response.data.shippingAddresses) {
          setShippingAddresses(response.data.shippingAddresses);
        }

      } catch (error) {
        console.error('회원 정보 조회 실패:', error);
        alert('회원 정보를 불러오는데 실패했습니다.');
        navigate('/admin/memberList');
      } finally {
        setLoading(false);
      }
    };

    fetchMemberDetail();
  }, [username, navigate]);


  // ========================================
  // 탭 변경 시 데이터 로드
  // ========================================
  useEffect(() => {
    if (activeTab === 'purchase') {
      fetchPurchases();
    } else if (activeTab === 'activity') {
      fetchProposals();
      fetchReviews();
      fetchPoints();
    }
  }, [activeTab]);

  // ========================================
  // 로딩 중
  // ========================================
  if (loading) {
    return (
      <div className="admin-layout">
        <div className="main-content">
          <div className="content-area">로딩 중...</div>
        </div>
      </div>
    );
  }

  // ========================================
  // 회원 정보 없음
  // ========================================
  if (!memberInfo) {
    return (
      <div className="admin-layout">
        <div className="main-content">
          <div className="content-area">회원 정보를 찾을 수 없습니다.</div>
        </div>
      </div>
    );
  }


  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title="회원 상세 보기" />

        <div className="content-area">
          {/* 회원 기본정보 */}
          <div className="member-info-section">
            <h3>기본정보</h3>
            <div className="table-container">
              <table className="admin-table member-info-table">
                <colgroup>
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '100px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '150px' }} />
                  <col style={{ width: '80px' }} />
                  <col style={{ width: '80px' }} />
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
                    <td>
                      {memberInfo.createdAt
                        ? new Date(memberInfo.createdAt).toLocaleDateString('ko-KR')
                        : 'N/A'}
                    </td>
                    <td>{memberInfo.username}</td>
                    <td>{memberInfo.nickname}</td>
                    <td>{memberInfo.name}</td>
                    <td>{memberInfo.gradeDescription}</td>
                    <td>{memberInfo.email}</td>
                    <td>{memberInfo.pointBalance?.toLocaleString() || 0}p</td>
                    <td>
                      <span className={`status-badge ${memberInfo.status === 'ACTIVE' ? 'blue' : 'gray'
                        }`}>
                        {memberInfo.statusDescription}
                      </span>
                    </td>
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

          {/* ========== 상세 탭 ========== */}
          {activeTab === 'detail' && (
            <div>
              <div className="detail-info-section">
                <div className="table-container">
                  <table className="admin-table detail-info-table">
                    <tbody>
                      <tr>
                        <td className="label-cell">연락처</td>
                        <td className="value-cell">{memberInfo.phone || 'N/A'}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">생년월일</td>
                        <td className="value-cell">
                          {memberInfo.birthDate
                            ? new Date(memberInfo.birthDate).toLocaleDateString('ko-KR')
                            : 'N/A'}
                        </td>
                      </tr>
                      <tr>
                        <td className="label-cell">성별</td>
                        <td className="value-cell">{memberInfo.genderDescription}</td>
                      </tr>
                      <tr>
                        <td className="label-cell">추천인</td>
                        <td className="value-cell">
                          {memberInfo.recommenderUsername || '없음'}
                        </td>
                      </tr>
                      <tr>
                        <td className="label-cell">로그인 타입</td>
                        <td className="value-cell">{memberInfo.loginTypeDescription}</td>
                      </tr>
                      {memberInfo.status === 'DELETED' && memberInfo.delReason && (
                        <tr>
                          <td className="label-cell">탈퇴 사유</td>
                          <td className="value-cell">{memberInfo.delReason}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* 기본 배송지 */}
              <div className="shipping-section">
                <h3>기본 배송지</h3>
                {shippingAddresses.length === 0 ? (
                  <p>등록된 배송지가 없습니다.</p>
                ) : (
                  shippingAddresses.map((shipping) => (
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
                  ))
                )}
              </div>
            </div>
          )}

          {/* ========== 공구내역 탭 ========== */}
          {activeTab === 'purchase' && (
            <div>
              <h3 className="purchase-section">결제한 공구 내역</h3>

              {/* 검색 필터 */}
              <SearchFilter
                variant="withDate"
                searchOptions={[
                  { value: 'gbProductName', label: '공구명' },
                  { value: 'orderId', label: '주문번호' },
                  { value: 'gbProductId', label: '공구코드' }
                ]}
                showResetButton={true}
                onSearch={handlePurchaseSearch}
                onReset={handlePurchaseReset}
              />

              <div className="table-container">
                <table className="admin-table">
                  <colgroup>
                    <col style={{ width: '60px' }} />
                    <col style={{ width: '120px' }} />
                    <col style={{ width: 'auto' }} />
                    <col style={{ width: '100px' }} />
                    <col style={{ width: '80px' }} />
                    <col style={{ width: '120px' }} />
                    <col style={{ width: '120px' }} />
                  </colgroup>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>주문번호</th>
                      <th>공구명</th>
                      <th>가격</th>
                      <th>수량</th>
                      <th>주문 날짜</th>
                      <th>상태</th>
                    </tr>
                  </thead>
                  <tbody>
                    {purchasePage.content.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="empty-state">
                          <p>공구 내역이 없습니다.</p>
                        </td>
                      </tr>
                    ) : (
                      purchasePage.content.map((purchase, index) => (
                        <tr
                          key={purchase.orderItemId}
                          onClick={() => handleGbProductClick(purchase.gbProductId)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{purchasePage.number * purchasePage.size + index + 1}</td>
                          <td>{purchase.orderId}</td>
                          <td style={{ textAlign: 'left' }}>{purchase.gbProductName}</td>
                          <td>{purchase.unitPrice?.toLocaleString()}원</td>
                          <td>{purchase.quantity}개</td>
                          <td>
                            {purchase.orderedAt
                              ? new Date(purchase.orderedAt).toLocaleDateString('ko-KR')
                              : 'N/A'}
                          </td>
                          <td>
                            <span className={`status-badge ${purchase.orderStatus === 'COMPLETED' ? 'green' :
                              purchase.orderStatus === 'PENDING' ? 'blue' : 'gray'
                              }`}>
                              {purchase.orderStatusDescription}
                            </span>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {purchasePage.totalPages > 0 && (
                <div className="pagination">
                  {Array.from({ length: purchasePage.totalPages }, (_, i) => (
                    <button
                      key={i}
                      className={`page-btn ${purchasePage.number === i ? 'active' : ''}`}
                      onClick={() => fetchPurchases(i)}
                    >
                      {i + 1}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ========== 활동내역 탭 ========== */}
          {activeTab === 'activity' && (
            <div>
              {/* 제안한 상품 */}
              <div className="activity-section">
                <h3>제안한 상품</h3>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>작성 날짜</th>
                        <th>상품명</th>
                        <th>설명</th>
                        <th>투표수</th>
                      </tr>
                    </thead>
                    <tbody>
                      {proposalPage.content.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <p>제안한 상품이 없습니다.</p>
                          </td>
                        </tr>
                      ) : (
                        proposalPage.content.map((proposal, index) => (
                          <tr
                            key={proposal.proposalId}
                            onClick={() => navigate(`/admin/proposalDetail/${proposal.proposalId}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{proposalPage.number * 10 + index + 1}</td>
                            <td>
                              {proposal.createdAt
                                ? new Date(proposal.createdAt).toLocaleDateString('ko-KR')
                                : 'N/A'}
                            </td>
                            <td>{proposal.productName}</td>
                            <td style={{ textAlign: 'left' }}>{proposal.description}</td>
                            <td>{proposal.voteCount || 0}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {proposalPage.totalPages > 0 && (
                  <div className="pagination">
                    {Array.from({ length: proposalPage.totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`page-btn ${proposalPage.number === i ? 'active' : ''}`}
                        onClick={() => fetchProposals(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 작성한 리뷰 */}
              <div className="activity-section">
                <h3>작성한 리뷰</h3>
                <div className="table-container">
                  <table className="admin-table">
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
                      {reviewPage.content.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <p>작성한 리뷰가 없습니다.</p>
                          </td>
                        </tr>
                      ) : (
                        reviewPage.content.map((review, index) => (
                          <tr
                            key={review.id}
                            onClick={() => navigate(`/gbProductDetail/${review.gbProductId}`)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{reviewPage.number * 10 + index + 1}</td>
                            <td>
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString('ko-KR')
                                : 'N/A'}
                            </td>
                            <td>{review.gbProductName}</td>
                            <td style={{ textAlign: 'left' }}>{review.content}</td>
                            <td>{'⭐'.repeat(review.rating || 0)}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {reviewPage.totalPages > 0 && (
                  <div className="pagination">
                    {Array.from({ length: reviewPage.totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`page-btn ${reviewPage.number === i ? 'active' : ''}`}
                        onClick={() => fetchReviews(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* 포인트 내역 */}
              <div className="activity-section">
                <h3>포인트 내역</h3>
                <p className="point-current">
                  현재 포인트: {memberInfo.pointBalance?.toLocaleString() || 0} p
                </p>
                <div className="table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>날짜</th>
                        <th>포인트 내역</th>
                        <th>포인트</th>
                        <th>주문번호</th>
                      </tr>
                    </thead>
                    <tbody>
                      {pointPage.content.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="empty-state">
                            <p>포인트 내역이 없습니다.</p>
                          </td>
                        </tr>
                      ) : (
                        pointPage.content.map((point, index) => (
                          <tr key={point.id}>
                            <td>{pointPage.number * 10 + index + 1}</td>
                            <td>
                              {point.createdAt
                                ? new Date(point.createdAt).toLocaleDateString('ko-KR')
                                : 'N/A'}
                            </td>
                            <td style={{ textAlign: 'left' }}>
                              {point.reasonType || 'N/A'}
                            </td>
                            <td>
                              <span style={{
                                color: point.amount > 0 ? '#22c55e' : '#ef4444',
                                fontWeight: 600
                              }}>
                                {point.amount > 0 ? '+' : ''}{point.amount?.toLocaleString() || 0}p
                              </span>
                            </td>
                            <td>{point.orderId || '-'}</td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>

                {/* 페이지네이션 */}
                {pointPage.totalPages > 0 && (
                  <div className="pagination">
                    {Array.from({ length: pointPage.totalPages }, (_, i) => (
                      <button
                        key={i}
                        className={`page-btn ${pointPage.number === i ? 'active' : ''}`}
                        onClick={() => fetchPoints(i)}
                      >
                        {i + 1}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MemberDetail;