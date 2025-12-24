import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { myAxios } from '../../config';
import AdminHeader from '../../components/layout/AdminHeader';
import { X, Plus } from 'lucide-react';
import '../../styles/components/button.css';
import './admin-common.css';
import './NoticeForm.css';

const NoticeForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = !!id;

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    files: []
  });

  const [filePreviews, setFilePreviews] = useState([]);

  // 이미지 판별
  const checkIsImage = (type, name) => {
    if (type && type.startsWith('image/')) return true;
    return /\.(jpg|jpeg|png|gif|webp)$/i.test(name);
  };

  // 기존 파일 로드
  const loadExistingFiles = useCallback(async (fileIds) => {
    const previews = [];
    for (const fileId of fileIds) {
      try {
        const response = await myAxios().get(`/file/view/${fileId}`, {
          responseType: 'blob'
        });

        const blob = response.data;

        let fileName = `file_${fileId}`;
        const contentDisposition = response.headers['content-disposition'];
        if (contentDisposition) {
          const fileNameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
          if (fileNameMatch && fileNameMatch[1]) {
            fileName = decodeURIComponent(fileNameMatch[1].replace(/['"]/g, ''));
          }
        }

        let finalType = blob.type;
        if (fileName.match(/\.(jpg|jpeg|png|gif|webp|svg)$/i)) {
          finalType = 'image/' + fileName.split('.').pop().toLowerCase().replace('jpg', 'jpeg');
        }

        const correctedBlob = new Blob([blob], { type: finalType });
        const url = URL.createObjectURL(correctedBlob);

        previews.push({
          url: url,
          type: finalType,
          name: fileName,
          size: blob.size,
          isExisting: true,
          fileId: fileId
        });
      } catch (error) {
        console.error(`기존 파일(ID: ${fileId}) 로드 실패:`, error);
      }
    }
    setFilePreviews(previews);
  }, []);

  useEffect(() => {
    if (isEdit) {
      const fetchNotice = async () => {
        try {
          const response = await myAxios().get(`/admin/noticeDetail/${id}`);
          const data = response.data;

          setFormData({
            title: data.title,
            content: data.content,
            files: []
          });

          const fileIds = [data.image1FileId, data.image2FileId, data.image3FileId]
            .filter(id => id !== null && id !== undefined);

          if (fileIds.length > 0) {
            await loadExistingFiles(fileIds);
          }
        } catch (error) {
          console.error("데이터 로드 실패:", error);
        }
      };
      fetchNotice();
    }
  }, [id, isEdit, loadExistingFiles]);

  useEffect(() => {
    return () => {
      filePreviews.forEach(preview => {
        if (preview.url && !preview.isExisting) URL.revokeObjectURL(preview.url);
      });
    };
  }, [filePreviews]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const newFiles = Array.from(e.target.files);
    if (filePreviews.length + newFiles.length > 3) {
      alert("파일은 최대 3개까지만 가능합니다.");
      return;
    }

    const newPreviews = newFiles.map(file => ({
      url: URL.createObjectURL(file),
      type: file.type,
      name: file.name,
      size: file.size,
      isExisting: false
    }));

    setFilePreviews(prev => [...prev, ...newPreviews]);
    setFormData(prev => ({ ...prev, files: [...prev.files, ...newFiles] }));
    e.target.value = '';
  };

  const handleRemoveFile = (index) => {
    const target = filePreviews[index];
    if (!target.isExisting) {
      const newFileIndex = filePreviews.filter((p, i) => i < index && !p.isExisting).length;
      setFormData(prev => ({
        ...prev,
        files: prev.files.filter((_, i) => i !== newFileIndex)
      }));
    }
    setFilePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!formData.title.trim()) return alert("제목을 입력하세요.");
    if (!formData.content.trim()) return alert("내용을 입력하세요.");

    const data = new FormData();
    data.append('title', formData.title);
    data.append('content', formData.content);

    filePreviews
      .filter(p => p.isExisting)
      .forEach(p => data.append('existingFileIds', p.fileId));

    formData.files.forEach(file => data.append('images', file));

    try {
      const url = isEdit ? `/admin/noticeUpdate/${id}` : '/admin/noticeForm';
      await myAxios().post(url, data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      alert(isEdit ? "수정되었습니다." : "등록되었습니다.");
      navigate('/admin/noticeList');
    } catch (error) {
      console.error('처리 실패:', error);
      alert("처리 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="admin-layout">
      <div className="main-content">
        <AdminHeader title={isEdit ? "공지사항 수정" : "공지사항 등록"} />
        
        <div className="content-area">
          <div className="form-container">
            
            {/* 제목 */}
            <div className="form-group">
              <label className="form-label">제목</label>
              <input
                name="title"
                className="form-input"
                placeholder="제목을 입력하세요"
                value={formData.title}
                onChange={handleChange}
              />
            </div>

            {/* 본문 */}
            <div className="form-group">
              <label className="form-label">본문</label>
              <textarea
                name="content"
                className="form-textarea"
                placeholder="내용을 입력하세요"
                value={formData.content}
                onChange={handleChange}
                rows={12}
              />
            </div>

            {/* 이미지 첨부 */}
            <div className="form-group">
              <label className="form-label">이미지 첨부</label>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: '16px',
                marginTop: '12px'
              }}>
                {/* 기존/신규 이미지 미리보기 */}
                {filePreviews.map((preview, index) => (
                  <div
                    key={index}
                    style={{
                      position: 'relative',
                      width: '100%',
                      paddingTop: '100%', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      overflow: 'hidden',
                      backgroundColor: '#f9fafb'
                    }}
                  >
                    {/* 절대 위치로 내용 채우기 */}
                    <div style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      padding: '8px'
                    }}>
                      <img
                        src={preview.url}
                        alt="미리보기"
                        style={{
                          maxWidth: '100%',
                          maxHeight: '100%',
                          objectFit: 'contain' 
                        }}
                      />
                    </div>

                    {/* 기존 파일 뱃지 */}
                    {preview.isExisting && (
                      <span style={{
                        position: 'absolute',
                        top: '8px',
                        left: '8px',
                        backgroundColor: '#3b82f6',
                        color: 'white',
                        fontSize: '10px',
                        padding: '4px 8px',
                        borderRadius: '4px',
                        fontWeight: '600'
                      }}>
                        기존
                      </span>
                    )}

                    {/* 삭제 버튼 */}
                    <button
                      onClick={() => handleRemoveFile(index)}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        border: 'none',
                        backgroundColor: 'rgba(239, 68, 68, 0.9)',
                        color: 'white',
                        borderRadius: '50%',
                        cursor: 'pointer',
                        width: '28px',
                        height: '28px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        transition: 'all 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#dc2626'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'rgba(239, 68, 68, 0.9)'}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ))}

                {/* ✅ 추가 버튼 (3개 미만일 때) */}
                {filePreviews.length < 3 && (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    paddingTop: '100%',
                    border: '2px dashed #d1d5db',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    backgroundColor: '#fafafa',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#3b82f6';
                    e.currentTarget.style.backgroundColor = '#eff6ff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#d1d5db';
                    e.currentTarget.style.backgroundColor = '#fafafa';
                  }}
                  >
                    <input
                      type="file"
                      id="file-upload"
                      accept="image/*"
                      multiple
                      onChange={handleFileChange}
                      style={{
                        position: 'absolute',
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                        top: 0,
                        left: 0
                      }}
                    />
                    <label
                      htmlFor="file-upload"
                      style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        bottom: 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                    >
                      <Plus size={32} color="#9ca3af" />
                      <span style={{
                        fontSize: '13px',
                        color: '#6b7280',
                        marginTop: '8px'
                      }}>
                        이미지 추가
                      </span>
                    </label>
                  </div>
                )}
              </div>
            </div>

            {/* 버튼 */}
            <div className="form-actions">
              <button
                className="notice-button secondary"
                onClick={() => navigate('/admin/noticeList')}
              >
                취소
              </button>
              <button
                className="notice-button primary"
                onClick={handleSubmit}
              >
                {isEdit ? "수정" : "등록"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NoticeForm;