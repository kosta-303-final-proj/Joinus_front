import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Star, Users } from 'lucide-react';
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
  category,
  status = '진행중',
  // description,
  rating,
  currentParticipants,
  maxParticipants,
  deadlineTime,
  productId,
  isProposal = false,
  voteCount,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (productId) {
      if (isProposal) {
        navigate(`/proposalDetail/${productId}`);
      } else {
        navigate(`/gbProductDetail/${productId}`);
      }
    }
  };

  // 기존 participants 형식 파싱 (호환성)
  let current = currentParticipants;
  let max = maxParticipants;
  if (!current && !max && participants) {
    const match = participants.match(/(\d+)\s*명?\s*\/\s*목표\s*(\d+)/);
    if (match) {
      current = parseInt(match[1]);
      max = parseInt(match[2]);
    }
  }

  return (
    <Card 
      className="groupbuy-card" 
      style={{
        width: '240px', 
        boxShadow: '0 5px 20px rgba(88, 88, 88, 0.2)', 
        border: 'none',
        cursor: 'pointer'
      }} 
      onClick={handleClick}
    >
      {image && image !== '이미지' ? (
        <img 
          alt={title || '상품'} 
          src={image} 
          style={{ width: '100%', height: '200px', objectFit: 'cover' }}
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://picsum.photos/300/200';
          }}
        />
      ) : (
        <div style={{ width: '100%', height: '200px', backgroundColor: '#e0e0e0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ color: '#999' }}>이미지</span>
        </div>
      )}
      
      <CardBody>
        <CardTitle tag="h5" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
          {category && (
            <div style={{ border: '1px solid black', fontSize: '10px', padding: '5px' }}>
              {category}
            </div>
          )}
          {status && (
            <div style={{ 
              backgroundColor: status === '진행중' ? '#BBFFAC' : '#f0f0f0', 
              color: status === '진행중' ? '#0A8F30' : '#666', 
              fontSize: '10px', 
              padding: '5px' 
            }}>
              {status}
            </div>
          )}
        </CardTitle>

        <CardSubtitle className="mb-2 text-muted" tag="h6" style={{fontSize: '14px', marginBottom: '8px',display: '-webkit-box',WebkitLineClamp: 2,        // ★ 최대 2줄
            WebkitBoxOrient: 'vertical',overflow: 'hidden',textOverflow: 'ellipsis', }}>
          {title}
        </CardSubtitle>

        {/* {description && (
          <CardSubtitle style={{ fontSize: '12px', color: '#666', marginBottom: '12px', lineHeight: '1.4' }}>
            {description}
          </CardSubtitle>
        )} */}

        {price && (
          <div className="fw-bold" style={{ fontSize: '20px', marginBottom: '12px' }}>
            {price}
          </div>
        )}

        {/* 제안 카드인 경우 투표수 표시 */}
        {isProposal && voteCount !== undefined && (
          <CardSubtitle style={{ marginBottom: '8px' }}>
            <span style={{ fontSize: '12px', color: '#666' }}>투표수: {voteCount}개</span>
          </CardSubtitle>
        )}

        {rating && (
          <CardSubtitle style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <Star size={12} fill="#FFD700" color="#FFD700" style={{ marginRight: '5px' }} />
              <span style={{ fontSize: '12px' }}>{rating}</span>
            </div>
          </CardSubtitle>
        )}

        <CardSubtitle>
          <div style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
            {(current !== undefined && max !== undefined) && (
              <div style={{ display: 'flex', alignItems: 'center' }}>
                <Users size={15} style={{ marginRight: '5px' }} />
                <span style={{ fontSize: '12px' }}>참여 인원 : {current}/{max}</span>
              </div>
            )}
            {deadlineTime && (
              <div>
                <span style={{ color: 'red', fontSize: '10px' }}>{deadlineTime}</span>
              </div>
            )}
            {!deadlineTime && deadline && (
              <div>
                <span style={{ color: 'red', fontSize: '10px' }}>{deadline}</span>
              </div>
            )}
          </div>
        </CardSubtitle>
      </CardBody>
    </Card>
  );
}