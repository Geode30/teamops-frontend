import { Routes } from "react-router-dom";
import { AuthRoutes } from "./auth.routes";
import { RootRoutes } from "./root.route";
import { DashboardRoutes } from "./dashboard.routes";

const AppRoutes = () => {
  return (
    <Routes>
      {RootRoutes}
      {AuthRoutes}
      {DashboardRoutes}
    </Routes>
  );
};

export default AppRoutes;