import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import MainPage from './pages/consumer/MainPage';
import SearchResult from './pages/consumer/SearchResult';
import Login from './pages/auth/Login';
import SignUp from './pages/auth/SignUp';
import FindId from './pages/auth/FindId';
import FindPassword from './pages/auth/FindPassword';
import Notice from './pages/cs/Notice';
import NoticeDetail from './pages/cs/NoticeDetail';
import Partnership from './pages/consumer/Partnership';
import Dashboard from './pages/admin/Dashboard';
import NoticeWrite from './pages/admin/NoticeWrite';
import DeliveryManagement from './pages/admin/DeliveryManagement';
import DeliveryDetail from './pages/admin/DeliveryDetail';
import NotificationSend from './pages/admin/NotificationSend';
import Statistics from './pages/admin/Statistics';
import ProductStatistics from './pages/admin/ProductStatistics';
import InquiryDetail from './pages/cs/InquiryDetail';
import PendingPayment from './pages/admin/PendingPayment';
import DeliveryApplicationList from './pages/admin/DeliveryManagement/DeliveryApplicationList';
import ApprovedDeliveryCompany from './pages/admin/DeliveryManagement/ApprovedDeliveryCompany';
import DeliveryProductForm from './pages/admin/DeliveryManagement/DeliveryProductForm';
import DeliveryProductList from './pages/admin/DeliveryManagement/DeliveryProductList';
// 제안/공구상품/회원관리
import ProposalMngList from './pages/admin/ProposalMngList'
import GbProductMngList from './pages/admin/GbProductMngList'
import GbProductCreate from './pages/admin/GbProductCreate';
import OptionAddPage from './pages/admin/OptionAddPage';
import NoticeList from './pages/admin/NoticeList';
import FaqAndInquiryList from './pages/admin/FaqAndInquiryList';
import MemberList from './pages/admin/MemberList';
import MemberDetail from './pages/admin/MemberDetail';
import FaqForm from './pages/admin/FaqForm';
import NoticeForm from './pages/admin/NoticeForm';
import AdminInquiryDetail from './pages/admin/AdminInquiryDetail';
// 구매(주문)/교환 반품
import ExchangeReq from './pages/consumer/mypage/ExchangeReq';
import ReturnReq from './pages/consumer/mypage/ReturnReq';
import CancelReq from './pages/consumer/mypage/cancelReq';
import CnclExchRtrnHisList from './pages/consumer/mypage/CnclExchRtrnHisList';
import ExchangeDetail from './pages/consumer/mypage/ExchangeDetail';
import ReturnDetail from './pages/consumer/mypage/ReturnDetail';
import CancelDetail from './pages/consumer/mypage/CancelDetail';
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import ExchRtrnWaitingList from './pages/admin/ExchRtrnWaitingList';
import ExchRtrnWaitingDetail from './pages/admin/ExchRtrnWaitingDetail';
import './App.css';
// 마이페이지 (지성스)
import InterestList from './pages/consumer/mypage/InterestList';
import InquiryHistoryList from './pages/consumer/mypage/inquiryHistoryList';
import OrderList from './pages/consumer/mypage/OrderList';
import OrderDetail from './pages/consumer/mypage/OrderDetail';
import ReviewManage from './pages/consumer/mypage/ReviewManage';
import ReviewWrite from './pages/consumer/mypage/ReviewWrite';
import ReviewWrited from './pages/consumer/mypage/ReviewWrited';
import ShopCartList from './pages/consumer/mypage/ShopCartList';
import Sidebar from './pages/consumer/mypage/Sidebar'

