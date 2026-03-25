import { Toaster } from "@/components/ui/sonner";
import {
  Outlet,
  RouterProvider,
  createRootRoute,
  createRoute,
  createRouter,
} from "@tanstack/react-router";
import { Footer } from "./components/Footer";
import { Header } from "./components/Header";
import AdminPage from "./pages/Admin";
import Auction from "./pages/Auction";
import Catalog from "./pages/Catalog";
import Collectors from "./pages/Collectors";
import Dashboard from "./pages/Dashboard";
import Home from "./pages/Home";
import PetDetail from "./pages/PetDetail";
import Profile from "./pages/Profile";

const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      <div className="flex-1">
        <Outlet />
      </div>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  ),
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/",
  component: Home,
});
const catalogRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/catalog",
  component: Catalog,
});
const petRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/pet/$id",
  component: PetDetail,
});
const auctionRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/auction",
  component: Auction,
});
const collectorsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/collectors",
  component: Collectors,
});
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/profile/$id",
  component: Profile,
});
const dashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/dashboard",
  component: Dashboard,
});
const adminRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: "/admin",
  component: AdminPage,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  catalogRoute,
  petRoute,
  auctionRoute,
  collectorsRoute,
  profileRoute,
  dashboardRoute,
  adminRoute,
]);

const router = createRouter({ routeTree });

declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
