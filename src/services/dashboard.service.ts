import api from "@/lib/api";
import type { DashboardData } from "@/types/database";

export const dashboardService = {
  getData: () =>
    api.get<DashboardData>("/sms/dashboard-metrics").then((r) => r.data),
};