import products from "./data/coffeeProducts";
import ProductDisplay from "./components/ProductDisplay";
import NavbarMain from "./components/Navbar";
import ProductsFilter from "./components/ProductsFilter";
import ShopPage from "./pages/ShopPage";

import { Container, Row, Card, Form } from 'react-bootstrap';

import { BrowserRouter, Routes, Route, Navigate } from "react-router";


function App() {
  return (
    <BrowserRouter>
      <NavbarMain />

      <Routes>
        <Route path="/" element={<Navigate to="/coffee" replace />} />
        <Route path="/coffee" element={<ShopPage title="Coffee Products" category="coffee" products={products.filter(product => product.category === "coffee")}/>} />
        <Route path="/equipment" element={<ShopPage title="Equipment" category="equipment" products={products.filter(product => product.category === "equipment")} />} />
        <Route path="/merch" element={<ShopPage title="Merchandise" category="merch" products={products.filter(product => product.category === "merch")} />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
