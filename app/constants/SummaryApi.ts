// app/constants/SummaryApi.ts

export const baseURL =
  process.env.NEXT_PUBLIC_API_BASE || "https://qmatrixtechnologies.onrender.com/api";

const SummaryApi = {
  requestOtp: {
    url: "/auth/request-otp",
    method: "POST",
  },
  verifyOtp: {
    url: "/auth/verify-otp",
    method: "POST",
  },
  refreshToken: {
    url: "/auth/refresh",
    method: "POST",
  },

  master_all_shopowners: {
    url: "/master/all-shopowners",
    method: "GET",
  },

  admin_dashboard: {
    url: "/admin/dashboard",
    method: "GET",
  },
   users: {
    url: "/users",
    method: "GET",
  },

  userById: (id: string) => ({
    url: `/users/${id}`,
    method: "GET",
  }),

  updateUser: (id: string) => ({
    url: `/users/${id}`,
    method: "PATCH",
  }),

  uploadUserAvatar: (id: string) => ({
    url: `/users/${id}/avatar`,
    method: "PUT",
  }),

  deleteUserAvatar: (id: string) => ({
    url: `/users/${id}/avatar`,
    method: "DELETE",
  }),
};

export default SummaryApi;