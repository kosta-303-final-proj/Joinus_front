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
import './App.css';

function AppContent() {
  const location = useLocation();
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
            <Route path="/cs/inquiry/:id" element={<InquiryDetail />} />

            {/* 납품문의 */}
            <Route path="/partnership" element={<Partnership />} />

            {/* 관리자 페이지 */}
            <Route path="/admin" element={<Dashboard />} />
            <Route path="/admin/noticeWrite" element={<NoticeWrite />} />
            <Route path="/admin/deliveryManagement" element={<DeliveryManagement />} />
            <Route path="/admin/delivery/:id" element={<DeliveryDetail />} />
            <Route path="/admin/notifications" element={<NotificationSend />} />
            <Route path="/admin/statistics" element={<Statistics />} />
            <Route path="/admin/statistics/product" element={<ProductStatistics />} />
            <Route path="/admin/pendingPayment" element={<PendingPayment />} />
            <Route path="/admin/delivery/applications" element={<DeliveryApplicationList />} />
            <Route path="/admin/delivery/application/:id" element={<DeliveryDetail />} />
            <Route path="/admin/delivery/approved" element={<ApprovedDeliveryCompany />} />
            <Route path="/admin/delivery/products/new" element={<DeliveryProductForm />} />
            <Route path="/admin/delivery/products" element={<DeliveryProductList />} />
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
