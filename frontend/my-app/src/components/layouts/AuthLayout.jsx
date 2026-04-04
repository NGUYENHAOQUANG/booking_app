import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screenbg-white">
        <Outlet />
    </div>
  );
};

export default AuthLayout;