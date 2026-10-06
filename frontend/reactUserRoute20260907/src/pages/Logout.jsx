import { useState, useContext, useEffect} from "react";
import { LoginContent } from "../content/LoginContent";
import { useNavigate } from "react-router-dom";
import { check, logout } from "../api/apiService";
import "./Logout.css";

export default function Logout() {
  const navigate = useNavigate();

  const {
    loginUser,
    setLoginUser
  } = useContext(LoginContent);

  const [message, setMessage] = useState("正在登出...");

  useEffect(() => {
    const handleLogout = async () => {

      try {
        const user = await check();

        if (user === null) {
            setLoginUser(null);
            setMessage("已登出");
        } else {
            const mes = await logout();

            setLoginUser(null);
            setMessage(mes.message);
        }

      } catch (error) {
        setMessage(error.message);
      }
      
    };

    handleLogout();
  }, []);

  return (
    <div className="logoutPage">
      <div className="logoutBox">

        <h1>登出</h1>

        <p className="logoutMessage">
          {message}
        </p>

        <button
          className="logoutButton"
          onClick={() => navigate("/")}
        >
          回登入頁
        </button>

      </div>
    </div>
  );
}

