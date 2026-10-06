const BASE_URL = '/api';

function getAuthHeaders() {
  const accessToken = localStorage.getItem("token");
  return {
    Authorization: `Bearer ${accessToken}`
  };
}

async function checkToken(res) {
  if (res.status === 401) {
    const data = await res.json();

    console.log("-------checkToken-----------");
    if (data.message === "JWT_EXPIRED") {
      localStorage.removeItem("token");
      throw new Error("登入已過期");
    }

    throw new Error(data.message || "驗證失敗");
  }
}

export async function login(username, password) {
  const res = await fetch(`${BASE_URL}/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      username,
      password
    })
  });

  if (!res.ok) {
    throw new Error('帳號或密碼錯誤');
  }

  const data = await res.json();
  localStorage.setItem("token", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);
  return data.user;
}

export async function register(user, username, password) {
  console.log("----------"+password+"--------------");
  const res = await fetch(`${BASE_URL}/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      user,
      username,
      password
    })
  });

  if (!res.ok) {
    throw new Error('註冊失敗');
  }
  return res.json();
}

export async function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("refreshToken");
  return {
    message: "登出成功"
  };
}

export async function deleteUser() {
  const res = await fetch(`${BASE_URL}/user/me`, {
    method: 'DELETE',
    headers: getAuthHeaders()
  });

  if (res.status === 401) {
        throw new Error("尚未登入");
    }

    if (!res.ok) {
        throw new Error("刪除帳號失敗");
    }

    return await res.json();
}

export async function getUserContent() {
  const res = await fetch(`${BASE_URL}/userContent`, {
    headers: getAuthHeaders()
  });
  if (!res.ok) {
    throw new Error('內容讀取錯誤');
  }
  return res.json();
}

export async function saveUserContent(age, email, address) {
  const res = await fetch(`${BASE_URL}/userContent`, {
    method: 'POST',
    headers: {
      ...getAuthHeaders(),
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      age,
      email,
      address
    })
  });

  if (!res.ok) {
    throw new Error('儲存失敗');
  }
  return res.json();
}

export async function getAllUser() {
  const res = await fetch(`${BASE_URL}/user`, {
    headers: getAuthHeaders()
  });

  try{
    await checkToken(res);
  }catch(error){
    throw new Error(error.message);
  }
  


  if (!res.ok) {
    console.log("-------getall error------");
    throw new Error('內容讀取錯誤');
  }
  return res.json();
}

export async function check() {
  const res = await fetch(`${BASE_URL}/user/me`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!res.ok) {
    return null;
  }
  const data = await res.json();
  console.log(data);
  return data;
}

export async function exportUserPdf(pdfpage) {
  const response = await fetch(`${BASE_URL}/user/users`, {
    method: "GET",
    headers: getAuthHeaders()
  });

  if (!response.ok) {
    throw new Error("PDF 匯出失敗");
  }

  try {
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    if (pdfpage) {
      console.log("----------顯示PDF-------");
      return url;
    } else {
      const link = document.createElement("a");
      link.href = url;
      link.download = "users.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    }
  } catch (error) {
    console.error(error);
    throw new Error("PDF 匯出失敗");
  }
}

export async function search(username, page, size) {
  const res = await fetch(
    `${BASE_URL}/user/search?` +
    `username=${encodeURIComponent(username)}` +
    `&page=${page}` +
    `&size=${size}`,
    { headers: getAuthHeaders()}
  );

  if (res.status === 401 || res.status === 403) {
    throw new Error("尚未登入");
  }
  if (res.status === 204) {
    return [];
  }
  if (!res.ok) {
    throw new Error("查詢失敗");
  }
  return res.json();
}

export async function userscount(username) {
  const res = await fetch(
    `${BASE_URL}/user/count` +
    `?username=${encodeURIComponent(username)}`,
    { headers: getAuthHeaders()}
  );

  if (!res.ok) {
    throw new Error("查詢失敗");
  }   
  return res.json();
}


export async function uploadFile(file) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(
      `${BASE_URL}/user/upload`,
      {
          method: "POST",
          body: formData,
          headers: getAuthHeaders()
      }
  );

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message);
  } 
  return res.json();
}

export function parseJwt(token) {
  if (!token) {
    return null;
  }
  const parts = token.split(".");
  if (parts.length !== 3) {
    return null;
  }

  const payload = parts[1];

  const decoded = atob(
    payload.replace(/-/g, "+").replace(/_/g, "/")
  );

  return JSON.parse(decoded);
}

export async function refreshAccessToken() {

  const refreshToken = localStorage.getItem("refreshToken");
  // 連 Refresh Token 都沒有
  if (!refreshToken) {
    throw new Error("登入已過期");
  }
  const res = await fetch(`${BASE_URL}/user/refresh`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      refreshToken: refreshToken
    })
  });
  // Refresh Token 也過期或無效
  if (!res.ok) {
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    throw new Error("登入已過期");
  }
  const data = await res.json();
  // 把舊的 Access Token 換成新的
  localStorage.setItem("token", data.accessToken);

  return data.accessToken;
}