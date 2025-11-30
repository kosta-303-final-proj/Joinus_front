import 'bootstrap/dist/css/bootstrap.min.css';
import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import ProposalMngList from './components/ProposalMngList'
import GbProductMngList from './components/GbProductMngList'
import GbProductCreate from './components/GbProductCreate';
import OptionAddPage from './components/OptionAddPage';
import NoticeList from './components/NoticeList';
import FaqAndInquiryList from './components/FaqAndInquiryList';
import MemberList from './components/MemberList';
import MemberDetail from './components/MemberDetail';
import FaqForm from './components/FaqForm';
import NoticeForm from './components/NoticeForm';
import InquiryDetail from './components/InquiryDetail';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        {/* <Route path="/" element={<dashboard/>}/> */}
        <Route path="/admin/proposalMngList" element={<ProposalMngList />} />
        <Route path="/admin/gbProductMngList" element={<GbProductMngList />} />
        <Route path="/admin/gbProductCreate" element={<GbProductCreate />} />
        <Route path="/admin/optionAdd" element={<OptionAddPage />} />
        <Route path="/admin/noticeList" element={<NoticeList />} />
        <Route path="/admin/noticeForm" element={<NoticeForm />} />
        <Route path="/admin/noticeForm/:id" element={<NoticeForm />} />
        <Route path="/admin/faqAndInquiryList" element={<FaqAndInquiryList />} />
        <Route path="/admin/inquiryDetail/:id" element={<InquiryDetail />} />
        <Route path="/admin/faqForm" element={<FaqForm />} />
        <Route path="/admin/memberList" element={<MemberList />} />
        <Route path="/admin/member/:id" element={<MemberDetail />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App
