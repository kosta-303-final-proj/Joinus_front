import { Label } from "reactstrap";
import { Link, useParams, Outlet } from "react-router-dom";
import { useEffect, useState } from "react";
import { myAxios, baseUrl } from "../../../config";

export default function Reviews() {
    const { id } = useParams();
    const [reviews, setReviews] = useState([]);

    const getReview = () => {
        myAxios().get(`/getReviewList/${id}`) // GET 파라미터로 id 전달
            .then(res => {
                console.log(res);
                setReviews(res.data);
            })
            .catch(err => {
                console.log(err);
            });
    };

    useEffect(() => {
        getReview();
    }, [id]);

    const renderStars = (rating) => {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (i <= rating) stars.push(<img key={i} src="/star.png" style={{ width: "20px" }} />);
            else stars.push(<img key={i} src="/whStar.png" style={{ width: "20px" }} />);
        }
        return stars;
    };
    // const renderStars = (rating) => {
    //     return Array.from({ length: 5 }, (_, index) => (
    //         <img
    //             key={index}
    //             src={index < rating ? "/star.png" : "/whStar.png"}
    //             alt="star"
    //             style={{ width: "20px" }}
    //         />
    //     ));
    // };

    return (
        <>
            <div>
                <div style={styles.pageWrapper}>
                    <div style={styles.container}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '860px' }}>
                            <div style={{ padding: '5px 0' }}>
                                <Link to={`/gbProductDetail/${id}/detailInfo`} style={{ color: 'black' }}>
                                    <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>상품 설명</Label>
                                </Link>
                            </div>
                            <div style={{ background: '#E5EEFF', padding: '5px 0' }}>
                                <Link to={`/gbProductDetail/${id}/reviews`} style={{ color: 'black' }}>
                                    <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>리뷰</Label>
                                </Link>
                            </div>
                            <div style={{ padding: '5px 0' }}>
                                <Link to={`/gbProductDetail/${id}/qAndA`} style={{ color: 'black' }}>
                                    <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>Q & A</Label>
                                </Link>
                            </div>
                            <div style={{ padding: '5px 0' }}>
                                <Link to={`/gbProductDetail/${id}/policy`} style={{ color: 'black' }}>
                                    <Label style={{ fontWeight: 'bold', margin: '0', width: '255px', textAlign: 'center' }}>배송/환불 규칙</Label>
                                </Link>
                            </div>
                        </div>
                        <hr style={{ marginTop: '0' }} />
                    </div>
                </div>

                <div style={styles.pageWrapper}>
                    <div style={styles.container}>
                        <div style={{ padding: "0 20px", display: 'flex', gap: '10px' }}>
                            <div>최신순</div>
                            <div>평점 높은 순</div>
                            <div>평점 낮음 순</div>
                        </div>
                        <hr />

                        {reviews.length === 0 && <div style={{ padding: "20px" }}>리뷰가 없습니다.</div>}

                        {reviews.map((review) => (
                            <div key={review.id}>
                                <div style={{ padding: "0 20px" }}>
                                    <div className="fw-bold" style={{ fontSize: '16px' }}>{review.memberUsername}</div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                                        {renderStars(review.rating)}
                                        <div>{new Date(review.createdAt).toLocaleDateString()}</div>
                                    </div>
                                </div>
                                <div style={{ padding: "0 20px", marginTop: '5px' }}>{review.content}</div>

                                {/* 리뷰 이미지 */}
                                <div style={{ display: 'flex', gap: '10px', padding: '0 20px', marginTop: '10px' }}>{console.log("리뷰 이미지1 URL:", baseUrl + review.fileName)}
                                    {review.image1Path && (
                                        <img src={`${baseUrl}/review/image/${review.image1Path}`}
                                            alt="리뷰이미지1" 
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px',marginRight:'30px' }} 
                                        />
                                    )}
                                    {review.image2Path && (
                                        <img 
                                            src={`${baseUrl}/review/image/${review.image2Path}`} 
                                            alt="리뷰이미지2" 
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px',marginRight:'30px' }} 
                                        />
                                    )}
                                    {review.image3Path && (
                                        <img 
                                            src={`${baseUrl}/review/image/${review.image3Path}`} 
                                            alt="리뷰이미지3" 
                                            style={{ width: '120px', height: '120px', objectFit: 'cover', borderRadius: '4px',marginRight:'30px' }} 
                                        />
                                    )}
                                </div>

                                <hr style={{ marginTop: '20px' }} />
                            </div>
                        ))}
                    </div>
                </div>

                <Outlet context={{ id }} />
            </div>
        </>
    );
}

const styles = {
  pageWrapper: {
    display: "flex",
    justifyContent: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  container: {
    width: "1020px",
    padding: "20px 0",
  },
  container2: {
    width: "1020px",
    padding: "0 20px",
  },

  // 전체 폭 hr
  fullWidthHr: {
  width: "100%",
  margin: "0",
},

  imageGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "10px",
    marginTop: "10px",
  },
  imageBox: {
    border: "1px dashed #bbb",
    height: "140px",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "4px",
    position: "relative",
    cursor: "pointer",
    overflow: "hidden",
    backgroundColor: "#fafafa",
  },
  fileInput: {
    position: "absolute",
    width: "100%",
    height: "100%",
    opacity: 0,
    cursor: "pointer",
  },
  preview: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },

  tag: {
    backgroundColor: "#E7EBF3",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "14px",
    cursor: "pointer",
    },

tagWhite: {
  backgroundColor: "#FFFFFF",
  border: "1px solid #CED4DA",
  padding: "5px 12px",
  borderRadius: "20px",
  fontSize: "14px",
  cursor: "pointer",
}
};