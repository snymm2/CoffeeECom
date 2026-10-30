import ShopPage from "./pages/shop/ShopPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/shop/CartPage";
import CheckoutPage from "./pages/shop/CheckoutPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import OrderConfirmationPage from "./pages/shop/OrderConfirmationPage";

import { AdminLoginPage } from "./pages/admin/AdminLoginPage";
import { AdminDashboardPage } from "./pages/admin/AdminDashboardPage";
import { AdminRoute } from "./pages/admin/AdminRoute";

import BrewingGuidePage from "./pages/guide/BrewingGuidePage"
import RoastLevelsPage from "./pages/guide/RoastLevelsPage";

import StoreLayout from "./components/layout/StoreLayout";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
          <Routes>
            <Route element={<StoreLayout />}>
              <Route path="/" element={<HomePage key="home"/>} />

              <Route path="/shop" element={<Navigate to="/shop/coffee" replace />} />
              <Route path="/shop/coffee" element={<ShopPage title="Coffee Products" key="coffee" category="coffee" />} />
              <Route path="/shop/equipment" element={<ShopPage title="Equipment" key="equipment" category="equipment" />} />
              <Route path="/shop/merch" element={<ShopPage title="Merchandise" key="merch" category="merch" />} />
              
              <Route path="/cart" element={<CartPage />} />

              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/checkout/order-confirmation/:orderId" element={<OrderConfirmationPage />} />

              <Route path="/products/:id" element={<ProductDetailsPage />} />

            <Route path="/brew-guides/pour-over" element={<BrewingGuidePage method="pourOver" productIds={["6ada31b7e29c1dfecea274e3"]}/>} />
              <Route path="/brew-guides/french-press" element={<BrewingGuidePage method="frenchPress" />} />
              <Route path="/brew-guides/moka-pot" element={<BrewingGuidePage method="mokaPot" />} />
              <Route path="/brew-guides/roast-levels" element={<RoastLevelsPage />} />
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            
          </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App;
