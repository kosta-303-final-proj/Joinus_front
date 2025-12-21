import "bootstrap/dist/css/bootstrap.min.css";
import { Label,FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import { useEffect, useState } from "react";
import { myAxios, baseUrl } from "../../../config";
import { useNavigate } from "react-router-dom";

export default function InterestList() {
//     // 로그인 유저 정보 (추가)
const userInfo =
  JSON.parse(sessionStorage.getItem("userInfo")) ||
  JSON.parse(localStorage.getItem("userInfo"));
const username = userInfo?.username;

const [timeLeftMap, setTimeLeftMap] = useState({});

  // 로그인 유저 정보
  // const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  // const username = userInfo?.username;

  const [interestList, setInterestList] = useState([]);
  const [checkedItems, setCheckedItems] = useState({});
  const [allChecked, setAllChecked] = useState(false);

  // ⭐ 페이징 상태
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const size = 10;

  const navigate = useNavigate();

  // 전체 선택
  const handleAllCheck = () => {
    const newAllChecked = !allChecked;
    setAllChecked(newAllChecked);

    const updatedChecked = {};
    interestList.forEach(item => {
      updatedChecked[item.id] = newAllChecked;
    });

    setCheckedItems(updatedChecked);
  };

  // 개별 선택
  const handleItemCheck = (id) => {
    const updatedChecked = {
      ...checkedItems,
      [id]: !checkedItems[id]
    };

    setCheckedItems(updatedChecked);

    const allSelected = interestList.every(
      item => updatedChecked[item.id]
    );
    setAllChecked(allSelected);
  };

  // 관심상품 조회 (페이징)
  useEffect(() => {
    const fetchInterestList = async () => {
      try {
        const response = await myAxios().get("/interestList", {
          params: {
            username,
            page,
            size
          }
        });

        const data = response.data;

        // Page 객체 대응
        setInterestList(data?.content ?? []);
        setTotalPages(data?.totalPages ?? 0);

        setCheckedItems({});
        setAllChecked(false);

      } catch (error) {
        console.error("관심상품 조회 실패", error);
      }
    };

    if (username) fetchInterestList();
  }, [username, page]);

  // 개별 삭제
  const deleteInterest = async (id) => {
    try {
      await myAxios().post("/deleteWish", { id, username });
      setInterestList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
      console.error("관심상품 삭제 실패", error);
    }
  };

  // 선택 삭제
  const deleteSelected = async () => {
    const selectedIds = Object.keys(checkedItems).filter(
      id => checkedItems[id]
    );

    if (selectedIds.length === 0) {
      alert("선택된 항목이 없습니다.");
      return;
    }

    try {
      await Promise.all(
        selectedIds.map(id =>
          myAxios().post("/deleteAllWish", { id, username })
        )
      );

      setInterestList(prev =>
        prev.filter(item => !selectedIds.includes(String(item.id)))
      );

    } catch (error) {
      console.error("선택 삭제 실패", error);
    }
  };
  
const parseEndDate = (endDate) => {
  if (!endDate) return null;

  // ✅ Timestamp 객체 대응
  if (typeof endDate === "object" && endDate.time) {
    return endDate.time;
  }

  // 문자열일 경우도 대비
  if (typeof endDate === "string") {
    return new Date(endDate.replace(" ", "T")).getTime();
  }

  return null;
};

useEffect(() => {
  if (interestList.length === 0) return;

  const interval = setInterval(() => {
    const now = Date.now();
    const updated = {};

    interestList.forEach(item => {
      const endTime = parseEndDate(item.product?.endDate);

      if (!endTime) {
        updated[item.id] = "날짜 없음";
        return;
      }

      const distance = endTime - now;

      if (distance <= 0) {
        updated[item.id] = "종료";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((distance / (1000 * 60)) % 60);
      const seconds = Math.floor((distance / 1000) % 60);

      updated[item.id] =
        `${days}일 ${hours}시간 ${minutes}분 ${seconds}초`;
    });

    setTimeLeftMap(updated);
  }, 1000);

  return () => clearInterval(interval);
}, [interestList]);


  return (
    <>
        <div className="fw-bold d-block" style={{ fontSize: "20px", margin: "20px auto" }}>관심상품</div>
        <div style={{width:'860px',}}>
        <hr style={{ margin: "5px auto" }} />
        <FormGroup check style={{display: "flex",justifyContent: "space-between",alignItems: "center"}}>
          {/* 전체선택 */}
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <Input type="checkbox" checked={allChecked} onChange={handleAllCheck}  />
            <Label check style={{ margin: 0, fontSize: "12px" }}>
              전체 선택
            </Label>
          </div>

          {/* 헤더 */}
          <div style={{ display: "flex", gap: "15px", alignItems: "center" }}>
            <Label style={{ color: "black", fontSize: "12px", margin: "0 500px 0 0 " }}>상품명</Label>
            <Label style={{ color: "black", fontSize: "12px", margin: "0 35px 0 0" }}>마감날짜</Label>
            <Label style={{ color: "black", fontSize: "12px", margin: "0 35px 0 0" }}>주문</Label>
          </div>
        </FormGroup>
        <hr style={{ margin: "5px auto 0 auto" }} />

        {/* 상품 리스트 */}
        {interestList.map(item => (
            <div key={item.id}>
            <FormGroup check style={{ display: "flex", height: "120px", alignItems: "center" }}>
                <Input type="checkbox" style={{ marginRight: "30px" }}
                checked={checkedItems[item.id] || false}
                onChange={() => handleItemCheck(item.id)}
                 />
                {/* 상품 이미지 */}
                <div onClick={()=> navigate(`/gbProductDetail/${item.product?.id}`)} style={{display:'flex', justifyContent:'center', alignItems:'center',cursor: 'pointer'}}>
                <img
                     src={`${baseUrl}/file/gbProduct/${item.product?.thumbnail?.fileName}`}
                    style={{ width: "70px", height: "70px", marginRight: "20px" }}
                />

                {/* 상품명 */}
                <div style={{ fontSize: "12px", width: "400px", marginRight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.product?.name}
                </div>
                </div>
                <div style={{ fontSize: "12px", color: "red", minWidth: "100px", marginRight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {timeLeftMap[item.id] ?? "계산 중"}
                </div>
                

                {/* 삭제 버튼 */}
                <div style={{ display: "flex", flexDirection: "column", gap: "5px", marginLeft: "auto",padding:'10px' }}>
                    <Button  size="sm"  style={{backgroundColor:'#f7f7f7', color:'black', border:'none'}}
                        onClick={() => deleteInterest(item.id)}>
                        삭제
                    </Button>
                </div>
            </FormGroup>
            <hr style={{ margin: "0 auto 5px auto" }} />
            </div>
            ))}
        </div>
        {interestList.length > 0 && (
        <Button className="buttonPrimary" onClick={deleteSelected} style={{fontSize:'12px', width:'80px', height:'30px'}}>전체 삭제</Button>
        )}
        <Pagination>
            {totalPages > 0 &&
            [...Array(totalPages)].map((_, idx) => (
                <PaginationItem active={page === idx} key={idx}>
                <PaginationLink onClick={() => setPage(idx)}>
                    {idx + 1}
                </PaginationLink>
                </PaginationItem>
            ))}
        </Pagination>
    </>
  );
}