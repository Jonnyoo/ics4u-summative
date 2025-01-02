import { Outlet, Navigate } from "react-router-dom";
import { useStoreContext } from '../Context/context';

function ProtectedRoutes() {
  const { user } = useStoreContext();

  return (
    user ? <Outlet /> : <Navigate to="/login" />
  )
}

export default ProtectedRoutes;