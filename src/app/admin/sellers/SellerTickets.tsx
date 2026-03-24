import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { dependencies, showRange, storeRange } from "../../../services/seller_tickets.service"
import SpinnerLoad from "../../../components/SpinnerLoad"

interface RaffleOption {
    id: number
    name: string
    start_number: number
    final_number: number
}

interface RangeRecord {
    id: number
    numbers: string[]
    raffle?: { name: string }
    created_at: string
}

const SellerTickets = () => {
    const { id } = useParams<{ id: string }>()
    const navigate = useNavigate()
    const [raffles, setRaffles] = useState<RaffleOption[]>([])
    const [ranges, setRanges] = useState<RangeRecord[]>([])
    const [loading, setLoading] = useState(false)
    const [selectedRaffle, setSelectedRaffle] = useState('')
    const [startNum, setStartNum] = useState('')
    const [endNum, setEndNum] = useState('')
    const [saving, setSaving] = useState(false)

    const sellerId = Number(id)

    useEffect(() => {
        if (!sellerId) return
        setLoading(true)
        Promise.all([dependencies(), showRange(sellerId)])
            .then(([deps, rangeData]) => {
                setRaffles(deps.raffles ?? [])
                setRanges(rangeData ?? [])
            })
            .catch(console.error)
            .finally(() => setLoading(false))
    }, [sellerId])

    const generateNumbers = (start: string, end: string): string[] => {
        const s = parseInt(start)
        const e = parseInt(end)
        if (isNaN(s) || isNaN(e) || s > e) return []
        return Array.from({ length: e - s + 1 }, (_, i) => String(s + i).padStart(4, '0'))
    }

    const handleSave = async () => {
        if (!selectedRaffle || !startNum || !endNum) return
        const numbers = generateNumbers(startNum, endNum)
        if (numbers.length === 0) return
        setSaving(true)
        try {
            await storeRange(sellerId, { raffle_id: Number(selectedRaffle), numbers })
            const updated = await showRange(sellerId)
            setRanges(updated ?? [])
            setStartNum('')
            setEndNum('')
        } catch (e) {
            console.error(e)
        } finally {
            setSaving(false)
        }
    }

    return (
        <>
            {loading && <SpinnerLoad />}
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5>Asignar Boletas al Vendedor</h5>
                <button className="btn btn-general" onClick={() => navigate('/sellers')}>Volver</button>
            </div>

            <div className="row g-2 mb-4">
                <div className="col-md-3">
                    <label className="form-label">Rifa</label>
                    <select className="form-select" value={selectedRaffle} onChange={e => setSelectedRaffle(e.target.value)}>
                        <option value="">Selecciona una rifa</option>
                        {raffles.map(r => (
                            <option key={r.id} value={r.id}>{r.name}</option>
                        ))}
                    </select>
                </div>
                <div className="col-md-3">
                    <label className="form-label">Desde</label>
                    <input className="form-control" placeholder="0001" value={startNum} onChange={e => setStartNum(e.target.value)} />
                </div>
                <div className="col-md-3">
                    <label className="form-label">Hasta</label>
                    <input className="form-control" placeholder="0100" value={endNum} onChange={e => setEndNum(e.target.value)} />
                </div>
                <div className="col-md-3 d-flex align-items-end">
                    <button className="btn btn-general w-100" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : 'Asignar Rango'}
                    </button>
                </div>
            </div>

            <TableContainer component={Paper}>
                <Table className="table-bordered">
                    <TableHead className="bg-general">
                        <TableRow>
                            <TableCell>Rifa</TableCell>
                            <TableCell>Cantidad</TableCell>
                            <TableCell>Rango</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {ranges.map((r) => (
                            <TableRow key={r.id}>
                                <TableCell>{r.raffle?.name ?? '-'}</TableCell>
                                <TableCell>{r.numbers?.length ?? 0}</TableCell>
                                <TableCell>{r.numbers?.[0]} — {r.numbers?.[r.numbers.length - 1]}</TableCell>
                            </TableRow>
                        ))}
                        {ranges.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={3} align="center">Sin rangos asignados</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default SellerTickets
