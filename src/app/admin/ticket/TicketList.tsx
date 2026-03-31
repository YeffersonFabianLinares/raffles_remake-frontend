import { useEffect, useRef, useState } from "react"
import { useSearchParams } from "react-router-dom"
import { Dialog, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { usePaginator } from "../../../hooks/usePaginator"
import type { Ticket } from "../../../schemas/admin/ticket.schema"
import { Paginator } from "../../../components/Paginator"
import { useDialogHandler } from "../../../hooks/useDialogHandler"
import useAlert from "../../../hooks/useAlert"
import type { AlertSeverity } from "../../../types/AlertSeverity"
import SpinnerLoad from "../../../components/SpinnerLoad"
import {
    datatable,
    changeState,
    verifyWompi,
    dependencies,
    store,
    generateReference,
} from "../../../services/ticket.service"
import { formatDateTime } from "../../../utils/helpers"
import TicketForm from "./TicketForm"

interface TicketFilters {
    name: string
    document: string
    number: string
    status: string
    seller_id: string
    raffle_id: string
    initial_date: string
    final_date: string
}

interface Deps {
    raffles: { id: number; name: string }[]
    sellers: { id: number; name: string }[]
}

const STATUS_OPTIONS = ['Libre', 'Reservado', 'Pagado', 'En línea']

const TicketList = () => {
    const [searchParams, setSearchParams] = useSearchParams()
    const statusFromUrl = searchParams.get('status') || ''

    const [deps, setDeps] = useState<Deps>({ raffles: [], sellers: [] })

    useEffect(() => {
        dependencies().then(setDeps).catch(console.error)
    }, [])

    const {
        items,
        paginator,
        page,
        setPage,
        refresh,
        loading,
        filters,
        handleChange,
        handleFilter,
        applyFilters,
    } = usePaginator<Ticket, TicketFilters>(datatable, {
        name: '', document: '', number: '', status: statusFromUrl,
        seller_id: '', raffle_id: '', initial_date: '', final_date: ''
    })

    // Referencia para evitar loops al sincronizar URL ↔ filtro
    const prevStatusRef = useRef(statusFromUrl)

    // Cuando el menú cambia la URL → actualiza el filtro y dispara fetch
    useEffect(() => {
        const urlStatus = searchParams.get('status') || ''
        if (urlStatus !== prevStatusRef.current) {
            prevStatusRef.current = urlStatus
            applyFilters({ status: urlStatus })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    // Cuando el usuario cambia el estado en el select → actualiza la URL (el menú se resalta)
    const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        handleChange(e)
        const status = e.target.value
        prevStatusRef.current = status
        if (status) {
            setSearchParams({ status }, { replace: true })
        } else {
            setSearchParams({}, { replace: true })
        }
    }

    const { open, title, id, handleOpen, handleClose } = useDialogHandler({
        create: "Crear Boleta",
        edit: "Editar Boleta"
    })

    const { showAlert } = useAlert()
    const [syncing, setSyncing] = useState(false)

    const handleSuccess = (message: string, alertSeverity: AlertSeverity, status: number | undefined) => {
        if (status && status >= 200 && status < 300) {
            handleClose()
            refresh()
        }
        showAlert(message, alertSeverity)
    }

    const handleChangeState = async (ticketId: number, status: string) => {
        try {
            await changeState(ticketId, status)
            refresh()
            showAlert('Estado actualizado', 'success')
        } catch {
            showAlert('Error al cambiar estado', 'error')
        }
    }

    const handleSyncWompi = async () => {
        setSyncing(true)
        try {
            await verifyWompi()
            refresh()
            showAlert('Sincronización completada', 'success')
        } catch {
            showAlert('Error al sincronizar', 'error')
        } finally {
            setSyncing(false)
        }
    }

    const statusColor = (status: string) => {
        if (status === 'Pagado') return '#d4edda'
        if (status === 'Reservado') return '#fff3cd'
        if (status === 'En línea') return '#cce5ff'
        return ''
    }

    return (
        <>
            {loading && <SpinnerLoad />}
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <TicketForm
                        id={id}
                        onSuccess={handleSuccess}
                        raffles={deps.raffles}
                        sellers={deps.sellers}
                        generateRef={generateReference}
                        storeTicket={store}
                    />
                </DialogContent>
            </Dialog>

            <form className="row g-2 mb-3" onSubmit={handleFilter}>
                <div className="col-md-2">
                    <input className="form-control" placeholder="Nombre cliente" name="name" value={filters.name} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                    <input className="form-control" placeholder="Documento" name="document" value={filters.document} onChange={handleChange} />
                </div>
                <div className="col-md-1">
                    <input className="form-control" placeholder="# Boleta" name="number" value={filters.number} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                    <select className="form-select" name="status" value={filters.status} onChange={handleStatusChange}>
                        <option value="">Todos los estados</option>
                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-select" name="raffle_id" value={filters.raffle_id} onChange={handleChange}>
                        <option value="">Todas las rifas</option>
                        {deps.raffles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                </div>
                <div className="col-md-2">
                    <select className="form-select" name="seller_id" value={filters.seller_id} onChange={handleChange}>
                        <option value="">Todos los vendedores</option>
                        {deps.sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="col-md-2">
                    <input className="form-control" type="date" name="initial_date" value={filters.initial_date} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                    <input className="form-control" type="date" name="final_date" value={filters.final_date} onChange={handleChange} />
                </div>
                <div className="col-md-1">
                    <button className="btn btn-general w-100" type="submit">Buscar</button>
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-general" type="button" onClick={() => handleOpen(0)}>+ Boleta</button>
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-outline-secondary" type="button" onClick={handleSyncWompi} disabled={syncing}>
                        {syncing ? 'Sincronizando...' : 'Sync Wompi'}
                    </button>
                </div>
            </form>

            <TableContainer component={Paper}>
                <Table className="table-bordered" size="small">
                    <TableHead className="bg-general">
                        <TableRow>
                            <TableCell>Boleta</TableCell>
                            <TableCell>Cliente</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Valor</TableCell>
                            <TableCell>Por Pagar</TableCell>
                            <TableCell>Estado</TableCell>
                            <TableCell>Vendedor</TableCell>
                            <TableCell>Fecha</TableCell>
                            <TableCell>Cambiar Estado</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id} style={{ background: statusColor(item.status) }}>
                                <TableCell>{item.number}</TableCell>
                                <TableCell>{item.customer?.name ?? '-'}</TableCell>
                                <TableCell>
                                    {item.customer
                                        ? `(${item.customer.country_code}) ${item.customer.phone}`
                                        : '-'}
                                </TableCell>
                                <TableCell>${Number(item.value).toLocaleString()}</TableCell>
                                <TableCell>${Number(item.value_to_pay).toLocaleString()}</TableCell>
                                <TableCell>{item.status}</TableCell>
                                <TableCell>{item.seller?.name ?? 'Oficina'}</TableCell>
                                <TableCell>{formatDateTime(item.created_at)}</TableCell>
                                <TableCell>
                                    <select
                                        className="form-select form-select-sm"
                                        value={item.status}
                                        onChange={e => handleChangeState(item.id, e.target.value)}
                                    >
                                        {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                                    </select>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={9} align="center">Sin boletas</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paginator {...{ paginator, page, setPage }} />
        </>
    )
}

export default TicketList
