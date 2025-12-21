import { Label,FormGroup,Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../../../css/mypage/ReviewWrited.css";
import { useState,useEffect } from "react";
import { baseUrl, myAxios } from "../../../config";


export default function ReviewWrited() {
    const [ reviewList, setReviewList ] = useState([]);

     useEffect(() => {
        const fetchReviewList = async () => {
          try {
            const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            const username = userInfo?.username;

            const response = await myAxios().get(`/mypage/getReviewList`, {
              params: { username }
            });
            setReviewList(response.data);
          } catch (error) {
            console.error("리뷰 조회 실패", error);
          }
        };
        fetchReviewList();
    }, []);

    const deleteReview = async (reviewId) => {
        try {
            const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
            const username = userInfo?.username;

            await myAxios().post("/mypage/deleteReview", {
            id: reviewId,
            memberUsername: username
            });

            // 🔥 화면 즉시 반영
            setReviewList(prev => prev.filter(review => review.id !== reviewId));

        } catch (error) {
            console.error("삭제 실패", error);
            alert("삭제 실패");
        }
    };




    return (
    <>
        <hr style={{ width: '860px', marginBottom: '0', border:'1px solid #000000' }} />

        <div
            style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            width: '860px',
            }}
        >
            <div style={{  padding: '5px 0' }}><Link to="/mypage/reviewManage" style={{color:'black'}}>
            <Label style={{ fontWeight: 'bold', margin: '0', width:'430px', textAlign:'center'}}>리뷰 작성</Label>
            </Link>
            </div>
            <div style={{background: '#E5EEFF', padding: '5px 0' }}>
            <Label style={{ fontWeight: 'bold', margin: '0',width:'430px', textAlign:'center' }}>나의 리뷰</Label>
            </div>
        </div>

        <hr style={{ width: '860px', marginTop: '0', border:'1px solid #000000' }} />
        
        <hr style={{ width: '860px', margin: '0' }} />
        {reviewList.map(review => (
            <div className="reviewWrite" key={review.id}>
                <div className="reviewWrite">
                <FormGroup check className="reviewItem">
                    <img src={`${baseUrl.replace(/\/$/, "")}${review.thumbnailUrl}`} alt="상품 이미지" className="reviewImg" />
                    <div>
                        <div className="reviewName" style={{fontSize:'12px'}}>{review.gbProductName}</div>
                        <br/>
                        <div className="reviewData" style={{fontSize:'12px'}}>{review.content}</div>
                    </div>
                    <div className="buttonGroup">
                        <Button size="sm" className="buttonPrimary" style={{width:'80px'}} onClick={() => deleteReview(review.id)}>삭제</Button>
                    </div>
                </FormGroup>
            </div>
            <hr style={{ width: '860px', marginTop: '0' }} />
        </div>
        ))}
        
    </>
  );
}
