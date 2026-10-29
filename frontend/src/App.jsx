import ShopPage from "./pages/ShopPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ProductDetailsPage from "./pages/ProductDetailsPage";
import OrderConfirmationPage from "./pages/OrderConfirmationPage";

import { AdminLoginPage } from "./pages/AdminLoginPage";
import { AdminDashboardPage } from "./pages/AdminDashboardPage";
import { AdminRoute } from "./pages/AdminRoute";

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
            </Route>

            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={<AdminRoute><AdminDashboardPage /></AdminRoute>} />
            
          </Routes>
      </CartProvider>
    </BrowserRouter>
  )
}

export default App;
