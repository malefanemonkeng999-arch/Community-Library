import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();

  const [page, setPage] = useState("login");

  // Login fields
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");

  // Member registration fields
  const [name, setName] = useState("");
  const [newMembershipId, setNewMembershipId] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Admin setup fields
  const [adminName, setAdminName] = useState("");
  const [adminMembershipId, setAdminMembershipId] = useState("");
  const [adminPassword, setAdminPassword] = useState("");
  const [adminConfirmPassword, setAdminConfirmPassword] =
    useState("");

  const [error, setError] = useState("");
  const [adminSetupAvailable, setAdminSetupAvailable] =
    useState(false);

  // Check if an Admin account already exists
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const adminExists = users.some(
      (user) => user.role === "Admin"
    );

    setAdminSetupAvailable(!adminExists);
  }, []);

  // LOGIN
  const handleLogin = (e) => {
    e.preventDefault();

    setError("");

    if (!membershipId || !password) {
      setError(
        "Please enter your Membership ID and password."
      );
      return;
    }

    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const user = users.find(
      (user) =>
        user.membershipId.toLowerCase() ===
          membershipId.toLowerCase() &&
        user.password === password
    );

    if (!user) {
      setError("Incorrect Membership ID or password.");
      return;
    }

    sessionStorage.setItem(
      "loggedInUser",
      JSON.stringify(user)
    );

    navigate("/dashboard");
  };

  // MEMBER REGISTRATION
  const handleRegister = (e) => {
    e.preventDefault();

    setError("");

    if (
      !name ||
      !newMembershipId ||
      !newPassword ||
      !confirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    const membershipExists = users.some(
      (user) =>
        user.membershipId.toLowerCase() ===
        newMembershipId.toLowerCase()
    );

    if (membershipExists) {
      setError(
        "This Membership ID is already registered."
      );
      return;
    }

    const newUser = {
      id: Date.now(),
      name: name,
      membershipId: newMembershipId,
      password: newPassword,
      role: "Member",
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...users, newUser])
    );

    setName("");
    setNewMembershipId("");
    setNewPassword("");
    setConfirmPassword("");

    setError("");
    setPage("login");

    alert(
      "Account created successfully. You can now log in."
    );
  };

  // FIRST-TIME ADMIN SETUP
  const handleAdminSetup = (e) => {
    e.preventDefault();

    setError("");

    if (
      !adminName ||
      !adminMembershipId ||
      !adminPassword ||
      !adminConfirmPassword
    ) {
      setError("Please fill in all fields.");
      return;
    }

    if (adminPassword !== adminConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const savedUsers = localStorage.getItem("users");
    const users = savedUsers ? JSON.parse(savedUsers) : [];

    // Check if an Admin already exists
    const adminExists = users.some(
      (user) => user.role === "Admin"
    );

    if (adminExists) {
      setError(
        "An Administrator account already exists."
      );
      setAdminSetupAvailable(false);
      setPage("login");
      return;
    }

    // Check if Membership ID is already being used
    const membershipExists = users.some(
      (user) =>
        user.membershipId.toLowerCase() ===
        adminMembershipId.toLowerCase()
    );

    if (membershipExists) {
      setError(
        "This Membership ID is already registered."
      );
      return;
    }

    const adminUser = {
      id: Date.now(),
      name: adminName,
      membershipId: adminMembershipId,
      password: adminPassword,
      role: "Admin",
    };

    localStorage.setItem(
      "users",
      JSON.stringify([...users, adminUser])
    );

    setAdminName("");
    setAdminMembershipId("");
    setAdminPassword("");
    setAdminConfirmPassword("");

    setAdminSetupAvailable(false);
    setError("");
    setPage("login");

    alert(
      "Administrator account created successfully. You can now log in."
    );
  };

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-header">
          <h1>Community Library</h1>
          <p>Library Management System</p>
        </div>

        {/* ================= LOGIN ================= */}

        {page === "login" && (
          <>
            <h2>Login</h2>

            <p className="login-message">
              Enter your Membership ID and password.
            </p>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <form onSubmit={handleLogin}>

              <div className="form-group">
                <label>Membership ID</label>

                <input
                  type="text"
                  value={membershipId}
                  onChange={(e) =>
                    setMembershipId(e.target.value)
                  }
                  placeholder="Enter Membership ID"
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  placeholder="Enter password"
                />
              </div>

              <button
                type="submit"
                className="login-button"
              >
                Login
              </button>

            </form>

            <div className="login-footer">

              <p>Don't have an account?</p>

              <button
                type="button"
                className="register-button"
                onClick={() => {
                  setError("");
                  setPage("register");
                }}
              >
                Create an Account
              </button>

              {adminSetupAvailable && (
                <>
                  <p className="admin-setup-text">
                    First time using LibraTrack?
                  </p>

                  <button
                    type="button"
                    className="register-button"
                    onClick={() => {
                      setError("");
                      setPage("admin");
                    }}
                  >
                    Set Up Administrator
                  </button>
                </>
              )}

            </div>
          </>
        )}

        {/* ================= MEMBER REGISTRATION ================= */}

        {page === "register" && (
          <>
            <h2>Create Account</h2>

            <p className="login-message">
              Create your own library membership account.
            </p>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <form onSubmit={handleRegister}>

              <div className="form-group">
                <label>Name</label>

                <input
                  type="text"
                  value={name}
                  onChange={(e) =>
                    setName(e.target.value)
                  }
                  placeholder="Enter your name"
                />
              </div>

              <div className="form-group">
                <label>Membership ID</label>

                <input
                  type="text"
                  value={newMembershipId}
                  onChange={(e) =>
                    setNewMembershipId(e.target.value)
                  }
                  placeholder="Create a Membership ID"
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(e.target.value)
                  }
                  placeholder="Create a password"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm your password"
                />
              </div>

              <button
                type="submit"
                className="login-button"
              >
                Create Account
              </button>

            </form>

            <div className="login-footer">

              <p>Already have an account?</p>

              <button
                type="button"
                className="register-button"
                onClick={() => {
                  setError("");
                  setPage("login");
                }}
              >
                Back to Login
              </button>

            </div>
          </>
        )}

        {/* ================= ADMIN SETUP ================= */}

        {page === "admin" && (
          <>
            <h2>Administrator Setup</h2>

            <p className="login-message">
              Create the first Administrator account for
              LibraTrack.
            </p>

            {error && (
              <p className="login-error">
                {error}
              </p>
            )}

            <form onSubmit={handleAdminSetup}>

              <div className="form-group">
                <label>Administrator Name</label>

                <input
                  type="text"
                  value={adminName}
                  onChange={(e) =>
                    setAdminName(e.target.value)
                  }
                  placeholder="Enter administrator name"
                />
              </div>

              <div className="form-group">
                <label>Membership ID</label>

                <input
                  type="text"
                  value={adminMembershipId}
                  onChange={(e) =>
                    setAdminMembershipId(e.target.value)
                  }
                  placeholder="Create Administrator ID"
                />
              </div>

              <div className="form-group">
                <label>Password</label>

                <input
                  type="password"
                  value={adminPassword}
                  onChange={(e) =>
                    setAdminPassword(e.target.value)
                  }
                  placeholder="Create Administrator password"
                />
              </div>

              <div className="form-group">
                <label>Confirm Password</label>

                <input
                  type="password"
                  value={adminConfirmPassword}
                  onChange={(e) =>
                    setAdminConfirmPassword(e.target.value)
                  }
                  placeholder="Confirm Administrator password"
                />
              </div>

              <button
                type="submit"
                className="login-button"
              >
                Create Administrator
              </button>

            </form>

            <div className="login-footer">

              <button
                type="button"
                className="register-button"
                onClick={() => {
                  setError("");
                  setPage("login");
                }}
              >
                Back to Login
              </button>

            </div>
          </>
        )}

      </div>

    </div>
  );
}

export default Login;