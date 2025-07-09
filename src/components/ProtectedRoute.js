import { Navigate } from 'react-router-dom';

const ProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem('access');
  if (!token) return <Navigate to="/login" />;
  
  try {
    const decoded = JSON.parse(atob(token.split('.')[1]));
    if (decoded.role !== allowedRole) return <Navigate to="/login" />;
    return children;
  } catch (e) {
    return <Navigate to="/login" />;
  }
};

export default ProtectedRoute;
