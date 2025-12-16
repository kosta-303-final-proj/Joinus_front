import "bootstrap/dist/css/bootstrap.min.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink} from "reactstrap";
import { useEffect, useState } from "react";
import { myAxios } from "../../../config";
import { useNavigate } from "react-router-dom";

export default function InterestList() {
    // 로그인 유저 정보 (추가)
const userInfo = JSON.parse(localStorage.getItem("userInfo"));
const username = userInfo?.username;

    const [interestList, setInterestList] = useState([]);
    const navigate = useNavigate();
    //체크박스
    const [checkedItems, setCheckedItems] = useState({});
    const [allChecked, setAllChecked] = useState(false);

    //전체 선택 함수
    const handleAllCheck = () => {
        const newAllChecked = !allChecked;
        setAllChecked(newAllChecked);

        // interestList 모든 id에 대해 체크 여부 적용
        const updatedChecked = {};
        interestList.forEach(item => {
            updatedChecked[item.id] = newAllChecked;
        });

        setCheckedItems(updatedChecked);
    };

    //개별 체크 함수
    const handleItemCheck = (id) => {
        const updatedChecked = {
            ...checkedItems,
            [id]: !checkedItems[id]
        };

        setCheckedItems(updatedChecked);

        // 개별 체크 상태에 따라 전체 체크 업데이트
        const allSelected = interestList.every(item => updatedChecked[item.id]);
        setAllChecked(allSelected);
    };

    useEffect(() => {
    const fetchIntegerList = async () => {
      try {
        const response = await myAxios().get(`/interestList`, {
          params: { username }
        });
        setInterestList(response.data);
      } catch (error) {
        console.error("장바구니 조회 실패", error);
      }
    };
    fetchIntegerList();
 }, [username]);

  const deleteInterest = async (id) => {
    try {
        const userInfo = JSON.parse(localStorage.getItem("userInfo"));
        const username = userInfo?.username;

        await myAxios().post("/deleteWish", { id, username });

        setInterestList(prev => prev.filter(item => item.id !== id));
    } catch (error) {
        console.error("관심상품 삭제 실패", error);
    }
};

  const deleteSelected = async () => {
    if (!username) return;
        const selectedIds = Object.keys(checkedItems).filter(id => checkedItems[id]);
        
        if(selectedIds.length === 0){
            alert("선택된 항목이 없습니다.");
            return;
        }

        try {
            await Promise.all(
                selectedIds.map(id=>
                    myAxios().post("/deleteAllWish", {id, username})
                )
            );
            setInterestList(prev=>
                prev.filter(item => !selectedIds.includes(String(item.id)))
            );
        } catch (error) {
            console.error("선택 삭제 실패", error);
        }
    }

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
            <Label style={{ color: "black", fontSize: "12px", margin: "0 35px 0 0" }}>주문</Label>
          </div>
        </FormGroup>
        <hr style={{ margin: "5px auto 0 auto" }} />

        {/* 상품 리스트 */}
        {interestList.map((item) => (
            <div key={item.id}>
            <FormGroup check style={{ display: "flex", height: "120px", alignItems: "center" }}>
                <Input type="checkbox" style={{ marginRight: "30px" }}
                checked={checkedItems[item.id] || false}
                onChange={() => handleItemCheck(item.id)}
                 />
                {/* 상품 이미지 */}
                <div onClick={()=> navigate(`/gbProductDetail/${item.product?.id}`)} style={{display:'flex', justifyContent:'center', alignItems:'center',cursor: 'pointer'}}>
                <img
                    src={`http://localhost:8080/file/gbProduct/${item.product?.thumbnail?.fileName}`}
                    style={{ width: "70px", height: "70px", marginRight: "20px" }}
                />

                {/* 상품명 */}
                <div style={{ fontSize: "12px", width: "400px", marginRight: "20px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                    {item.product?.name}
                </div>
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
        {/* <Pagination>
            <PaginationItem>
                <PaginationLink
                first
                href="#"
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                previous
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                1
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                2
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                3
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                4
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink href="#">
                5
                </PaginationLink>
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                next
                />
            </PaginationItem>
            <PaginationItem>
                <PaginationLink
                href="#"
                last
                />
            </PaginationItem>
        </Pagination> */}
    </>
  );
}