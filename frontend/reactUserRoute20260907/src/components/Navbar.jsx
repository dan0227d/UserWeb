import { Link, NavLink } from 'react-router-dom';
import "./Navbar.css";

export default function Navbar() {
  return (
    <nav className='navbar'>
      
        <NavLink
            to="/"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        首頁
        </NavLink>

        <NavLink
            to="/usercontent"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        會員資料
        </NavLink>

        <NavLink
            to="/userlist"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        會員列表
        </NavLink>

        <NavLink
            to="/search"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        查詢
        </NavLink>

        <NavLink
            to="/uploadfile"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        上傳
        </NavLink>

        <NavLink
            to="/login"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        登入
        </NavLink>

        <NavLink
            to="/register"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        註冊
        </NavLink>

        <NavLink
            to="/logout"
            draggable={false}
            className={({ isActive }) =>
            isActive ? 'nav-link nav-active' : 'nav-link'
            }
        >
        登出
        </NavLink>
      
    </nav>
  );
} 