import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import '../../styles/components/button.css';
import '../../styles/components/table.css';
import './Notice.css';
import { getNoticeList, getFaqList, getInquiryList } from '../../services/csApi';

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
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 날짜 포맷팅 함수
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        if (activeTab === 'notice') {
          const data = await getNoticeList(currentPage);
          setNoticeList(data.noticeList || []);
          setPageInfo(data.pageInfo || { curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
        } else if (activeTab === 'faq') {
          const data = await getFaqList();
          setFaqList(data || []);
        } else if (activeTab === 'inquiry') {
          const data = await getInquiryList(currentPage);
          setInquiryList(data.inquiryList || []);
          setPageInfo(data.pageInfo || { curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
        }
      } catch (error) {
        console.error('데이터 로딩 실패:', error);
        setError('데이터를 불러오는 중 오류가 발생했습니다.');
        if (activeTab === 'notice') {
          setNoticeList([]);
        } else if (activeTab === 'faq') {
          setFaqList([]);
        } else if (activeTab === 'inquiry') {
          setInquiryList([]);
        }
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

  // 페이지네이션 컴포넌트
  const Pagination = ({ currentPage, totalPages, startPage, endPage, onPageChange }) => {
    if (totalPages <= 1) return null;

    return (
      <div className="pagination">
        <button
          className="pagination-button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
        >
          이전
        </button>
        <div className="pagination-numbers">
          {Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i).map((page) => (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          ))}
        </div>
        <button
          className="pagination-button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
        >
          다음
        </button>
      </div>
    );
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
            ) : error ? (
              <div className="error-message">{error}</div>
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
                      {noticeList.length === 0 ? (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>
                            공지사항이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        noticeList.map((notice, index) => {
                          const rowNumber = (pageInfo.allPage - currentPage) * 10 + (noticeList.length - index);
                          return (
                            <tr 
                              key={notice.id}
                              onClick={() => handleNoticeClick(notice.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <td>{rowNumber}</td>
                              <td className="title-cell">{notice.title}</td>
                              <td>{formatDate(notice.createdAt)}</td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
                <Pagination 
                  currentPage={pageInfo.curPage || currentPage}
                  totalPages={pageInfo.allPage || 1}
                  startPage={pageInfo.startPage || 1}
                  endPage={pageInfo.endPage || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        )}

        {/* FAQ 탭 */}
        {activeTab === 'faq' && (
          <div className="tab-content">
            {isLoading ? (
              <div>로딩 중...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <div className="faq-list">
                {faqList.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px' }}>FAQ가 없습니다.</div>
                ) : (
                  faqList.map((faq) => (
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
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* 1:1 문의 탭 */}
        {activeTab === 'inquiry' && (
          <div className="tab-content">
            {isLoading ? (
              <div>로딩 중...</div>
            ) : error ? (
              <div className="error-message">{error}</div>
            ) : (
              <>
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
                      {inquiryList.length === 0 ? (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '20px' }}>
                            문의 내역이 없습니다.
                          </td>
                        </tr>
                      ) : (
                        inquiryList.map((inquiry, index) => {
                          const rowNumber = (pageInfo.allPage - currentPage) * 10 + (inquiryList.length - index);
                          const status = inquiry.answer ? '답변 완료' : '답변 대기';
                          return (
                            <tr 
                              key={inquiry.id}
                              onClick={() => handleInquiryClick(inquiry.id)}
                              style={{ cursor: 'pointer' }}
                            >
                              <td>{rowNumber}</td>
                              <td className="title-cell">{inquiry.question || '제목 없음'}</td>
                              <td>
                                <span className={`status ${status === '답변 완료' ? 'completed' : 'pending'}`}>
                                  {status}
                                </span>
                              </td>
                              <td>{formatDate(inquiry.questionedAt)}</td>
                            </tr>
                          );
                        })
                      )}
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
                <Pagination 
                  currentPage={pageInfo.curPage || currentPage}
                  totalPages={pageInfo.allPage || 1}
                  startPage={pageInfo.startPage || 1}
                  endPage={pageInfo.endPage || 1}
                  onPageChange={handlePageChange}
                />
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}