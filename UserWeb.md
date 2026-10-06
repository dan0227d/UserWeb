# UserWeb

一個以前後端分離架構開發的使用者管理系統，使用 **Spring Boot + React + MySQL** 建置。

專案包含會員註冊、登入驗證、JWT 身分驗證、使用者資料查詢、分頁、個人資料管理、檔案上傳、PDF 報表產生等功能，並使用 Docker 建立 MySQL 與後端執行環境，以及透過 JMeter 進行 API 效能測試。

測試影片連結https://www.youtube.com/watch?v=PxwYS4y01Fg

---

## 📌 專案功能

### 使用者功能

- 使用者註冊
- 使用者登入 / 登出
- JWT 身分驗證
- Access Token / Refresh Token
- Token 過期處理
- 使用者個人資料管理
- 使用者資料查詢
- 關鍵字搜尋
- 分頁查詢
- 每頁顯示筆數設定

### 資料處理

- JPA Repository
- MyBatis
- MySQL 資料庫
- Transaction 交易控制
- 檔案資料匯入
- 匯入失敗 Rollback

### 報表

使用 **JasperReports** 產生使用者 PDF 報表。

支援：

- PDF 預覽
- PDF 下載
- 中文字型顯示
- 從資料庫取得資料產生報表

### Security

使用 Spring Security 建立 API 身分驗證機制。

主要包含：

- Spring Security
- JWT
- RSA 非對稱式數位簽章
- Access Token
- Refresh Token
- Stateless Authentication
- API 權限驗證

登入成功後，後端會產生 JWT：

```text
Login
  │
  ▼
AuthenticationManager
  │
  ▼
UserDetailsService
  │
  ▼
驗證帳號 / 密碼
  │
  ▼
產生 Access Token + Refresh Token
  │
  ▼
React 儲存 Token
  │
  ▼
Authorization: Bearer <token>
  │
  ▼
JwtFilter
  │
  ▼
RSA Public Key 驗證 JWT
  │
  ▼
SecurityContext
  │
  ▼
Controller
```

---

## 🛠️ 使用技術

### Backend

- Java
- Spring Boot
- Spring MVC
- Spring Security
- Spring Data JPA
- MyBatis
- JWT
- RSA
- Maven
- JasperReports

### Frontend

- React
- Vite
- React Router
- JavaScript
- HTML
- CSS
- Fetch API

### Database

- MySQL

### Testing / Tools

- Postman
- JMeter
- Docker
- Docker Compose
- Git
- Sourcetree
