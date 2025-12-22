import "bootstrap/dist/css/bootstrap.min.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import '../../../css/mypage/ShopCartList.css';
import { useState, useEffect } from "react";
import { myAxios, baseUrl } from "../../../config";
import { useNavigate } from "react-router-dom";
import "./PaginationCom.css";

export default function ShopCartList() {
  const navigate = useNavigate();

  const [cartList, setCartList] = useState([]);
  const [page, setPage] = useState(0);          // ⭐ 현재 페이지
  const [totalPages, setTotalPages] = useState(0);

  const size = 10; // ⭐ 페이지당 개수

  useEffect(() => {
    const fetchCartList = async () => {
      try {
        const userInfo =
      JSON.parse(sessionStorage.getItem("userInfo"))
      const username = userInfo?.username;

        const response = await myAxios().get(`/cartList`, {
          params: { username }
        });

        const data = response.data;

        setCartList(data);
        setTotalPages(Math.ceil(data.length / size)); // ⭐ 전체 페이지 수
      } catch (error) {
        console.error("장바구니 조회 실패", error);
      }
    };

    fetchCartList();
  }, []);


  // ⭐ 현재 페이지 데이터
  const pagedCartList = cartList.slice(
    page * size,
    page * size + size
  );

  const handlePay = (item) => {
    navigate(`/pay/${item.productId}`, {
      state: {
        productId: item.productId,
        productName: item.productName,
        thumbnail: item.thumbnailPath.split('/').pop(), // 파일명만
        finalPrice: item.price * item.quantity,
        quantity: item.quantity,
        optionIds: item.optionIds
      }
    });
  };
 

  const deleteCartList = async (cartId) => {
    try {
      const userInfo =
      JSON.parse(sessionStorage.getItem("userInfo"))
      const username = userInfo?.username;

      await myAxios().post("/deleteCart", { id: cartId, memberUsername: username });

      const updated = cartList.filter(item => item.cartId !== cartId);
      setCartList(updated);
      setTotalPages(Math.ceil(updated.length / size));

      if (page > 0 && updated.length <= page * size) {
        setPage(page - 1);
      }
    } catch (error) {
      console.error("삭제 실패", error);
      alert("삭제 실패: " + error.response?.data);
    }
  };


  return (
    <div className="container">
      <div className="fw-bold d-block" style={{ fontSize: "20px", margin: "20px auto" }}>장바구니</div>

      {/* 헤더 */}
      <hr style={{ margin: "5px auto 0 auto" }} />
      <FormGroup check className="header" style={{backgroundColor:'#F2F9FC', marginBottom:'0px', height:'35px'}}>
        <Label className="headerLabel" style={{ margin: "0 330px 0 5px " }}>상품정보</Label>
        <Label className="headerLabel" style={{ margin: "0 40px 0 0" }}>가격</Label>
        <Label className="headerLabel" style={{ margin: "0 45px 0 0" }}>수량</Label>
        <Label className="headerLabel" style={{ margin: "0 30px 0 0" }}>구매가</Label>
        <Label className="headerLabel" style={{ margin: "0 35px 0 0" }}>선택</Label>
      </FormGroup>
      <hr style={{ margin: "0 auto 5px auto" }} />
      {/* 상품 리스트 */}
      <div className="productList">
        {pagedCartList.map(item=>(
          <FormGroup  check className="productItem" key={item.cartId}>
            <img
                    src={`${baseUrl}/file/gbProduct/${item.thumbnailPath.split('/').pop()}`}
                    style={{ width: "70px", height: "70px", marginRight: "20px" }}
                />
            <div className="productName">{item.productName}</div>
            <div className="productPrice">{item.price.toLocaleString()}원</div>
            <div className="productQuantity">{item.quantity}</div>
            <div className="productTotal">{(item.price * item.quantity).toLocaleString()}원</div>
            <div className="buttonGroup">
              <Button size="sm" className="buttonPrimary" style={{width:"70px"}} onClick={() => handlePay(item)}>결제</Button>
              <Button size="sm" className="buttonSecondary" onClick={()=>deleteCartList(item.cartId)}>삭제</Button>
            </div>
          </FormGroup>
          ))}
          <hr style={{ margin: "5px auto" }} />
      </div>
      

      {/* 페이지네이션 */}
      <Pagination className="paginationContainer">
        {/* 이전 */}
        <PaginationItem disabled={page === 0}>
          <PaginationLink onClick={() => setPage(page - 1)}>
            이전
          </PaginationLink>
        </PaginationItem>

        {/* 페이지 번호 */}
        {[...Array(totalPages)].map((_, idx) => (
          <PaginationItem key={idx} active={page === idx}>
            <PaginationLink onClick={() => setPage(idx)}>
              {idx + 1}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 다음 */}
        <PaginationItem disabled={page === totalPages - 1}>
          <PaginationLink onClick={() => setPage(page + 1)}>
            다음
          </PaginationLink>
        </PaginationItem>
      </Pagination>
    </div>
  );
}


