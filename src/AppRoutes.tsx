import { Route, Routes } from "react-router-dom"
import Login from "./app/auth/Login"
import AdminSidebar from "./components/AdminSidebar"
import Customers from "./app/admin/customer/Customers"
import TicketFree from "./app/admin/ticket/TicketFree"
import Sellers from "./app/admin/sellers/Sellers"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<Login />} />
            <Route element={<AdminSidebar />}>
                <Route path="customers" element={<Customers />}></Route>
                <Route path="sellers" element={<Sellers />}></Route>
                <Route path="tickets">
                    <Route path="Libre" element={<TicketFree />} />
                </Route>
            </Route>
        </Routes>
    )
}

export default AppRoutes