import { createContext, useState, useEffect } from "react";
import { check, parseJwt, refreshAccessToken } from "../api/apiService";

export const LoginContent = createContext();

export function LoginProvider({ children }) {

  const [loginUser, setLoginUser] = useState(null);

  useEffect(() => {
    const checkLogin = async () => {

      try {
        const user = await check();
        setLoginUser(user);
        console.log("---------check--------");
        console.log(user);
      } catch (error) {
        setLoginUser(null);
      }
    };

    checkLogin();
  }, []);


  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      return;
    }

    const payload = parseJwt(token);
    if (!payload) {
    return;
    }
    const expireTime = payload.exp * 1000;
    const remaining = expireTime - Date.now();
    console.log("JWT 剩餘時間：", remaining);

    if (remaining <= 0) {
      localStorage.removeItem("token");
      setLoginUser(null);

      return;
    }

    const timer = setTimeout(async() => {

      const refresh = window.confirm(
        "登入即將到期。\n按「確定」更新登入，按「取消」登出。"
      );

      if (refresh) {
      try {
        await refreshAccessToken();

        alert("Token 更新成功");
        window.location.reload();
      } catch (error) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");

        setLoginUser(null);
        alert("登入已過期，請重新登入");
      }

      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        setLoginUser(null);
        alert("已登出");
      }
    }, remaining);

    return () => {
      clearTimeout(timer);
    };
  }, [loginUser]);


  return (
    <LoginContent.Provider
      value={{
        loginUser,
        setLoginUser
      }}
    >
      {children}
    </LoginContent.Provider>
  );
}