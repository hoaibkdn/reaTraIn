import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  route("/example", "routes/example.tsx"),
  route("/test", "routes/test.tsx"),
  route("/list", "routes/list.tsx"),
  route("/memohook", "routes/memohook.tsx"),
] satisfies RouteConfig;
