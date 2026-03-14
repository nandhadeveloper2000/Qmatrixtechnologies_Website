export const baseURL =
  // process.env.NEXT_PUBLIC_API_BASE || "https://qmatrixtechnologies.onrender.com/api";
  process.env.NEXT_PUBLIC_API_BASE || "http://localhost:5000/api";

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

  logout: {
    url: "/auth/logout",
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
    method: "PUT",
  }),

  uploadUserAvatar: (id: string) => ({
    url: `/users/${id}/avatar`,
    method: "PUT",
  }),

  deleteUserAvatar: (id: string) => ({
    url: `/users/${id}/avatar`,
    method: "DELETE",
  }),

  admin_courses: {
    url: "/courses/admin/all",
    method: "GET",
  },

  admin_course_by_id: (id: string) => ({
    url: `/courses/admin/${id}`,
    method: "GET",
  }),

  create_course: {
    url: "/courses",
    method: "POST",
  },

  update_course: (id: string) => ({
    url: `/courses/${id}`,
    method: "PUT",
  }),

  delete_course: (id: string) => ({
    url: `/courses/${id}`,
    method: "DELETE",
  }),

  upload_course_image: {
    url: "/courses/upload-image",
    method: "POST",
  },

  delete_course_image: {
    url: "/courses/delete-image",
    method: "DELETE",
  },

  public_courses: {
    url: "/courses",
    method: "GET",
  },

  public_course_by_slug: (slug: string) => ({
    url: `/courses/${slug}`,
    method: "GET",
  }),

  admin_blogs: {
    url: "/blogs/public",
    method: "GET",
  },

  blogs: {
    url: "/blogs/public",
    method: "GET",
  },

  admin_blog_by_id: (id: string) => ({
    url: `/blogs/admin/${id}`,
    method: "GET",
  }),

  create_blog: {
    url: "/blogs",
    method: "POST",
  },

  update_blog: (id: string) => ({
    url: `/blogs/${id}`,
    method: "PUT",
  }),

  delete_blog: (id: string) => ({
    url: `/blogs/${id}`,
    method: "DELETE",
  }),

  public_blog_by_slug: (slug: string) => ({
    url: `/blogs/public/${slug}`,
    method: "GET",
  }),

  public_page_seo: (pageKey: string) => ({
    url: `/page-seo/public/${pageKey}`,
    method: "GET",
  }),

  admin_page_seo_list: {
    url: `/page-seo/admin`,
    method: "GET",
  },

  admin_page_seo_upsert: (pageKey: string) => ({
    url: `/page-seo/admin/${pageKey}`,
    method: "PUT",
  }),

  admin_page_seo_delete: (pageKey: string) => ({
    url: `/page-seo/admin/${pageKey}`,
    method: "DELETE",
  }),

  admin_page_seo_by_key: (pageKey: string) => ({
    url: `/page-seo/admin/${pageKey}`,
    method: "GET",
  }),

  upsert_page_seo: (pageKey: string) => ({
    url: `/page-seo/admin/${pageKey}`,
    method: "PUT",
  }),

  create_enquiry: {
    url: "/enquiries",
    method: "POST",
  },

  list_enquiries: {
    url: "/enquiries",
    method: "GET",
  },

  update_enquiry: (id: string) => ({
    url: `/enquiries/${id}`,
    method: "PUT",
  }),

  delete_enquiry: (id: string) => ({
    url: `/enquiries/${id}`,
    method: "DELETE",
  }),

  admin_enquiries: {
    url: "/enquiries",
    method: "GET",
  },

  admin_enquiry_update: (id: string) => ({
    url: `/enquiries/${id}`,
    method: "PUT",
  }),

  admin_enquiry_delete: (id: string) => ({
    url: `/enquiries/${id}`,
    method: "DELETE",
  }),

  contact_create: {
    url: "/contact/create",
    method: "POST",
  },

  contact_all: {
    url: "/contact/all",
    method: "GET",
  },

  contact_by_id: (id: string) => ({
    url: `/contact/${id}`,
    method: "GET",
  }),

  contact_status_update: (id: string) => ({
    url: `/contact/${id}/status`,
    method: "PATCH",
  }),

  contact_reply: (id: string) => ({
    url: `/contact/${id}/reply`,
    method: "POST",
  }),
};

export default SummaryApi;