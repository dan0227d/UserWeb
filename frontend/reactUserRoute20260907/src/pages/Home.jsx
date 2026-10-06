import { useNavigate } from 'react-router-dom';
import "./Home.css";

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="homePage">
      <div className="homeBox">
     
          <h1>歡迎來到首頁</h1>
          <button            
            onClick={() => navigate('/login')}>
            登入
          </button>
      </div>
    </div>      
  );
}