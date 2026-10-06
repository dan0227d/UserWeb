// App.jsx — 定義路由對應關係
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login'
import UserContent from './pages/UserContent';
import UserList from './pages/UserList';
import Register from './pages/Register';
import Logout from './pages/Logout';
import Report from './pages/Report';
import UploadFile from './pages/UploadFile';
import Search from './pages/Search';
import NotFound from './pages/NotFound';

function App() {
  return (
    <>
      <Navbar />  {/* Navbar 永遠顯示 */}

      {/* Routes 內只渲染「第一個符合 URL 的 Route」 */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/usercontent" element={<UserContent />} />
        <Route path="/userlist" element={<UserList />} />
        <Route path="/register" element={<Register />} />
        <Route path="/logout" element={<Logout />} />
        <Route path="/report" element={<Report />} />
        <Route path="/search" element={<Search />} />
        <Route path="/uploadfile" element={<UploadFile />} />
        <Route path="*" element={<NotFound />} />  {/* 萬用：404 */}
      </Routes>
    </>
  );
}

export default App;