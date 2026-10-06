import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserContent,
  saveUserContent
} from "../api/apiService";
import "./UserContent.css";

export default function UserContent() {
  const navigate = useNavigate();

  const [age, setAge] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");

  const [hasContent, setHasContent] = useState(false);
  const [message, setMessage] = useState("");

  // 進入頁面時取得原本的 UserContent
  useEffect(() => {
    const loadUserContent = async () => {
      try {
        const data = await getUserContent();

        if (data) {
          setAge(data.age ?? "");
          setEmail(data.email ?? "");
          setAddress(data.address ?? "");

          setHasContent(true);
        }
      } catch (error) {
        // 查不到資料時，保留空白讓使用者新增
        setHasContent(false);
      }
    };

    loadUserContent();
  }, []);

  // 新增或修改
  const handleSave = async () => {
    try {

      await saveUserContent(age, email, address);

      setHasContent(true);
      setMessage("儲存成功");

    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page">
      <div className="loginBox">

        <h1>帳號內容</h1>

        <div className="inputGroup">
          <label>年齡</label>

          <input
            type="number"
            min="0"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label>Email</label>

          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="inputGroup">
          <label>地址</label>

          <input
            type="text"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="buttonGroup">

          <button onClick={handleSave}>
            {hasContent ? "修改" : "新增"}
          </button>

          <button onClick={() => navigate("/")}>
            返回
          </button>

        </div>

        <p className="message">{message}</p>

      </div>
    </div>
  );
}