import { useState, useEffect, useContext } from "react";
import { LoginContent } from "../content/LoginContent";
import { search, userscount } from "../api/apiService";
import './Search.css';

export default function Search() {
    const [keyword, setKeyword] = useState("");
    const [users, setUsers] = useState([]);
    const [message, setMessage] = useState("");
    const [page, setPage] = useState(0);
    const [size, setSize] = useState(10);
    const [inputSize, setInputSize] = useState(size);
    const [totalPages, setTotalPages] = useState(0);

    const { loginUser } = useContext(LoginContent);

    useEffect(() => {
        const searchData = async () => {
            try {
                console.log(keyword, page, size);
                const data = await search(keyword, page, size);
                setUsers(data);

                const total = await userscount(keyword);

                setTotalPages(
                    Math.ceil(total.total / size)
                );

            } catch (error) {
                console.error(error);
                setMessage(error.message);
                setUsers([]);
                setTotalPages(0);
            }
        };

        searchData();

    }, [keyword, page, size]);

    const handleChange = (e) => {
        const value = e.target.value;

        setKeyword(value);
        setPage(0);
        setMessage("");
    };

    const Pagination = () => (
        <div className="pagination">

        <div className="page-control">
            <button
                disabled={page === 0}
                onClick={() => setPage(page - 1)}
            >
                上一頁
            </button>

            <span>
                {totalPages === 0 ? 0 : page + 1} / {totalPages}
            </span>

            <button
                disabled={page >= totalPages - 1}
                onClick={() => setPage(page + 1)}
            >
                下一頁
            </button>
        </div>

        <div className="size-control">
            <span>每頁筆數：</span>

            <input
                className="size-input"
                type="number"
                min="1"
                value={inputSize}
                onChange={(e) => setInputSize(e.target.value)}
            />

            <button
                onClick={() => {
                    const value = Number(inputSize);

                    if (value >= 1) {
                        setSize(value);
                        setPage(0);
                    }
                }}
            >
                查詢
            </button>
        </div>

    </div>
    );

    return (
        <div className="search-container">

            <h2 className="search-title">
                使用者查詢
            </h2>

            {loginUser && (
                <input
                    className="search-input"
                    type="text"
                    value={keyword}
                    onChange={handleChange}
                    placeholder="請輸入 username"
                />
            )}

            {message && (
                <p className="search-error">
                    {message}
                </p>
            )}

            {keyword !== "" &&
             users.length === 0 &&
             !message && (
                <p className="search-empty">
                    查無資料
                </p>
            )}

            {loginUser && <Pagination />}

            {users.length > 0 && (
                <table className="search-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>User</th>
                            <th>Username</th>
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

            {loginUser && <Pagination />}

        </div>
    );
}