//마이페이지(도훈)//
import AddressAdd from './pages/consumer/mypage/AddressAdd';
import AddressEdit from './pages/consumer/mypage/AddressEdit';
import AddressList from './pages/consumer/mypage/AddressList';
import MypageAlert from './pages/consumer/mypage/MypageAlert';
import MypageDeleteAccount from './pages/consumer/mypage/MypageDeleteAccount';
import MypageMain from './pages/consumer/mypage/MypageMain';
import MypagePoints from './pages/consumer/mypage/MypagePoints';
import MypageProfileDetail from './pages/consumer/mypage/MypageProfileDetail';
import MypageProfileEdit from './pages/consumer/mypage/MypageProfileEdit';
import MypageProfileIndex from './pages/consumer/mypage/MypageProfileIndex';
import MypageSuggestions from './pages/consumer/mypage/MypageSuggestions';
import MypageTier from './pages/consumer/mypage/MypageTier';
import MyInquiryDetail from './pages/consumer/mypage/MyInquiryDetail';
// 제안
import ProposalsList from "./pages/consumer/proposals/ProposalsList";
import ProposalDetailConsumar from "./pages/consumer/proposals/ProposalDetailConsumar";
import ProposalWrite from "./pages/consumer/proposals/ProposalWrite";
//공구
import GBProductList from './pages/consumer/groups/GBProductList';
import GBProductDetail from './pages/consumer/groups/GBProductDetail';
import DetailInfo from './pages/consumer/groups/DetailInfo';
import Reviews from './pages/consumer/groups/Reviews';
import Policy from './pages/consumer/groups/Policy';
import QAndA from './pages/consumer/groups/QAndA';
import Pay from './pages/consumer/groups/Pay';
import PayComplete from './pages/consumer/groups/PayComplete';
//관리자
import ProposalDetailAdmin from './pages/admin/ProposalDetailAdmin';





