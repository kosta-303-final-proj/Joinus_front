import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/components/button.css';
import '../../styles/components/table.css';
import './Notice.css';

export default function NoticePage() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  
  // URL에서 tab, page 파라미터 가져오기
  const activeTab = searchParams.get('tab') || 'notice';
  const currentPage = parseInt(searchParams.get('page')) || 1;
  const pageSize = 10;

  // 상태 관리
  const [noticeList, setNoticeList] = useState([]);
  const [faqList, setFaqList] = useState([]);
  const [inquiryList, setInquiryList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  // 더미 데이터 (백엔드 연동 전까지 사용)
  const dummyNotices = [
    { id: 1, title: '시스템 점검 안내', created_at: '2025-01-15', view_count: 152 },
    { id: 2, title: '설 연휴 배송 안내', created_at: '2025-01-14', view_count: 203 },
    { id: 3, title: '개인정보 처리방침 변경 안내', created_at: '2025-01-10', view_count: 89 },
    { id: 4, title: '신규 결제 수단 추가 안내', created_at: '2025-01-08', view_count: 145 },
    { id: 5, title: '고객센터 운영시간 변경', created_at: '2025-01-05', view_count: 178 },
  ];

  const dummyFaqs = [
    { id: 1, question: '배송은 얼마나 걸리나요?', answer: '주문 후 평균 2-3일 소요됩니다.' },
    { id: 2, question: '환불은 어떻게 하나요?', answer: '마이페이지에서 주문 취소 후 환불 신청 가능합니다.' },
    { id: 3, question: '공동구매는 어떻게 참여하나요?', answer: '원하는 상품의 공구 참여하기 버튼을 클릭하세요.' },
    { id: 4, question: '회원 탈퇴는 어떻게 하나요?', answer: '마이페이지 > 설정에서 회원 탈퇴가 가능합니다.' },
  ];

  const dummyInquiries = [
    { id: 1, title: '배송 지연 문의', status: '답변 완료', created_at: '2025-01-15' },
    { id: 2, title: '상품 불량 문의', status: '답변 대기', created_at: '2025-01-14' },
    { id: 3, title: '결제 오류 문의', status: '답변 완료', created_at: '2025-01-13' },
  ];

  // 데이터 로딩 (백엔드 연동 시 이 부분만 수정)
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // TODO: 백엔드 연동 시 아래 주석 해제하고 실제 API 호출
        // const baseUrl = 'http://localhost:8080';
        // 
        // if (activeTab === 'notice') {
        //   const response = await fetch(
        //     `${baseUrl}/notice?page=${currentPage}&size=${pageSize}`
        //   );
        //   const data = await response.json();
        //   setNoticeList(data.items || []);
        //   setTotalCount(data.totalCount || 0);
        // } else if (activeTab === 'faq') {
        //   const response = await fetch(`${baseUrl}/faq`);
        //   const data = await response.json();
        //   setFaqList(data.items || []);
        // } else if (activeTab === 'inquiry') {
        //   const response = await fetch(
        //     `${baseUrl}/inquiries?page=${currentPage}&size=${pageSize}`
        //   );
        //   const data = await response.json();
        //   setInquiryList(data.items || []);
        //   setTotalCount(data.totalCount || 0);
        // }

        // 임시: 더미 데이터 사용 (백엔드 연동 전까지)
        if (activeTab === 'notice') {
          setNoticeList(dummyNotices);
          setTotalCount(dummyNotices.length);
        } else if (activeTab === 'faq') {
          setFaqList(dummyFaqs);
        } else if (activeTab === 'inquiry') {
          setInquiryList(dummyInquiries);
          setTotalCount(dummyInquiries.length);
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [activeTab, currentPage]);

  // 탭 변경 핸들러
  const handleTabChange = (tab) => {
    setSearchParams({ tab, page: 1 });
  };

  // 페이지 변경 핸들러
  const handlePageChange = (page) => {
    setSearchParams({ tab: activeTab, page });
  };

  // 공지사항 클릭 핸들러
  const handleNoticeClick = (id) => {
    navigate(`/cs/notice/${id}`);
  };

  // 1:1 문의 클릭 핸들러
  const handleInquiryClick = (id) => {
    navigate(`/cs/inquiry/${id}`);
  };

  return (
    <div className="notice-page">
      <div className="notice-container">
        <h1 className="page-title">고객센터</h1>

        {/* 탭 메뉴 */}
        <div className="tabs">
          <button
            className={`tab ${activeTab === 'notice' ? 'active' : ''}`}
            onClick={() => handleTabChange('notice')}
          >
            공지사항
          </button>
          <button
            className={`tab ${activeTab === 'faq' ? 'active' : ''}`}
            onClick={() => handleTabChange('faq')}
          >
            FAQ
          </button>
          <button
            className={`tab ${activeTab === 'inquiry' ? 'active' : ''}`}
            onClick={() => handleTabChange('inquiry')}
          >
            1:1 문의
          </button>
        </div>

        {/* 공지사항 탭 */}
        {activeTab === 'notice' && (
          <div className="tab-content">
            {isLoading ? (
              <div>로딩 중...</div>
            ) : (
              <>
                <div className="notice-list">
                  <table className="notice-table">
                    <thead>
                      <tr>
                        <th>번호</th>
                        <th>제목</th>
                        <th>작성일</th>
                      </tr>
                    </thead>
                    <tbody>
                      {noticeList.map((notice, index) => (
                        <tr 
                          key={notice.id}
                          onClick={() => handleNoticeClick(notice.id)}
                          style={{ cursor: 'pointer' }}
                        >
                          <td>{totalCount - (currentPage - 1) * pageSize - index}</td>
                          <td className="title-cell">{notice.title}</td>
                          <td>{notice.created_at || notice.date}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {/* 페이지네이션 - 백엔드 연동 시 활성화 */}
                {/* <Pagination 
                  currentPage={currentPage}
                  totalCount={totalCount}
                  pageSize={pageSize}
                  onPageChange={handlePageChange}
                /> */}
              </>
            )}
          </div>
        )}

        {/* FAQ 탭 */}
        {activeTab === 'faq' && (
          <div className="tab-content">
            <div className="faq-list">
              {faqList.map((faq) => (
                <div key={faq.id} className="faq-item">
                  <div className="faq-question">
                    <span className="faq-icon">Q</span>
                    <span>{faq.question}</span>
                  </div>
                  <div className="faq-answer">
                    <span className="faq-icon">A</span>
                    <span>{faq.answer}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 1:1 문의 탭 */}
        {activeTab === 'inquiry' && (
          <div className="tab-content">
              <div className="inquiry-list">
              <table className="inquiry-table">
                <thead>
                  <tr>
                    <th>번호</th>
                    <th>제목</th>
                    <th>상태</th>
                    <th>작성일</th>
                  </tr>
                </thead>
                <tbody>
                  {inquiryList.map((inquiry, index) => (
                    <tr 
                      key={inquiry.id}
                      onClick={() => handleInquiryClick(inquiry.id)}
                      style={{ cursor: 'pointer' }}
                    >
                      <td>{inquiryList.length - index}</td>
                      <td className="title-cell">{inquiry.title}</td>
                      <td>
                        <span className={`status ${inquiry.status === '답변 완료' ? 'completed' : 'pending'}`}>
                          {inquiry.status}
                        </span>
                      </td>
                      <td>{inquiry.created_at || inquiry.date}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="inquiry-footer-section">
              <button
                className="btn btn-primary"
                onClick={() => navigate('/cs/inquiryWrite')}
                >
                  문의 작성
                </button>
              </div>
            {/* 페이지네이션 - 백엔드 연동 시 활성화 */}
            {/* <Pagination 
              currentPage={currentPage}
              totalCount={totalCount}
              pageSize={pageSize}
              onPageChange={handlePageChange}
            /> */}
          </div>
        )}
      </div>
    </div>
  );
}