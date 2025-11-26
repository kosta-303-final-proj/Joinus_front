import './GroupBuyCard.css';

export default function GroupBuyCard({ 
  image = '이미지',
  title,
  participants,
  price,
  deadline,
  progress,
  badge,
  onClick,
}) {
  return (
    <article className="groupbuy-card" onClick={onClick} style={{ cursor: onClick ? 'pointer' : 'deefault'}}>
      {/* 카드 이미지 */}
      <div className="card-image">
      {image && image !== '이미지' ? (
        <img src={image} alt={title} className="card-image-img" />
      ) : (
        <span className="image-placeholder">이미지</span>
      )}
      {badge && (
        <span className={`badge badge-${badge.toLowerCase()}`}>
          {badge}
        </span>
      )}
      </div>

      {/* 카드 정보 */}
      <div className="card-info">
        <h3 className="card-title">{title}</h3>
        
        <p className="card-participants">{participants}</p>
        
        {/* 진행률 바 (있을 경우만) */}
        {progress !== undefined && (
          <div className="card-progress-section">
            <div className="card-progress-bar">
              <div
                className="card-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="card-progress-text">{progress}%</span>
          </div>
        )}
        
        {price && <p className="card-price">{price}</p>}
        {deadline && <p className="card-deadline">{deadline}</p>}
      </div>
    </article>
  );
}

