import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { tracking } from "../../../services/seller.service"
import SpinnerLoad from "../../../components/SpinnerLoad"
import { formatDateTime } from "../../../utils/helpers"

interface TrackingRecord {
    id: number
    number: string
    status: string
    value: number | string
    value_to_pay: number | string
    created_at: string
    customer?: {
        name: string
        phone: string
        country_code: string
    }
}

const SellerTracking = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [records, setRecords] = useState<TrackingRecord[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const trackingFn = async() => {
            if (!id) return
            setLoading(true)
            tracking(Number(id))
                .then(setRecords)
                .catch(console.error)
                .finally(() => setLoading(false))
        }
        trackingFn()
    }, [id])

    return (
        <>
            {loading && <SpinnerLoad />}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Seguimiento de Vendedor</h5>
                <button className="btn btn-general" onClick={() => navigate('/sellers')}>Volver</button>
            </div>
            <TableContainer component={Paper}>
                <Table className="table-bordered">
                    <TableHead className="bg-general">
                        <TableRow>
                            <TableCell>#</TableCell>
                            <TableCell>Número</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Por Pagar</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Fecha</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {records.map((rec, idx) => (
                            <TableRow key={rec.id}>
                                <TableCell>{idx + 1}</TableCell>
                                <TableCell>{rec.number}</TableCell>
                                <TableCell>{rec.status}</TableCell>
                                <TableCell>${Number(rec.value).toLocaleString()}</TableCell>
                                <TableCell>${Number(rec.value_to_pay).toLocaleString()}</TableCell>
                                <TableCell>
                                    {rec.customer
                                        ? `${rec.customer.name} (${rec.customer.country_code} ${rec.customer.phone})`
                                        : '-'}
                                </TableCell>
                                <TableCell>{formatDateTime(rec.created_at)}</TableCell>
                            </TableRow>
                        ))}
                        {records.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={7} align="center">Sin registros</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default SellerTracking
