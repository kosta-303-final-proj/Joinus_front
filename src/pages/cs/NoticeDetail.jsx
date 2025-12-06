import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import './NoticeDetail.css';
import { getNoticeDetail, getNoticeImageUrl } from '../../services/csApi';

export default function NoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getNoticeDetail(id);
        setNotice(data);
      } catch (error) {
        console.error('공지사항 조회 실패:', error);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  if (isLoading) return <div className="notice-detail-page"><div className="loading">로딩 중...</div></div>;
  if (error || !notice) return <div className="notice-detail-page"><div className="error">{error || '공지사항을 찾을 수 없습니다.'}</div></div>;

  return (
    <div className="notice-detail-page">
      <div className="notice-detail-container">
        {/* 헤더 */}
        <div className="detail-header">
          <h1 className="page-title">공지사항</h1>
          <button className="back-button" onClick={() => navigate('/cs/notice')}>
            ← 뒤로가기
          </button>
        </div>

        {/* 공지사항 등록 폼 내용 (읽기 전용) */}
        <div className="notice-form-section">
          <h2 className="section-title">공지사항 내용</h2>
          
          <div className="form-group-readonly">
            <label className="form-label">제목</label>
            <div className="form-value">{notice.title}</div>
          </div>

          <div className="form-group-readonly">
            <label className="form-label">본문</label>
            <div className="form-value content-value">{notice.content}</div>
          </div>

          {/* 이미지 첨부 */}
          {(notice.file1Id || notice.file2Id || notice.file3Id) && (
            <div className="form-group-readonly">
              <label className="form-label">이미지 첨부</label>
              <div className="image-list">
                {notice.file1Id && (
                  <div className="image-item">
                    <img src={getNoticeImageUrl(notice.file1Id)} alt="공지 이미지 1" />
                    <span className="image-name">이미지 1</span>
                  </div>
                )}
                {notice.file2Id && (
                  <div className="image-item">
                    <img src={getNoticeImageUrl(notice.file2Id)} alt="공지 이미지 2" />
                    <span className="image-name">이미지 2</span>
                  </div>
                )}
                {notice.file3Id && (
                  <div className="image-item">
                    <img src={getNoticeImageUrl(notice.file3Id)} alt="공지 이미지 3" />
                    <span className="image-name">이미지 3</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* 공지 목록 버튼 */}
        <div className="detail-footer">
          <button className="list-button" onClick={() => navigate('/cs/notice')}>
            공지 목록
          </button>
        </div>
      </div>
    </div>
  );
}