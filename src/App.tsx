import { Navigate, Route, Routes } from "react-router-dom";
import { CustomerLayout } from "./components/CustomerLayout";
import { ScrollManager } from "./components/ScrollManager";
import Home from "./pages/customer/Home";
import Catalogue from "./pages/customer/Catalogue";
import ProductDetail from "./pages/customer/ProductDetail";
import Checkout from "./pages/customer/Checkout";
import OrderPage from "./pages/customer/OrderPage";
import MyOrders from "./pages/customer/MyOrders";
import Info from "./pages/customer/Info";
import { AdminLayout } from "./pages/admin/AdminLayout";
import Overview from "./pages/admin/Overview";
import Products from "./pages/admin/Products";
import Inventory from "./pages/admin/Inventory";
import Orders from "./pages/admin/Orders";
import Customers from "./pages/admin/Customers";
import SettingsPage from "./pages/admin/SettingsPage";

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route element={<CustomerLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/catalogue" element={<Catalogue />} />
          <Route path="/product/:id" element={<ProductDetail />} />
          <Route path="/checkout/:id" element={<Checkout />} />
          <Route path="/order/:id" element={<OrderPage />} />
          <Route path="/orders" element={<MyOrders />} />
          <Route path="/info/:topic" element={<Info />} />
        </Route>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<Overview />} />
          <Route path="products" element={<Products />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="customers" element={<Customers />} />
          <Route path="settings" element={<SettingsPage />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
