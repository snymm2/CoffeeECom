import products from "./data/coffeeProducts";

import SiteFooter from "./components/layout/SiteFooter";

import ShopPage from "./pages/ShopPage";
import HomePage from "./pages/HomePage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";

import { BrowserRouter, Routes, Route, Navigate } from "react-router";
import { CartProvider } from "./context/CartContext";

function App() {
  return (
    <BrowserRouter>
      <CartProvider>
          <Routes>
            <Route path="/" element={<HomePage key="home"/>} />
            <Route path="/shop" element={<Navigate to="/shop/coffee" replace />} />
            <Route path="/shop/coffee" element={<ShopPage title="Coffee Products" key="coffee" category="coffee" products={products.filter(product => product.category === "coffee")}/>} />
            <Route path="/shop/equipment" element={<ShopPage title="Equipment" key="equipment" category="equipment" products={products.filter(product => product.category === "equipment")} />} />
            <Route path="/shop/merch" element={<ShopPage title="Merchandise" key="merch" category="merch" products={products.filter(product => product.category === "merch")} />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
          </Routes>

          <SiteFooter />
      </CartProvider>
    </BrowserRouter>
  )
}

export default App
