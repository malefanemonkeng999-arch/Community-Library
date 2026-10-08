import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";

function Navbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser")
  );

  const isStaff =
    loggedInUser &&
    (loggedInUser.role === "Admin" ||
      loggedInUser.role === "Librarian");

  const handleLogout = () => {
    sessionStorage.removeItem("loggedInUser");
    navigate("/");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">

      <div className="navbar-logo">
        <h2>Community Library</h2>
        <span>Library Management System</span>
      </div>

      {/* Three-line menu button */}
      <button
        className="menu-button"
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Open navigation menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Navigation menu */}
      <div
        className={`navbar-links ${
          menuOpen ? "menu-open" : ""
        }`}
      >
        <Link to="/dashboard" onClick={closeMenu}>
          Dashboard
        </Link>

        <Link to="/books" onClick={closeMenu}>
          Books
        </Link>

        <Link to="/transactions" onClick={closeMenu}>
          Transactions
        </Link>

        {isStaff && (
          <Link to="/users" onClick={closeMenu}>
            Users
          </Link>
        )}

        {loggedInUser && (
          <span className="navbar-user">
            Welcome, {loggedInUser.name} ({loggedInUser.role})
          </span>
        )}

        <button
          className="logout-button"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

    </nav>
  );
}
export default Navbar;