function AppContent() {
  const location = useLocation(); /* 현재 url정보 반환 */
  const isAdminPage = location.pathname.startsWith('/admin');

  return (
    <div className="app">
      {!isAdminPage && <Header />}
      <div className={isAdminPage ? 'app-body-admin' : 'app-body'}>
        {isAdminPage && <AdminSidebar />}
        <main className={isAdminPage ? 'app-content-admin' : 'app-content'}>
          <Routes>
            {/* 메인 페이지 */}
            <Route path="/" element={<MainPage />} />
            <Route path="/consumer/main" element={<MainPage />} />
            
            {/* 검색 결과 페이지 */}
            <Route path="/searchResult" element={<SearchResult />} />

            {/* 인증 페이지 */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/findId" element={<FindId />} />
            <Route path="/findPw" element={<FindPassword />} />

            {/* 고객센터 */}
            <Route path="/cs/notice" element={<Notice />} />
            <Route path="/cs/notice/:id" element={<NoticeDetail />} />
            <Route path="/cs/inquiry/:id" element={<MyInquiryDetail />} />
            <Route path="/cs/inquiryWrite" element={<div>문의 작성 페이지 (준비 중)</div>} /> {/* 임시 */}

            {/* 납품문의 */}
            <Route path="/partnership" element={<Partnership />} />

            {/* 사용자 마이페이지 */}
            <Route path="/mypage/exchangeReq" element={<ExchangeReq/>} />
            <Route path="/mypage/returnReq" element={<ReturnReq/>} />
            <Route path="/mypage/cancelReq" element={<CancelReq/>} />
            <Route path="/mypage/cnclExchRtrnHisList" element={<CnclExchRtrnHisList/>} />
            <Route path="/mypage/exchangeDetail:/id" element={<ExchangeDetail/>} />
            <Route path="/mypage/returnDetail:/id" element={<ReturnDetail/>} />
            <Route path="/mypage/cancelDetail" element={<CancelDetail/>} />
            {/* 지성스 */}
            <Route path="/mypage/*" element={<Sidebar>
                <Routes>
                  <Route path="orderList" element={<OrderList />} />
                  <Route path="orderList/orderDetail/:id" element={<OrderDetail />} />
                  
                  <Route path="shopCartList" element={<ShopCartList />} />
                  <Route path="interestList" element={<InterestList />} />
                  <Route path="inquiryHistoryList" element={<InquiryHistoryList />} />
                  <Route path="inquiryDetail/:id" element={<InquiryDetail />} />

                  <Route path="addressList" element={<AddressList />} />
                  <Route path="addressAdd" element={<AddressAdd />} />
                  <Route path="addressEdit/:id" element={<AddressEdit />} />

                  <Route path="alert" element={<MypageAlert />} />
                  <Route path="deleteAccount" element={<MypageDeleteAccount />} />
                  <Route path="main" element={<MypageMain />} />
                  <Route path="points" element={<MypagePoints />} />
                  <Route path="profileDetail" element={<MypageProfileDetail />} />
                  <Route path="profileEdit" element={<MypageProfileEdit />} />
                  <Route path="profileIndex" element={<MypageProfileIndex />} />
                  <Route path="suggestions" element={<MypageSuggestions />} />
                  <Route path="tier" element={<MypageTier />} />

                  <Route path="reviewManage/*" element={<ReviewManage />}>
                    <Route index element={<ReviewWrite />} />
                    <Route path="reviewWrited" element={<ReviewWrited />} />
                  </Route>
                </Routes>
              </Sidebar>
            } />


            {/* 관리자 페이지 */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/noticeWrite" element={<NoticeWrite />} />
            <Route path="/admin/deliveryManagement" element={<DeliveryManagement />} />
            <Route path="/admin/delivery/:id" element={<DeliveryDetail />} />
            <Route path="/admin/notifications" element={<NotificationSend />} />
            <Route path="/admin/statistics" element={<Statistics />} />
            <Route path="/admin/statistics/product" element={<ProductStatistics />} />
            <Route path="/admin/pendingPayment" element={<PendingPayment />} />
            <Route path="/admin/suppliy/applications" element={<DeliveryApplicationList />} />
            <Route path="/admin/suppliy/application/:id" element={<DeliveryDetail />} />
            <Route path="/admin/suppliy/approved" element={<ApprovedDeliveryCompany />} />
            <Route path="/admin/suppliy/products/new" element={<DeliveryProductForm />} />
            <Route path="/admin/suppliy/products" element={<DeliveryProductList />} />

            {/* 제안/공구상품/회원관리 */}
            <Route path="/admin/proposalMngList" element={<ProposalMngList />} />
            <Route path="/admin/gbProductMngList" element={<GbProductMngList />} />
            <Route path="/admin/gbProductCreate" element={<GbProductCreate />} />
            <Route path="/admin/optionAdd" element={<OptionAddPage />} />
            <Route path="/admin/noticeList" element={<NoticeList />} />
            <Route path="/admin/noticeForm" element={<NoticeForm />} />
            <Route path="/admin/noticeForm/:id" element={<NoticeForm />} />
            <Route path="/admin/faqAndInquiryList" element={<FaqAndInquiryList />} />
            <Route path="/admin/admininquiryDetail/:id" element={<AdminInquiryDetail />} />
            <Route path="/admin/faqForm" element={<FaqForm />} />
            <Route path="/admin/memberList" element={<MemberList />} />
            <Route path="/admin/member/:id" element={<MemberDetail />} />
            {/* 자엔 디테일 관리자 화면 */}
            <Route path="/admin/proposalDetailAdmin" element={<ProposalDetailAdmin/>}/>

            {/* 구매(주문)/교환 반품 */}
            <Route path="/admin/adminOrderList" element={<AdminOrderList/>} />
            <Route path="/admin/adminOrderDetail" element={<AdminOrderDetail/>} />
            <Route path="/admin/exchRtrnWaitingList" element={<ExchRtrnWaitingList/>} />
            <Route path="/admin/exchRtrnWaitingDetail" element={<ExchRtrnWaitingDetail/>} />
            
            {/* 와타시 */}
            {/* 제안 */}
              <Route path="/proposalsList" element={<ProposalsList />} />
              <Route path='/proposalDetail/:id' element={<ProposalDetailConsumar/>}/>
              <Route path="/proposalsList/proposalWrite" element={<ProposalWrite />} />

            {/* 공구 */}
            
            <Route path='/pay' element={<Pay/>}/>
            <Route path="/payComplate" element={<PayComplete/>}/>
            <Route path="/gbProductList" element={<GBProductList />} />
            <Route path="/gbProductDetail/:id/*" element={<GBProductDetail />}>
              <Route index element={<DetailInfo />} />
              <Route path="detailInfo" element={<DetailInfo />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path='qAndA' element={<QAndA/>}/>
              <Route path="policy" element={<Policy />} />
            </Route>
          </Routes>
        </main>
      </div>
      {!isAdminPage && <Footer />}
    </div>
  );
}

function App() {
  return (
    <Router
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true
      }}
    >
      <AppContent />
    </Router>
  );
}

export default App;