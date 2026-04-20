import { Outlet, useLocation } from "react-router-dom";
import Header from "./Header";
export default function MainLayout() {
  const location = useLocation();

  const isAuthPage = ["/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <Header />}
      <Outlet />
    </>
  );
}
