## 📁 Project Structure

專案分為 Backend、Frontend、JMeter 測試與專案文件。

```text
UserWeb/
├── backend/
│   └── UserWeb20260907/
│
├── frontend/
│   └── reactUserRoute20260907/
│
├── jmeter/
│
└── docs/
    └── images/
```

### Backend

Spring Boot 後端主要結構：

```text
src/main/
├── java/com/example/demo/
│   │
│   ├── config/
│   │   ├── JwtFilter.java
│   │   ├── JwtUtility.java
│   │   ├── RsaKeyGenerator.java
│   │   ├── SecurityConfig.java
│   │   ├── UserContentInitializer.java
│   │   └── UserDataInitializer.java
│   │
│   ├── controller/
│   │   ├── UserController.java
│   │   └── UserContentController.java
│   │
│   ├── service/
│   │   ├── CustomUserDetailsService.java
│   │   ├── UserService.java
│   │   └── UserContentService.java
│   │
│   ├── dao/
│   │   ├── UserDao.java
│   │   ├── UserContentDao.java
│   │   │
│   │   └── impl/
│   │       ├── UsreDaoJpaImpl.java
│   │       ├── UserDaoMyBatisImpl.java
│   │       ├── UserContentDaoJpaImpl.java
│   │       └── UserContentDaoMyBatisImpl.java
│   │
│   ├── mapper/
│   │   ├── UserMyBatisMapper.java
│   │   └── UserContentMyBatisMapper.java
│   │
│   ├── repository/
│   │   ├── UserRepository.java
│   │   └── UserContentRepository.java
│   │
│   ├── model/
│   │   ├── User.java
│   │   └── UserContent.java
│   │
│   └── UserWeb20260907Application.java
│
└── resources/
    ├── mapper/
    │   ├── user/
    │   │   └── UserMyBatisMapper.xml
    │   └── usercontent/
    │       └── UserContentMyBatisMapper.xml
    │
    ├── reports/
    ├── fonts/
    ├── jasperreports_extension.properties
    └── application.properties
```

後端依照不同職責進行分層：

- `controller`：處理 REST API Request / Response
- `service`：處理主要商業邏輯
- `dao`：統一資料存取介面
- `dao/impl`：分別提供 JPA 與 MyBatis 的 DAO 實作
- `repository`：Spring Data JPA 資料存取
- `mapper`：MyBatis Mapper
- `model`：Entity / 資料模型
- `config`：Spring Security、JWT、RSA 等相關設定
- `resources/mapper`：MyBatis SQL Mapping
- `resources/reports`：JasperReports 報表模板

### Frontend

React 前端主要結構：

```text
src/
├── api/
│   └── apiService.js
│
├── components/
│   ├── Navbar.jsx
│   └── Navbar.css
│
├── content/
│   └── LoginContent.jsx
│
├── pages/
│   ├── Home.jsx
│   ├── Login.jsx
│   ├── Logout.jsx
│   ├── Register.jsx
│   ├── Search.jsx
│   ├── Report.jsx
│   ├── UploadFile.jsx
│   ├── UserContent.jsx
│   ├── UserList.jsx
│   └── NotFound.jsx
│
├── App.jsx
├── main.jsx
└── index.css
```

前端使用 React Router 管理頁面路由，並透過 `apiService.js` 集中處理與 Spring Boot REST API 之間的 HTTP Request。

### Testing

```text
jmeter/
└── results/
```

使用 Apache JMeter 進行 API 與多人並行請求測試，並保存測試結果與 HTML Report。
