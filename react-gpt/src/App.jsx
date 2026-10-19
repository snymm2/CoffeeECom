import products from "./data/coffeeProducts";

import NavbarMain from "./components/Navbar";
import SiteNavbar from "./components/layout/SiteNavbar";
import SiteFooter from "./components/layout/SiteFooter";

import ShopPage from "./pages/ShopPage";


import { BrowserRouter, Routes, Route, Navigate } from "react-router";


function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/shop/coffee" replace />} />
        <Route path="/shop" element={<Navigate to="/shop/coffee" replace />} />
        <Route path="/shop/coffee" element={<ShopPage title="Coffee Products" key="coffee" category="coffee" products={products.filter(product => product.category === "coffee")}/>} />
        <Route path="/shop/equipment" element={<ShopPage title="Equipment" key="equipment" category="equipment" products={products.filter(product => product.category === "equipment")} />} />
        <Route path="/shop/merch" element={<ShopPage title="Merchandise" key="merch" category="merch" products={products.filter(product => product.category === "merch")} />} />
      </Routes>

      <SiteFooter />
    </BrowserRouter>
  )
}

export default App
