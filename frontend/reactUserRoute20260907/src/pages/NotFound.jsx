import { Link, useNavigate } from 'react-router-dom';
import './NotFound.css';

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="notFoundPage">
      <div className="notFoundBox">
        <h1 className="notFoundCode">404</h1>

        <h2>頁面不存在</h2>

        <p className="notFoundTent">
          找不到這個頁面，可能網址錯誤或頁面已被移除。
        </p>

        <div className="notFoundButtons">
          <Link to="/" className="homeButton">
            回到首頁
          </Link>

          <button
            className="backButton"
            onClick={() => navigate(-1)}
          >
            回上一頁
          </button>
        </div>
      </div>
    </div>
  );
}