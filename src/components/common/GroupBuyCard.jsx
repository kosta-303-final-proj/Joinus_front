import { Card, CardBody, CardTitle, CardSubtitle } from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import { Star, Users, Heart } from 'lucide-react';
import { useState, useEffect } from 'react';
import { myAxios } from '../../config';
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
  rating,
  currentParticipants,
  maxParticipants,
  deadlineTime,
  productId,
  isProposal = false,
  voteCount,
  showParticipants = true,
}) {
  const navigate = useNavigate();
  const [isHeart, setIsHeart] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // 초기 하트 상태 로드
  useEffect(() => {
    if (!isProposal && productId) {
      const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
      const username = userInfo.username;

      if (username) {
        myAxios()
          .get("/product/productHeart/status", {
            params: { productId, username }
          })
          .then(res => {
            setIsHeart(res.data.isHeart);
            setWishCount(res.data.wishCount);
          })
          .catch(err => console.log(err));
      }
    }
  }, [productId, isProposal]);

  // Toast 표시 함수
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 2000);
  };

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

  // 하트 클릭 핸들러
  const handleHeartClick = (e) => {
    e.stopPropagation(); // 카드 클릭 이벤트 방지

    const userInfo = JSON.parse(sessionStorage.getItem("userInfo") || "{}");
    const username = userInfo.username;

    if (!username) {
      alert("로그인이 필요합니다.");
      return;
    }

    myAxios()
      .get("/product/productHeart", {
        params: { username, gbProductId: productId }
      })
      .then(res => {
        setIsHeart(res.data.isHeart);
        setWishCount(res.data.wishCount);

        // Toast 메시지 표시
        if (res.data.isHeart) {
          showToastMessage('관심상품에 추가되었습니다.');
        } else {
          showToastMessage('관심상품에서 삭제되었습니다.');
        }
      })
      .catch(err => {
        console.log(err);
        alert("찜하기에 실패했습니다.");
      });
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

    <>
      {/* Toast 메시지 */}
      {showToast && (
        <div style={{
          position: 'fixed',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          zIndex: 9999,
          animation: 'fadeIn 0.3s ease-out'
        }}>
          <div style={{
            width: '140px',
            height: '140px',
            borderRadius: '50%',
            backgroundColor: isHeart ? 'rgba(197, 217, 255, 0.85)' : 'rgba(153, 153, 153, 0.85)',
            //backgroundColor: isHeart ? 'rgba(115, 159, 242, 0.85)' : 'rgba(153, 153, 153, 0.85)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
            gap: '8px'
          }}>
            <Heart
              size={50}
              fill={isHeart ? "white" : "none"}
              color="white"
              strokeWidth={2}
            />
            <span style={{
              color: 'white',
              fontSize: '16px',
              fontWeight: '700'
            }}>
              {isHeart ? '좋아요' : '취소'}
            </span>
          </div>
        </div>
      )}
      <Card
        className="groupbuy-card"
        style={{
          width: '250px',
          boxShadow: '0 5px 20px rgba(88, 88, 88, 0.2)',
          border: 'none',
          cursor: 'pointer',
          position: 'relative'
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
              <div style={{ fontSize: '10px', padding: '5px 0', color: '#555' }}>
                {category}
              </div>
            )}
            {/* status 주석 처리 */}
            {/* {status && (
            <div style={{ 
              backgroundColor: status === '진행중' ? '#BBFFAC' : '#f0f0f0', 
              color: status === '진행중' ? '#0A8F30' : '#555', 
              fontSize: '10px', 
              padding: '5px' ,
              borderRadius: '16px'
            }}>
              {status}
            </div>
          )} */}

            {/* 하트 버튼 */}
            {!isProposal && (
              <div
                onClick={handleHeartClick}
                style={{
                  //position: 'absolute',
                  // top: '12px',
                  // right: '12px',
                  // width: '36px',
                  // height: '36px',
                  // borderRadius: '50%',
                  // backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  // display: 'flex',
                  // alignItems: 'center',
                  // justifyContent: 'center',
                  cursor: 'pointer',
                  //zIndex: 10,
                  //boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.15)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Heart
                  size={20}
                  fill={isHeart ? "#739FF2" : "none"}
                  // color={isHeart ? "#ff4444" : "#666"}
                  color="#739FF2"
                  strokeWidth={2}
                />
              </div>
            )}
          </CardTitle>

          <CardSubtitle className="mb-2 text-muted" tag="h6" style={{ fontSize: '14px', marginBottom: '8px', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis', }}>
            {title}
          </CardSubtitle>

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

          <CardSubtitle>
            <div style={{ justifyContent: 'space-between', display: 'flex', alignItems: 'center' }}>
              {showParticipants && (current !== undefined && max !== undefined) && (
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Users size={15} style={{ marginRight: '5px' }} />
                  <span style={{ fontSize: '12px' }}>참여 인원 : {current}/{max}</span>
                </div>
              )}

              {deadlineTime && <div><span style={{ color: 'red', fontSize: '10px' }}>{deadlineTime}</span></div>}
              {!deadlineTime && deadline && <div><span style={{ color: 'red', fontSize: '10px' }}>{deadline}</span></div>}
            </div>
          </CardSubtitle>
        </CardBody>
      </Card>
      <style>{`
  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translate(-50%, -50%) scale(0.8);
    }
    to {
      opacity: 1;
      transform: translate(-50%, -50%) scale(1);
    }
  }
`}</style>
    </>
  );
}