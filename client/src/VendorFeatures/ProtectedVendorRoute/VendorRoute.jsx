import { Navigate } from 'react-router-dom';

const VendorRoute = ({ children }) => {
  const token = localStorage.getItem('vendorToken');
  return token ? children : <Navigate to="/login/business" />;
};

export default VendorRoute;

