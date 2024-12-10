import { Routes, Route } from "react-router";
import HomePage from "../pages/HomePage";
import MainLayout from "../layouts/MainLayout";
import ScanHistoryPage from "../pages/ScanHistoryPage";

const RoutesHandler = () => {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="scan-history" element={<ScanHistoryPage />} />
        <Route path="scan-history/:id" element={<ScanHistoryPage />} />
      </Route>
    </Routes>
  );
};

export default RoutesHandler;
