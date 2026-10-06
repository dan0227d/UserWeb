import { useEffect, useState, useContext } from "react";
import { LoginContent } from "../content/LoginContent";
import { useNavigate } from "react-router-dom";
import { getAllUser,  } from "../api/apiService";
import "./UserList.css";

export default function UserList() {
  const navigate = useNavigate();

  const {
    loginUser,
    setLoginUser
  } = useContext(LoginContent);

  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");

  useEffect(() => {

    const loadUsers = async () => {
      try {
        const data = await getAllUser();

        console.log("使用者列表：", data);

        setUsers(data);

        // const user = await check();
        // setLoginUser(user);
      } catch (error) {
        if (error.message === "登入已過期"){
          setLoginUser(null);
        }
        console.log(error);
        setMessage(error.message);
      }
    };

    loadUsers();

  }, []);

  return (
    <div className="page">
      <div className="loginBox">

        <h1 className="title">使用者列表</h1>

        {loginUser && (
        <div className="pdfButtonBox">
          <button
            className="exportPdfButton"
            onClick={() => navigate('/report')}
          >
            顯示 PDF
          </button>
        </div>
        )}

        {users.length === 0 ? (
          <p>沒有使用者資料</p>
        ) : (
          <table className="userTable">

            <thead>
              <tr>
                <th>ID</th>
                <th>名稱</th>
                <th>帳號</th>
              </tr>
            </thead>

            <tbody>

              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.user}</td>
                  <td>{user.username}</td>
                </tr>
              ))}

            </tbody>

          </table>
        )}

        <p className="message">{message}</p>

        <div className="backButtonArea">
          <button
            className="backButton"
            onClick={() => navigate(-1)}
          >
            返回
          </button>
        </div>
      </div>
    </div>
  );
}
