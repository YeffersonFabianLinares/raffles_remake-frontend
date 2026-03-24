import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Dialog, DialogContent, DialogTitle, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { datatable, destroy, updateStatus } from "../../../services/seller.service"
import { usePaginator } from "../../../hooks/usePaginator"
import type { Seller } from "../../../schemas/admin/seller.schema"
import { Paginator } from "../../../components/Paginator"
import { useDialogHandler } from "../../../hooks/useDialogHandler"
import SellerForm from "./SellerForm"
import useAlert from "../../../hooks/useAlert"
import type { AlertSeverity } from "../../../types/AlertSeverity"
import SpinnerLoad from "../../../components/SpinnerLoad"

interface SellerFilters {
    name: string
    document_number: string
    email: string
}

const Sellers = () => {
    const navigate = useNavigate()

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
    } = usePaginator<Seller, SellerFilters>(datatable, { name: '', document_number: '', email: '' })

    const { open, title, id, handleOpen, handleClose } = useDialogHandler({
        create: "Registrar Vendedor",
        edit: "Editar Vendedor"
    })

    const { showAlert } = useAlert()

    const [deletingId, setDeletingId] = useState<number | null>(null)

    const handleSuccess = (message: string, alertSeverity: AlertSeverity, status: number | undefined) => {
        if (status && status >= 200 && status < 300) {
            handleClose()
            refresh()
        }
        showAlert(message, alertSeverity)
    }

    const handleDelete = async (sellerId: number) => {
        if (!confirm('¿Estás seguro de eliminar este vendedor?')) return
        setDeletingId(sellerId)
        try {
            await destroy(sellerId)
            refresh()
            showAlert('Vendedor eliminado', 'success')
        } catch {
            showAlert('Error al eliminar', 'error')
        } finally {
            setDeletingId(null)
        }
    }

    const handleToggleState = async (seller: Seller) => {
        const newState = seller.state === 1 ? 0 : 1
        try {
            await updateStatus(seller.id, newState)
            refresh()
        } catch {
            showAlert('Error al cambiar estado', 'error')
        }
    }

    return (
        <>
            {loading && <SpinnerLoad />}
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <SellerForm id={id} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            <form className="row g-2 mb-3" onSubmit={handleFilter}>
                <div className="col-md-3">
                    <input className="form-control" placeholder="Nombre" name="name" value={filters.name} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                    <input className="form-control" placeholder="Documento" name="document_number" value={filters.document_number} onChange={handleChange} />
                </div>
                <div className="col-md-3">
                    <input className="form-control" placeholder="Correo" name="email" value={filters.email} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-general w-100" type="submit">Buscar</button>
                </div>
                <div className="col-md-1">
                    <button className="btn btn-general w-100" type="button" onClick={() => handleOpen(0)}>+</button>
                </div>
            </form>

            <TableContainer component={Paper}>
                <Table className="table-bordered">
                    <TableHead className="bg-general">
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Documento</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.document_number}</TableCell>
                                <TableCell>{`(${item.country_code}) ${item.phone}`}</TableCell>
                                <TableCell>{item.user?.email ?? '-'}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={item.state === 1}
                                        onChange={() => handleToggleState(item)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <div className="d-flex gap-1 flex-wrap">
                                        <button className="btn btn-general btn-sm" onClick={() => handleOpen(item.id)}>
                                            Editar
                                        </button>
                                        <button className="btn btn-general btn-sm" onClick={() => navigate(`/sellers/${item.id}/tracking`)}>
                                            Seguimiento
                                        </button>
                                        <button className="btn btn-general btn-sm" onClick={() => navigate(`/sellers/${item.id}/tickets`)}>
                                            Asignar
                                        </button>
                                        <a
                                            href={`https://wa.me/${item.country_code}${item.phone}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="btn btn-success btn-sm"
                                        >
                                            WA
                                        </a>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() => handleDelete(item.id)}
                                            disabled={deletingId === item.id}
                                        >
                                            Eliminar
                                        </button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paginator {...{ paginator, page, setPage }} />
        </>
    )
}

export default Sellers
