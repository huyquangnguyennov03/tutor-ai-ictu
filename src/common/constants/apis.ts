export const API_ENDPOINTS = {
  CORE_API: {
    LOGIN: "/auth/login",
    REFRESH_TOKEN: "/auth/refresh-token",
  },
  USER: {
    FETCH_USERS: "/users",
  },
  VPS: {
    FETCH_ADMIN_VPS: "/admin/vps",
    FETCH_PROVIDER_VPS: "/provider/vps",

    FETCH_ADMIN_VPS_DETAIL: "/admin/vps",
    FETCH_PROVIDER_VPS_DETAIL: "/provider/vps",

    ADD_ADMIN_VPS: "/admin/vps",
    ADD_PROVIDER_VPS: "/provider/vps/request",

    EDIT_ADMIN_VPS: "/admin/vps",
    EDIT_PROVIDER_VPS: "/provider/vps",

    DELETE_ADMIN_VPS: "/admin/vps",
    DELETE_PROVIDER_VPS: "/provider/vps",
  },
  VPS_TYPE: {
    FETCH_VPS_TYPES: "/admin/vps-type",
    FETCH_VPS_TYPE_DETAIL: "/admin/vps-type",
    ADD_VPS_TYPE: "/admin/vps-type",
    EDIT_VPS_TYPE: "/admin/vps-type",
    DELETE_VPS_TYPE: "/admin/vps-type",

    FETCH_PROVIDER_VPS_TYPES: "/provider/vps-type",
  },
  SEMESTERS:{
    FETCH_SEMESTERS:"",
  },
  COURSES:{
    FETCH_COURSES:"/courses",
  }
}
