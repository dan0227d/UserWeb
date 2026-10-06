import { useState, useContext, useEffect } from "react";
import { LoginContent } from "../content/LoginContent";
import { useNavigate } from "react-router-dom";
import { login, logout, check, deleteUser } from "../api/apiService";
import "./Login.css";

export default function Login() {
  const navigate = useNavigate();

  const {
    loginUser,
    setLoginUser
  } = useContext(LoginContent);

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  // F5 時確認登入狀態用
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLogin = async () => {
      try {
        const user = await check();

        setLoginUser(user);

      } catch (error) {
        console.error(error);

        setLoginUser(null);

      } finally {
        setLoading(false);
      }
    };

    checkLogin();
  }, []);

  const handleLogin = async () => {
    try {
      const user = await login(username, password);

      setLoginUser(user);
      setMessage("登入成功");

    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleLogout = async () => {
    try {
      await logout();

      setLoginUser(null);
      setUsername("");
      setPassword("");
      setMessage("登出成功");

    } catch (error) {
      setMessage(error.message);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "確定要刪除帳號嗎？刪除後無法復原。"
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteUser();

      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");

      setLoginUser(null);
      setMessage("帳號刪除成功");

    } catch (error) {
      console.error(error);
      setMessage(error.message);
    }
  };

  // check() 還沒有完成時
  if (loading) {
    return (
      <div className="page">
        <div className="loginBox">
          <h1>使用者系統</h1>

          <p className="loadingMessage">
            讀取中...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="page">

      <div className="loginBox">

        <h1>使用者系統</h1>

        {loginUser === null ? (
          <>
            <div className="inputGroup">

              <label>帳號</label>

              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="請輸入帳號"
              />

            </div>

            <div className="inputGroup">

              <label>密碼</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="請輸入密碼"
              />

            </div>

            <div className="loginButtonGroup">

              <button onClick={() => handleLogin()}>
                登入
              </button>

              <button onClick={() => navigate("/register")}>
                註冊
              </button>

            </div>
          </>
        ) : (
          <>
            <h2>登入成功</h2>

            <p>
              帳號：{loginUser.username}
            </p>

            <div className="logoutButtonGroup">

              <button
                className="logoutButton"
                onClick={() => handleLogout()}
              >
                登出
              </button>

              <button
                className="deleteButton"
                onClick={() => handleDelete()}
              >
                刪除帳號
              </button>

            </div>
          </>
        )}

        <p className="message">
          {message}
        </p>

      </div>

    </div>
  );
}