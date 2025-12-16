import "bootstrap/dist/css/bootstrap.min.css";
import { Label, FormGroup, Input, Button, Pagination, PaginationItem, PaginationLink } from "reactstrap";
import '../../../css/mypage/ShopCartList.css';
import { useState, useEffect } from "react";
import { myAxios } from "../../../config";

export default function ShopCartList() {

  const [cartList, setCartList] = useState([]);

  useEffect(() => {
    const fetchCartList = async () => {
      try {
        const username = "kakao_4436272679";
        const response = await myAxios().get(`/cartList`, {
          params: { username }
        });
        setCartList(response.data);
      } catch (error) {
        console.error("장바구니 조회 실패", error);
      }
    };
    fetchCartList();
  }, []);


  const deleteCartList = async (cartId) => {
    try {
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const username = userInfo?.username;

      await myAxios().post("/deleteCart",{ id: cartId, memberUsername: username });
      setCartList(prev => prev.filter(item => item.cartId !== cartId));
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
        {cartList.map(item=>(
          <FormGroup  check className="productItem" key={item.cartId}>
            {/* <img src={item.thumbnailPath} className="productImg" /> */}
            <img
                    src={`http://localhost:8080/file/proposal/${item.product?.thumbnail?.fileName}`}
                    style={{ width: "70px", height: "70px", marginRight: "20px" }}
                />
            <div className="productName">{item.productName}</div>
            <div className="productPrice">{item.price.toLocaleString()}원</div>
            <div className="productQuantity">{item.quantity}</div>
            <div className="productTotal">{(item.price * item.quantity).toLocaleString()}원</div>
            <div className="buttonGroup">
              <Button size="sm" className="buttonPrimary" style={{width:"70px"}}>결제</Button>
              <Button size="sm" className="buttonSecondary" onClick={()=>deleteCartList(item.cartId)}>삭제</Button>
            </div>
          </FormGroup>
          ))}
          <hr style={{ margin: "5px auto" }} />
      </div>
      

      {/* 페이지네이션 */}
      <Pagination className="paginationContainer">
        <PaginationItem><PaginationLink first href="#" /></PaginationItem>
        <PaginationItem><PaginationLink previous href="#" /></PaginationItem>
        {[1,2,3,4,5].map(num => (
          <PaginationItem key={num}><PaginationLink href="#">{num}</PaginationLink></PaginationItem>
        ))}
        <PaginationItem><PaginationLink next href="#" /></PaginationItem>
        <PaginationItem><PaginationLink last href="#" /></PaginationItem>
      </Pagination>
    </div>
  );
}
