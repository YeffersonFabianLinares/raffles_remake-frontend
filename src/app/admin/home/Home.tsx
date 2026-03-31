import { useEffect, useState } from "react"
import {
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
} from "@mui/material"
import SpinnerLoad from "../../../components/SpinnerLoad"
import { last } from "../../../services/raffle.service"
import { statsForRaffle, statsBySeller } from "../../../services/ticket.service"

interface RaffleStats {
    total: number
    totalSum: number
    pendiente: number
    pendienteSum: number
    reservado: number
    reservadoSum: number
    pagado: number
    pagadoSum: number
}

interface SellerStat {
    user_id: number | null
    seller_name?: string
    cantidad_boletos: number
    total_recaudado: number
}

const formatCOP = (value: number) =>
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)

const formatNum = (value: number) =>
    new Intl.NumberFormat('es-CO').format(value)

const today = () => new Date().toISOString().split('T')[0]
const monthStart = () => {
    const d = new Date()
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-01`
}

const Home = () => {
    const [loadingStats, setLoadingStats] = useState(true)
    const [loadingSellers, setLoadingSellers] = useState(true)
    const [raffle, setRaffle] = useState<{ id: number; name: string; start_number: number; final_number: number } | null>(null)
    const [stats, setStats] = useState<RaffleStats | null>(null)
    const [free, setFree] = useState(0)
    const [sellerStats, setSellerStats] = useState<SellerStat[]>([])
    const [totalBoletos, setTotalBoletos] = useState(0)
    const [totalRecaudado, setTotalRecaudado] = useState(0)
    const [initialDate, setInitialDate] = useState(monthStart())
    const [finalDate, setFinalDate] = useState(today())

    useEffect(() => {
        loadRaffleStats()
    }, [])

    useEffect(() => {
        loadSellerStats()
    }, [raffle])

    const loadRaffleStats = async () => {
        setLoadingStats(true)
        try {
            const raffleData = await last()
            setRaffle(raffleData)
            const statsData = await statsForRaffle(raffleData.id)
            setStats(statsData.data)
            const total = (raffleData.final_number - raffleData.start_number) + 1
            setFree(total - (statsData.data?.total ?? 0))
        } finally {
            setLoadingStats(false)
        }
    }

    const loadSellerStats = async () => {
        if (!raffle) return
        setLoadingSellers(true)
        try {
            const res = await statsBySeller({ raffle_id: raffle.id, initial_date: initialDate, final_date: finalDate })
            const data: SellerStat[] = res.data ?? []
            setSellerStats(data)
            setTotalBoletos(data.reduce((s, i) => s + i.cantidad_boletos, 0))
            setTotalRecaudado(data.reduce((s, i) => s + i.total_recaudado, 0))
        } finally {
            setLoadingSellers(false)
        }
    }

    const handleSearch = () => {
        loadSellerStats()
    }

    return (
        <div>
            <h4 className="mb-4">Inicio</h4>

            {/* Stats de boletas */}
            <div className="mb-5">
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Reporte de boletas — {raffle?.name ?? '...'}</h5>
                    <div className="d-flex gap-2">
                        <span className="badge bg-secondary fs-6">{formatNum(stats?.total ?? 0)} vendidas / en proceso</span>
                        <span className="badge bg-secondary fs-6">{formatCOP(stats?.totalSum ?? 0)}</span>
                    </div>
                </div>
                {loadingStats ? <SpinnerLoad /> : (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Estado</strong></TableCell>
                                    <TableCell align="right"><strong>Cantidad</strong></TableCell>
                                    <TableCell align="right"><strong>Total</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                <TableRow>
                                    <TableCell>Disponibles</TableCell>
                                    <TableCell align="right">{formatNum(free)}</TableCell>
                                    <TableCell align="right">$0</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Pendientes</TableCell>
                                    <TableCell align="right">{formatNum(stats?.pendiente ?? 0)}</TableCell>
                                    <TableCell align="right">{formatCOP(stats?.pendienteSum ?? 0)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Abonadas</TableCell>
                                    <TableCell align="right">{formatNum(stats?.reservado ?? 0)}</TableCell>
                                    <TableCell align="right">{formatCOP(stats?.reservadoSum ?? 0)}</TableCell>
                                </TableRow>
                                <TableRow>
                                    <TableCell>Pagadas</TableCell>
                                    <TableCell align="right">{formatNum(stats?.pagado ?? 0)}</TableCell>
                                    <TableCell align="right">{formatCOP(stats?.pagadoSum ?? 0)}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>

            {/* Stats por vendedor */}
            <div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h5>Reporte por vendedor</h5>
                    <div className="d-flex gap-2">
                        <span className="badge bg-secondary fs-6">Boletas: {formatNum(totalBoletos)}</span>
                        <span className="badge bg-secondary fs-6">Recaudo: {formatCOP(totalRecaudado)}</span>
                    </div>
                </div>
                <div className="row mb-3">
                    <div className="col-md-4">
                        <TextField
                            label="Fecha inicial"
                            type="date"
                            size="small"
                            fullWidth
                            value={initialDate}
                            onChange={(e) => setInitialDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                    <div className="col-md-4">
                        <TextField
                            label="Fecha final"
                            type="date"
                            size="small"
                            fullWidth
                            value={finalDate}
                            onChange={(e) => setFinalDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </div>
                    <div className="col-md-4 d-flex align-items-center">
                        <button className="btn btn-general btn-sm" onClick={handleSearch}>Buscar</button>
                    </div>
                </div>
                {loadingSellers ? <SpinnerLoad /> : (
                    <TableContainer component={Paper}>
                        <Table size="small">
                            <TableHead>
                                <TableRow>
                                    <TableCell><strong>Vendedor</strong></TableCell>
                                    <TableCell align="right"><strong>Cantidad</strong></TableCell>
                                    <TableCell align="right"><strong>Total recaudado</strong></TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {sellerStats.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={3} align="center">Sin datos</TableCell>
                                    </TableRow>
                                ) : sellerStats.map((row, i) => (
                                    <TableRow key={i}>
                                        <TableCell>
                                            {row.user_id === null
                                                ? 'Compra en línea'
                                                : row.user_id === 1
                                                    ? 'Rifas y Sorteos'
                                                    : row.seller_name ?? `Vendedor ${row.user_id}`}
                                        </TableCell>
                                        <TableCell align="right">{formatNum(row.cantidad_boletos)}</TableCell>
                                        <TableCell align="right">{formatCOP(row.total_recaudado)}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </div>
        </div>
    )
}

export default Home
