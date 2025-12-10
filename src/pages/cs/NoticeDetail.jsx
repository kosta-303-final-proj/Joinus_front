import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useMemo, useState } from 'react';
import './NoticeDetail.css';
import { getNoticeDetail, getNoticeImageUrl } from '../../services/csApi';

export default function NoticeDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [notice, setNotice] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchNotice = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getNoticeDetail(id);
        setNotice(data);
      } catch (err) {
        console.error('공지사항 조회 실패:', err);
        setError('공지사항을 불러오는 중 오류가 발생했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchNotice();
  }, [id]);

  const formattedDate = useMemo(() => {
    if (!notice?.createdAt) return '';
    try {
      return new Date(notice.createdAt).toLocaleString();
    } catch {
      return '';
    }
  }, [notice]);

  if (isLoading) {
    return (
      <div className="notice-detail-page">
        <div className="card skeleton-card">
          <div className="skeleton title" />
          <div className="skeleton meta" />
          <div className="skeleton body" />
        </div>
      </div>
    );
  }

  if (error || !notice) {
    return (
      <div className="notice-detail-page">
        <div className="card error-card">
          {error || '공지사항을 찾을 수 없습니다.'}
        </div>
      </div>
    );
  }

  const imageIds = [notice.file1Id, notice.file2Id, notice.file3Id].filter(Boolean);

  return (
    <div className="notice-detail-page">
      <div className="notice-detail-container">
        <div className="detail-header">
          <div>
            <h1 className="page-title">{notice.title}</h1>
            {formattedDate && <span className="meta">{formattedDate}</span>}
          </div>
        </div>

        <div className="card">
          <div className="notice-content">
            <p className="content-text">{notice.content}</p>
          </div>

          {imageIds.length > 0 && (
            <div className="image-section">
              <div className="section-title-row">
                <h3 className="section-title">첨부 이미지</h3>
              </div>
              <div className="image-grid">
                {imageIds.map((fileId) => (
                  <button
                    key={fileId}
                    type="button"
                    className="image-card"
                    onClick={() => setSelectedImageId(fileId)}
                  >
                    <img src={getNoticeImageUrl(fileId)} alt={`공지 이미지 ${fileId}`} />
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="detail-footer">
          <button className="list-button" onClick={() => navigate('/cs/notice')}>
            공지 목록 보기
          </button>
        </div>
      </div>

      {selectedImageId && (
        <div
          className="image-modal-backdrop"
          onClick={() => setSelectedImageId(null)}
          role="presentation"
        >
          <div
            className="image-modal"
            role="presentation"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              className="close-button"
              type="button"
              onClick={() => setSelectedImageId(null)}
            >
              ✕
            </button>
            <img src={getNoticeImageUrl(selectedImageId)} alt="확대된 이미지" />
          </div>
        </div>
      )}
    </div>
  );
}