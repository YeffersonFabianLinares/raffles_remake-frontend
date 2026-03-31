import { Route, Routes } from "react-router-dom"
import Login from "./app/auth/Login"
import AdminSidebar from "./components/AdminSidebar"
import Customers from "./app/admin/customer/Customers"
import Sellers from "./app/admin/sellers/Sellers"
import SellerTracking from "./app/admin/sellers/SellerTracking"
import SellerTickets from "./app/admin/sellers/SellerTickets"
import Raffles from "./app/admin/raffle/Raffles"
import TicketList from "./app/admin/ticket/TicketList"
import TicketFree from "./app/admin/ticket/TicketFree"
import Promotions from "./app/admin/promotion/Promotions"

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/admin" element={<Login />} />
            <Route element={<AdminSidebar />}>
                <Route path="customers" element={<Customers />} />
                <Route path="sellers" element={<Sellers />} />
                <Route path="sellers/:id/tracking" element={<SellerTracking />} />
                <Route path="sellers/:id/tickets" element={<SellerTickets />} />
                <Route path="raffles" element={<Raffles />} />
                <Route path="tickets" element={<TicketList />} />
                <Route path="tickets/en-linea" element={<TicketList defaultStatus="En línea" />} />
                <Route path="tickets/pagadas" element={<TicketList defaultStatus="Pagado" />} />
                <Route path="tickets/con-abono" element={<TicketList defaultStatus="Reservado" />} />
                <Route path="tickets/sin-abono" element={<TicketList defaultStatus="Reservado" />} />
                <Route path="tickets/disponibles" element={<TicketFree />} />
                <Route path="promotions" element={<Promotions />} />
            </Route>
        </Routes>
    )
}

export default AppRoutes
