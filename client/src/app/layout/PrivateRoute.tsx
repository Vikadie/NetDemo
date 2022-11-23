import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppSelector } from "../store/configureStore";
 
export default function PrvateRoute() {
  const location = useLocation();
  const { user } = useAppSelector((state) => state.account);
  
  return !user ? (
    <Navigate replace to="/login" state={{ from: location }} /> // in the location.state.from the current(old) location is added (using replace)
  ) : (
    <Outlet /> // Outlet return the child component in the Route section (in the App.tsx), in this case when '/checkout' => CheckoutPage
  );
};