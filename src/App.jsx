import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import AdminSidebar from './components/layout/AdminSidebar';
import ProtectedRoute from './components/auth/ProtectedRoute';
import MainPage from './pages/consumer/MainPage';
import SearchResult from './pages/consumer/SearchResult';
import Login from './pages/auth/Login';
import AdminLogin from './pages/admin/AdminLogin';
import SignUp from './pages/auth/SignUp';
import FindId from './pages/auth/FindId';
import FindPassword from './pages/auth/FindPassword';
import OAuthTokenHandler from './pages/auth/OAuthTokenHandler';
import Logout from './pages/auth/Logout';
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
import DeliveryApplicationDetail from './pages/admin/DeliveryManagement/DeliveryApplicationDetail';
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
import AdminOrderList from './pages/admin/AdminOrderList';
import AdminOrderDetail from './pages/admin/AdminOrderDetail';
import ExchRtrnWaitingList from './pages/admin/ExchRtrnWaitingList';
import ExchRtrnWaitingDetail from './pages/admin/ExchRtrnWaitingDetail';
import './App.css';
// 마이페이지
import InterestList from './pages/consumer/mypage/InterestList';
import InquiryHistoryList from './pages/consumer/mypage/inquiryHistoryList';
import OrderList from './pages/consumer/mypage/OrderList';
import OrderDetail from './pages/consumer/mypage/OrderDetail';
import ReviewManage from './pages/consumer/mypage/ReviewManage';
import ReviewWrite from './pages/consumer/mypage/ReviewWrite';
import ReviewWrited from './pages/consumer/mypage/ReviewWrited';
import ShopCartList from './pages/consumer/mypage/ShopCartList';
import Sidebar from './pages/consumer/mypage/Sidebar'
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
import ExchangeReq from './pages/consumer/mypage/ExchangeReq';
import ReturnReq from './pages/consumer/mypage/ReturnReq';
import CnclExchRtrnHisList from './pages/consumer/mypage/CnclExchRtrnHisList';
import ExchangeDetail from './pages/consumer/mypage/ExchangeDetail';
import ReturnDetail from './pages/consumer/mypage/ReturnDetail';
import CancelDetail from './pages/consumer/mypage/CancelDetail';
// 제안
import ProposalsList from "./pages/consumer/proposals/ProposalsList";
import ProposalDetailConsumar from "./pages/consumer/proposals/ProposalDetailConsumar";
import ProposalWrite from "./pages/consumer/proposals/ProposalWrite";
import ProposalModify from './pages/consumer/proposals/ProposalModify';
//공구
import GBProductList from './pages/consumer/groups/GBProductList';
import GBProductDetail from './pages/consumer/groups/GBProductDetail';
import DetailInfo from './pages/consumer/groups/DetailInfo';
import Reviews from './pages/consumer/groups/Reviews';
import Policy from './pages/consumer/groups/Policy';
import QAndA from './pages/consumer/groups/QAndA';
import Pay from './pages/consumer/groups/Pay';
import PayComplete from './pages/consumer/groups/PayComplete';
import { CheckoutPage } from './TossPayment';
// import { SuccessPage } from './Success';
//관리자
import ProposalDetailAdmin from './pages/admin/ProposalDetailAdmin';
import InquiryWrite from './pages/cs/InquiryWrite';




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
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/findId" element={<FindId />} />
            <Route path="/findPw" element={<FindPassword />} />
            <Route path="/token" element={<OAuthTokenHandler />} />
            <Route path="/logout" element={<Logout />} />

            {/* 고객센터 */}
            <Route path="/cs/notice" element={<Notice />} />
            <Route path="/cs/notice/:id" element={<NoticeDetail />} />
            <Route path="/cs/inquiry/:id" element={<InquiryDetail />} />
            <Route path="/cs/inquiryWrite" element={<InquiryWrite />} /> {/* 임시 */}

            {/* 납품문의 */}
            <Route path="/partnership" element={<Partnership />} />

            {/* 사용자 마이페이지 - 로그인 필요 */}
            <Route path="/mypage/*" element={
              <ProtectedRoute>
                <Sidebar>
                  <Routes>
                    <Route path="orderList" element={<OrderList />} />
                    <Route path="orderList/orderDetail/:id" element={<OrderDetail />} />

                    <Route path="shopCartList" element={<ShopCartList />} />
                    <Route path="interestList" element={<InterestList />} />
                    <Route path="inquiryHistoryList" element={<InquiryHistoryList />} />
                    <Route path="inquiryDetail/:id" element={<InquiryDetail />} />

                    {/*교환 취소 반품*/}
                    <Route path="cnclExchRtrnHisList" element={<CnclExchRtrnHisList />} />
                    <Route path="exchangeReq" element={<ExchangeReq />} />
                    <Route path="returnReq" element={<ReturnReq />} />
                    <Route path="exchangeDetail:/id" element={<ExchangeDetail />} />
                    <Route path="returnDetail:/id" element={<ReturnDetail />} />
                    <Route path="cancelDetail:/id" element={<CancelDetail />} />

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
              </ProtectedRoute>
            } />


            {/* 관리자 페이지 - ROLE_ADMIN 또는 ROLE_MANAGER 권한 필요 */}
            <Route path="/admin" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/noticeWrite" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <NoticeWrite />
              </ProtectedRoute>
            } />
            <Route path="/admin/delivery/:id" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <DeliveryDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/notifications" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <NotificationSend />
              </ProtectedRoute>
            } />
            <Route path="/admin/statistics" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <Statistics />
              </ProtectedRoute>
            } />
            <Route path="/admin/statistics/product" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <ProductStatistics />
              </ProtectedRoute>
            } />
            <Route path="/admin/pendingPayment" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <PendingPayment />
              </ProtectedRoute>
            } />
            <Route path="/admin/suppliy/applications" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <DeliveryApplicationList />
              </ProtectedRoute>
            } />
            <Route path="/admin/suppliy/application/:id" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <DeliveryApplicationDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/suppliy/approved" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <ApprovedDeliveryCompany />
              </ProtectedRoute>
            } />
            <Route path="/admin/suppliy/products/new" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <DeliveryProductForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/suppliy/products" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <DeliveryProductList />
              </ProtectedRoute>
            } />

            {/* 제안/공구상품/회원관리 */}
            <Route path="/admin/proposalMngList" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <ProposalMngList />
              </ProtectedRoute>
            } />
            <Route path="/admin/gbProductMngList" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <GbProductMngList />
              </ProtectedRoute>
            } />
            <Route path="/admin/gbProductCreate" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <GbProductCreate />
              </ProtectedRoute>
            } />
            <Route path="/admin/optionAdd" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <OptionAddPage />
              </ProtectedRoute>
            } />
            <Route path="/admin/noticeList" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <NoticeList />
              </ProtectedRoute>
            } />
            <Route path="/admin/noticeForm" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <NoticeForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/noticeForm/:id" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <NoticeForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/faqAndInquiryList" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <FaqAndInquiryList />
              </ProtectedRoute>
            } />
            <Route path="/admin/admininquiryDetail/:type/:id" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <AdminInquiryDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/faqForm" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <FaqForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/faqForm/:id" element={ // 수정: ID 파라미터 추가
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <FaqForm />
              </ProtectedRoute>
            } />
            <Route path="/admin/memberList" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <MemberList />
              </ProtectedRoute>
            } />
            <Route path="/admin/memberDetail/:username" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <MemberDetail />
              </ProtectedRoute>
            } />
            {/* 제안 디테일 관리자 화면 */}
            <Route path="/admin/proposalDetailAdmin" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <ProposalDetailAdmin />
              </ProtectedRoute>
            } />

            {/* 구매(주문)/교환 반품 */}
            <Route path="/admin/adminOrderList" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <AdminOrderList />
              </ProtectedRoute>
            } />
            <Route path="/admin/adminOrderDetail" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <AdminOrderDetail />
              </ProtectedRoute>
            } />
            <Route path="/admin/exchRtrnWaitingList" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <ExchRtrnWaitingList />
              </ProtectedRoute>
            } />
            <Route path="/admin/exchRtrnWaitingDetail" element={
              <ProtectedRoute requiredRoles={['ROLE_ADMIN', 'ROLE_MANAGER']}>
                <ExchRtrnWaitingDetail />
              </ProtectedRoute>
            } />

            {/* 제안 */}
            <Route path="/proposalsList" element={<ProposalsList />} />
            <Route path="/proposalsList/proposalWrite" element={<ProposalWrite />} />
            <Route path='/proposalDetail/:id' element={<ProposalDetailConsumar />} />
            <Route path='/proposalsList/proposalDetail/:id' element={<ProposalDetailConsumar />} />
            <Route path="/proposalsList/proposalModify/:id" element={<ProposalModify />} />

            {/* 공구 */}
            
            <Route path="/checkout" element={<CheckoutPage />} /> {/* 결제 */}
            {/* <Route path="/success" element={<SuccessPage />} /> */}
            {/* <Route path="/fail" element={<FailPage />} /> */}
            <Route path="/payComplate" element={<PayComplete />} />
            <Route path="/gbProductList" element={<GBProductList />} />
            <Route path="/gbProductDetail/:id" element={<GBProductDetail />}>
              <Route index element={<DetailInfo />} />
              <Route path="detailInfo" element={<DetailInfo />} />
              <Route path="policy" element={<Policy />} />
              <Route path="reviews" element={<Reviews />} />
              <Route path="qAndA" element={<QAndA />} />
            </Route>
            <Route path='/pay/:id' element={<Pay />} /> {/* 결제전 작성 및 결제 대기 */}
            <Route path='/payComplete' element={<PayComplete/>}/>
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