import { Route, Routes } from "react-router-dom"
import Login from "./app/auth/Login"
import AdminSidebar from "./components/AdminSidebar"
import Customers from "./app/admin/Customers"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<Login />} />
            <Route element={<AdminSidebar />}>
            <Route path="customers" element={<Customers />}></Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes