import { Route, Navigate } from "react-router-dom";

export const RootRoutes = (
  <>
    <Route path="/" element={<Navigate to="/login" replace />} />
  </>
);