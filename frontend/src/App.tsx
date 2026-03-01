import { RouterProvider, createRouter, createRoute, createRootRoute, Outlet } from '@tanstack/react-router';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Listings from './pages/Listings';
import ListingDetail from './pages/ListingDetail';
import SellCar from './pages/SellCar';
import SellCarConfirmation from './pages/SellCarConfirmation';
import ResaleValueChecker from './pages/ResaleValueChecker';
import VehicleLookup from './pages/VehicleLookup';
import { Toaster } from '@/components/ui/sonner';

function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navbar />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <Toaster richColors position="top-right" />
    </div>
  );
}

const rootRoute = createRootRoute({ component: Layout });

const homeRoute = createRoute({ getParentRoute: () => rootRoute, path: '/', component: Home });
const listingsRoute = createRoute({ getParentRoute: () => rootRoute, path: '/listings', component: Listings });
const listingDetailRoute = createRoute({ getParentRoute: () => rootRoute, path: '/listings/$id', component: ListingDetail });
const sellRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sell', component: SellCar });
const sellConfirmationRoute = createRoute({ getParentRoute: () => rootRoute, path: '/sell/confirmation', component: SellCarConfirmation });
const resaleValueRoute = createRoute({ getParentRoute: () => rootRoute, path: '/resale-value', component: ResaleValueChecker });
const vehicleLookupRoute = createRoute({ getParentRoute: () => rootRoute, path: '/vehicle-lookup', component: VehicleLookup });

const routeTree = rootRoute.addChildren([
  homeRoute,
  listingsRoute,
  listingDetailRoute,
  sellRoute,
  sellConfirmationRoute,
  resaleValueRoute,
  vehicleLookupRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
