import { baseUrl } from '../config';

/**
 * 백엔드 ProposalDto를 프론트엔드 형식으로 변환
 */
export const transformProposal = (proposal) => {
  return {
    id: proposal.id,
    title: proposal.productName,  // productName → title
    category: proposal.category,
    status: '진행중',  // 제안은 항상 진행중
    description: proposal.description,
    price: formatPrice(proposal.originalPrice),  // originalPrice → price (포맷팅)
    rating: null,  // 제안은 평점 없음
    currentParticipants: proposal.voteCount || 0,  // voteCount → currentParticipants
    voteCount: proposal.voteCount || 0, // 명시적으로 투표수 전달
    maxParticipants: proposal.minPart || 0,  // minPart → maxParticipants
    deadlineTime: null,  // 제안은 마감일 없음
    badge: (proposal.voteCount >= 50) ? 'HOT' : null,  // HOT 배지 계산
    image: proposal.imageUrl ? `${baseUrl}/imageView?filename=${proposal.imageUrl}` : null,  // 이미지 URL
    isProposal: true
  };
};

/**
 * 백엔드 GbProductDto를 프론트엔드 형식으로 변환
 */
export const transformGbProduct = (product) => {
  return {
    id: product.id,
    title: product.name,  // name → title
    category: product.categoryName || '기타',  // categoryName 사용
    status: '진행중',  // ONGOING 상태
    description: product.description,
    price: formatPrice(product.price),  // price 포맷팅
    rating: null,  // 평점은 추후 구현
    currentParticipants: product.participants || 0,  // participants → currentParticipants
    maxParticipants: product.minParticipants || 0,  // minParticipants → maxParticipants
    deadlineTime: calculateDeadlineTime(product.endDate),  // endDate → deadlineTime 계산
    badge: (product.participants >= 100) ? 'HOT' : null,  // HOT 배지 계산
    image: product.thumbnailFileName ? `${baseUrl}/gbProductImageView?filename=${product.thumbnailFileName}` : null,  // 이미지 URL
    isProposal: false
  };
};

/**
 * 가격 포맷팅 (예: 13900 → "13,900원")
 */
const formatPrice = (price) => {
  if (!price) return '가격 정보 없음';
  return new Intl.NumberFormat('ko-KR').format(price) + '원';
};

/**
 * 마감 시간 계산 (예: "12시간", "3일")
 */
const calculateDeadlineTime = (endDate) => {
  if (!endDate) return null;
  
  const now = new Date();
  const end = new Date(endDate);
  const diffMs = end - now;
  
  if (diffMs < 0) return '마감됨';
  
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHours < 24) {
    return `${diffHours}시간`;
  } else {
    const diffDays = Math.floor(diffHours / 24);
    return `${diffDays}일`;
  }
};

