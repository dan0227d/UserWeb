import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../api/apiService";
import "./Register.css";

export default function Register() {
  const navigate = useNavigate();

  const [user, setUser] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");

  const handleRegister = async () => {

    // 檢查有沒有空白
    if (!user || !username || !password || !passwordCheck) {
      setMessage("所有欄位都必須填寫");
      return;
    }

    // 確認兩次密碼
    if (password !== passwordCheck) {
      setMessage("兩次輸入的密碼不同");
      return;
    }

    try {
        const data = await register(
            user,
            username,
            password
        );

      setMessage("註冊成功:" + data.username);

      setUser("");
      setUsername("");
      setPassword("");
      setPasswordCheck("");

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page">
      <div className="loginBox">

        <h1>使用者註冊</h1>

        <div className="inputGroup">
          <label>名稱</label>

          <input
            type="text"
            value={user}
            onChange={(e) => setUser(e.target.value)}
            placeholder="請輸入名稱"
          />
        </div>

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

        <div className="inputGroup">
          <label>確認密碼</label>

          <input
            type="password"
            value={passwordCheck}
            onChange={(e) => setPasswordCheck(e.target.value)}
            placeholder="請再次輸入密碼"
          />
        </div>

        <div className="buttonGroup">

          <button onClick={() =>handleRegister()}>
            註冊
          </button>

          <button onClick={() => navigate("/")}>
            返回登入
          </button>

        </div>

        <p className="message">{message}</p>

      </div>
    </div>
  );
}