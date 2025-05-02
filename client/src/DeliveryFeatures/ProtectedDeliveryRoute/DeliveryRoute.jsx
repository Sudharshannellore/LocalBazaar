import { Navigate } from 'react-router-dom';

const DeliveryRoute = ({ children }) => {
  const token = localStorage.getItem('deliveryToken');
  return token ? children : <Navigate to="/login/delivery" />;
};

export default DeliveryRoute;

