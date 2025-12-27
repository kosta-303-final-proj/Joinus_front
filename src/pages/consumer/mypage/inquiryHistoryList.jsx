import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { getInquiryList } from '../../../services/csApi';

export default function InquiryHistoryList() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = parseInt(searchParams.get('page')) || 1;

  // 상태
  const [inquiryList, setInquiryList] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 날짜 포맷
  const formatDate = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    return date.toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });
  };

  // 데이터 로딩
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getInquiryList(currentPage);
        setInquiryList(data.inquiryList || []);
        setPageInfo(
          data.pageInfo || {
            curPage: 1,
            allPage: 1,
            startPage: 1,
            endPage: 1,
          }
        );
      } catch (e) {
        console.error('문의 내역 로딩 실패:', e);
        setError('문의 내역을 불러오는 중 오류가 발생했습니다.');
        setInquiryList([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [currentPage]);

  // 페이지 변경
  const handlePageChange = (page) => {
    setSearchParams({ page });
  };

  // 상세 이동 (마이페이지용 상세 라우트 사용)
  const handleInquiryClick = (id) => {
    navigate(`/mypage/inquiryDetail/${id}`);
  };

  // 페이징 컴포넌트
  const Pagination = ({
    currentPage,
    totalPages,
    startPage,
    endPage,
    onPageChange,
  }) => {
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
          {Array.from(
            { length: endPage - startPage + 1 },
            (_, i) => startPage + i
          ).map((page) => (
            <button
              key={page}
              className={`pagination-number ${currentPage === page ? 'active' : ''
                }`}
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
    <div className="inquiry-page"
    style={{padding:"40px 0"}}>
      <div className="inquiry-container"
        style={{
          maxWidth: "1220px",
          margin: "0 auto",
          background: "var(--color-white)",
          borderRadius: "var(--border-radius-md)",
          boxShadow: "var(--shadow-md)"
        }}>
        {/* 탭 없이 바로 리스트만 */}
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
                        <td
                          colSpan="4"
                          style={{ textAlign: 'center', padding: '20px' }}
                        >
                          문의 내역이 없습니다.
                        </td>
                      </tr>
                    ) : (
                      inquiryList.map((inquiry, index) => {
                        const rowNumber =
                          (pageInfo.allPage - currentPage) * 10 +
                          (inquiryList.length - index);
                        const status = inquiry.answer
                          ? '답변 완료'
                          : '답변 대기';
                        return (
                          <tr
                            key={inquiry.id}
                            onClick={() => handleInquiryClick(inquiry.id)}
                            style={{ cursor: 'pointer' }}
                          >
                            <td>{rowNumber}</td>
                            <td className="title-cell">
                              {inquiry.question || '제목 없음'}
                            </td>
                            <td>
                              <span
                                className={`status ${status === '답변 완료'
                                  ? 'completed'
                                  : 'pending'
                                  }`}
                              >
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

              <div className="inquiry-footer-section"
              style={{marginTop:"20px"}}>
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
      </div>
    </div >
  );
}
