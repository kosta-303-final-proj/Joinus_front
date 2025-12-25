import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { ThumbsUp } from 'lucide-react';
import './ProposalCard.css';

export default function ProposalCard({ 
  image = '이미지',
  title,
  price,
  category,
  voteCount = 0,
  productId,
  onClick,
}) {
  const navigate = useNavigate();

  const handleClick = () => {
    if (onClick) {
      onClick();
    } else if (productId) {
      navigate(`/proposalDetail/${productId}`);
    }
  };

  return (
    <Card 
      className="proposal-card" 
      onClick={handleClick}
    >
      {image && image !== '이미지' ? (
        <img 
          alt={title || '제안'} 
          src={image} 
          className="proposal-card-image"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://picsum.photos/300/200';
          }}
        />
      ) : (
        <div className="proposal-card-image-placeholder">
          <span>이미지</span>
        </div>
      )}
      
      <CardBody className="proposal-card-body">
        <CardTitle tag="h5" className="proposal-card-header">
          {category && (
            <div className="proposal-category-badge">
              {category}
            </div>
          )}
          {status && (
            <div className={`proposal-status-badge ${status !== '진행중' ? 'completed' : ''}`}>
              {status}
            </div>
          )}
        </CardTitle>

        <CardSubtitle className="proposal-card-title">
          {title}
        </CardSubtitle>

        {price && (
          <div className="proposal-card-price">
            {price}
          </div>
        )}

        <div className="proposal-card-footer">
          <div className="proposal-vote-count">
            <ThumbsUp size={16} />
            <span>투표 인원 : {voteCount}명</span>
          </div>
        </div>
      </CardBody>
    </Card>
  );
}