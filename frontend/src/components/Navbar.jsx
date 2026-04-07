import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../App";

const NavLink = ({ to, children }) => {
  const { pathname } = useLocation();
  const active = pathname === to || pathname.startsWith(to + "/");
  return (
    <Link to={to} className={`nav-link ${active ? "nav-link--active" : ""}`}>
      {children}
    </Link>
  );
};

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="navbar">

      <Link to="/" className="navbar-brand">
        <span className="navbar-logo">
          <span className="navbar-logo-green">Task</span>
          <span className="navbar-logo-blue">Trakr</span>
        </span>
        <span className="navbar-tagline">Task Management System</span>
      </Link>

      {user && (
        <div className="navbar-links">

          {user.role === "User" && (
            <>
              <NavLink to="/tasks">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <rect x="3" y="3" width="7" height="7"/>
                  <rect x="14" y="3" width="7" height="7"/>
                  <rect x="14" y="14" width="7" height="7"/>
                  <rect x="3" y="14" width="7" height="7"/>
                </svg>
                My Tasks
              </NavLink>
              <NavLink to="/account">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="12" cy="8" r="4"/>
                  <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
                </svg>
                Account
              </NavLink>
            </>
          )}

          {user.role === "Admin" && (
            <>
              <NavLink to="/admin/users">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M3 21v-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4v2"/>
                  <line x1="19" y1="8" x2="19" y2="14"/>
                  <line x1="16" y1="11" x2="22" y2="11"/>
                </svg>
                Users
              </NavLink>
              <NavLink to="/admin/tasks">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                  <line x1="9" y1="13" x2="15" y2="13"/>
                  <line x1="9" y1="17" x2="12" y2="17"/>
                </svg>
                All Tasks
              </NavLink>
            </>
          )}

          <div className="navbar-user">
            <span className="navbar-user-info">
              <span className="navbar-username">{user.username}</span>
              <span className="navbar-role">{user.role}</span>
            </span>
            <button className="nav-btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </div>

        </div>
      )}

      {!user && (
        <div className="navbar-links">
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/register" className="nav-btn-register">Register</Link>
        </div>
      )}

    </nav>
  );
}