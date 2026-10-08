import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRoles }) {
  const loggedInUser = JSON.parse(
    sessionStorage.getItem("loggedInUser")
  );

  // User is not logged in
  if (!loggedInUser) {
    return <Navigate to="/" replace />;
  }

  // Check user's role if allowedRoles is provided
  if (
    allowedRoles &&
    !allowedRoles.includes(loggedInUser.role)
  ) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

export default ProtectedRoute;