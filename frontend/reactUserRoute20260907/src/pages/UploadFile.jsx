import { useState, useContext } from "react";
import { LoginContent } from "../content/LoginContent";
import { uploadFile } from "../api/apiService";
import './UploadFile.css';

export default function UploadFile() {
    const [file, setFile] = useState(null);
    const [message, setMessage] = useState("");

    const {
        loginUser,
        setLoginUser
    } = useContext(LoginContent);

    const handleUpload = async () => {
        if (!file) {
            alert("請先選擇檔案");
            return;
        }

        try{
            const res = await uploadFile(file);

            setMessage("上傳成功");
        }catch(error){
            setMessage(error.message);
        }
    };

    return (
    <div className="upload-page">
        <div className="upload-card">

            <h2>上傳文字檔</h2>

            <p className="upload-hint">
                請選擇 .txt 檔案
                <br />
                格式：姓名, 帳號, 密碼
                <br />
                <span className="upload-example">
                    範例：
                    <br />
                    王小明, test01, 123456
                    <br />
                    陳小華, test02, 654321
                </span>
            </p>

            <input
                className="file-input"
                type="file"
                accept=".txt"
                onChange={(e) => setFile(e.target.files[0])}
            />

            {loginUser === null? (
                <span className="not-login">尚未登入</span>
            ) : (<button
                className="upload-button"
                onClick={handleUpload}
            >
                上傳
            </button>
            )}
            

            {message && (
                <p className="upload-message">
                    {message}
                </p>
            )}

        </div>
    </div>
);
}