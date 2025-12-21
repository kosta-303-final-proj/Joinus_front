import { Label,FormGroup,Button } from "reactstrap";
import { Link } from "react-router-dom";
import "../../../css/mypage/ReviewWrite.css";
import { useEffect, useState, useRef } from "react";
import { baseUrl, myAxios } from "../../../config";



export default function ReviewWrite() {
    const [reviewList, setReviewList] = useState([]);
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [rating, setRating] = useState(0); // 선택된 별점
    const [hoverRating, setHoverRating] = useState(0); // 마우스 오버 별점 (선택 안 한 상태)

    const openModal = (item) => {
        setSelectedItem(item);
        setImages([]);
        setContent("");
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };
    const fileInputRef = useRef(null);
    const [images, setImages] = useState([]);
    
    const [content, setContent] = useState("");

    const openFileDialog = () => {
    fileInputRef.current.click();
    };

    const handleFileChange = (e) => {
    const files = Array.from(e.target.files);

    

    if (images.length + files.length > 3) {
        alert("이미지는 최대 3장까지 가능합니다.");
        return;
    }

    setImages(prev => [...prev, ...files]);
    };


    //가져오는것임
    useEffect(() => {
        const fetchReviewList = async () => {
            try {
                const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
                const username = userInfo?.username;

                const res = await myAxios().get(
                    "/mypage/reviewListWrite",
                    { params: { username } }
                );

                setReviewList(res.data);
            } catch (error) {
                console.error("주문 목록 조회 실패", error);
            }
        };
        

        fetchReviewList();
    }, []);

    const submit = async () => {
        if (!content.trim()) {
        alert("리뷰 내용을 입력해주세요.");
        return;
        }

        const userInfo = JSON.parse(sessionStorage.getItem("userInfo"));
        const username = userInfo?.username;

        const formData = new FormData();
        formData.append("username", username);
        formData.append("orderItemId", selectedItem.id);
        formData.append("gbProductId", selectedItem.gbProductId);
        formData.append("rating", rating);
        formData.append("content", content);

        images.forEach(file => formData.append("images", file));

        try {
        await myAxios().post("/mypage/review", formData, {
            headers: { "Content-Type": "multipart/form-data" }
        });

        alert("리뷰 등록 완료");

        // ✅ 화면에서 작성한 리뷰 항목 제거
        setReviewList(prevList => prevList.filter(item => item.id !== selectedItem.id));
        closeModal();
        } catch (e) {
        console.error("리뷰 등록 실패", e);
        alert("리뷰 등록 실패");
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
            <div style={{ background: '#E5EEFF', padding: '5px 0' }}>
            <Label style={{ fontWeight: 'bold', margin: '0', width:'430px', textAlign:'center'}}>리뷰 작성</Label>
            </div>
            <div style={{ padding: '5px 0' }}><Link to="reviewWrited" style={{color:'black'}}>
            <Label style={{ fontWeight: 'bold', margin: '0',width:'430px', textAlign:'center' }}>나의 리뷰</Label>
            </Link>
            </div>
        </div>

        <hr style={{ width: '860px', marginTop: '0', border:'1px solid #000000'  }} />
        
        <hr style={{ width: '860px', margin: '0' }} />
        {reviewList.map(item => (
            <div className="reviewWrite" key={item.id}>
                <div className="reviewWrite">
                    <FormGroup check className="reviewItem">
                        <img src={`${baseUrl}/files/${item.thumbnail.fileName}`} alt="상품 이미지" className="reviewImg" />
                        <div>
                            <div className="reviewName" style={{fontSize:'12px'}}>{item.productName}</div>
                            <br/>
                            <div className="reviewData" style={{fontSize:'12px'}}>결제 날짜 {item.createdAt?.substring(0,10)}</div>
                        </div>
                        <div className="buttonGroup">
                            <Button size="sm" className="buttonPrimary" style={{width:'80px'}} onClick={() => openModal(item)} >리뷰 작성</Button>
                        </div>
                    </FormGroup>
                </div>
                <hr style={{ width: '860px', margin: '0'}} />
            </div>
        ))}
        
        
        {isModalOpen && (
        <ReviewModal
          item={selectedItem}
          images={images}
          setImages={setImages}
          content={content}
          setContent={setContent}
          onSubmit={submit}
          onClose={closeModal}
        />)}
    </>
  );
}


/* ---------------- 리뷰 작성 모달 ---------------- */

function ReviewModal({ item, images, setImages, content, setContent, onSubmit, onClose }) {
  const fileInputRef = useRef(null);

  // ⭐ 별점 상태를 모달 안에서 선언
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 3) {
      alert("이미지는 최대 3장까지 가능합니다.");
      return;
    }
    setImages(prev => [...prev, ...files]);
  };

  return (
    <>
      <div style={modalOverlay} onClick={onClose} />
      <div style={modalBox}>
        <div style={modalTop}>
          <b>리뷰 작성</b>
          <span style={closeBtn} onClick={onClose}>✕</span>
        </div>

        {/* ⭐ 별점 */}
        <div style={{ margin: "10px 0", fontWeight: "bold" }}>별점</div>
        <div style={{ display: "flex", gap: "5px" }}>
          {[1, 2, 3, 4, 5].map(star => (
            <img
              key={star}
              src={star <= rating ? "/star.png" : "/writeStar.png"}
              alt={`${star} 별`}
              style={{ width: "30px", height: "30px", cursor: "pointer" }}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>

        <div style={{ padding: "20px" }}>
          <b>{item?.productName}</b>

          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            placeholder="리뷰 내용을 입력해주세요."
            style={{ width: "100%", height: "120px", marginTop: "10px" }}
          />

          <input
            type="file"
            multiple
            accept="image/*"
            ref={fileInputRef}
            hidden
            onChange={handleFileChange}
          />

          <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
            {images.map((file, i) => (
              <img
                key={i}
                src={URL.createObjectURL(file)}
                style={{ width: "80px", height: "80px" }}
                alt=""
              />
            ))}
            {images.length < 3 && (
              <div style={imgBox} onClick={() => fileInputRef.current.click()}>+</div>
            )}
          </div>

          {/* ⭐ submit 시 rating 전달 */}
          <button style={submitBtn} onClick={() => onSubmit(rating)}>
            등록하기
          </button>
        </div>
      </div>
    </>
  );
}
/* ---------------- 스타일 ---------------- */

const modalOverlay = {
  position: "fixed",
  top: 0, left: 0,
  width: "100vw", height: "100vh",
  background: "rgba(0,0,0,0.5)",
  zIndex: 999
};

const modalBox = {
  position: "fixed",
  top: "50%", left: "50%",
  transform: "translate(-50%, -50%)",
  width: "420px",
  background: "#fff",
  borderRadius: "6px",
  zIndex: 1000
};

const modalTop = {
  background: "#f2f2f2",
  padding: "12px 15px",
  display: "flex",
  justifyContent: "space-between",
  fontSize: "16px"
};

const closeBtn = {
  cursor: "pointer",
  fontSize: "18px"
};

const imgBox = {
  width: "80px",
  height: "80px",
  border: "1px solid #aaa",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontSize: "30px",
  cursor: "pointer"
};

const submitBtn = {
  marginTop: "20px",
  width: "100%",
  background: "#5A83F7",
  color: "#fff",
  padding: "12px 0",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer"
};