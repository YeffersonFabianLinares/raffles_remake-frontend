import { Dialog, DialogContent, DialogTitle, Paper, Switch, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { usePaginator } from "../../../hooks/usePaginator"
import type { Promotion } from "../../../schemas/admin/promotion.schema"
import { Paginator } from "../../../components/Paginator"
import { useDialogHandler } from "../../../hooks/useDialogHandler"
import PromotionForm from "./PromotionForm"
import useAlert from "../../../hooks/useAlert"
import type { AlertSeverity } from "../../../types/AlertSeverity"
import SpinnerLoad from "../../../components/SpinnerLoad"
import { datatable, changeState } from "../../../services/promotion.service"
import { formatDate } from "../../../utils/helpers"

interface PromotionFilters {
    name: string
}

const Promotions = () => {
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
    } = usePaginator<Promotion, PromotionFilters>(datatable, { name: '' })

    const { open, title, id, handleOpen, handleClose } = useDialogHandler({
        create: "Crear Promoción",
        edit: "Editar Promoción"
    })

    const { showAlert } = useAlert()

    const handleSuccess = (message: string, alertSeverity: AlertSeverity, status: number | undefined) => {
        if (status && status >= 200 && status < 300) {
            handleClose()
            refresh()
        }
        showAlert(message, alertSeverity)
    }

    const handleToggleState = async (promo: Promotion) => {
        const newState = promo.state === 1 ? 0 : 1
        try {
            await changeState(promo.id, newState)
            refresh()
        } catch {
            showAlert('Error al cambiar estado', 'error')
        }
    }

    return (
        <>
            {loading && <SpinnerLoad />}
            <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <PromotionForm id={id} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            <form className="row g-2 mb-3" onSubmit={handleFilter}>
                <div className="col-md-4">
                    <input className="form-control" placeholder="Buscar por nombre" name="name" value={filters.name} onChange={handleChange} />
                </div>
                <div className="col-md-2">
                    <button className="btn btn-general w-100" type="submit">Buscar</button>
                </div>
                <div className="col-md-auto">
                    <button className="btn btn-general" type="button" onClick={() => handleOpen(0)}>+ Promoción</button>
                </div>
            </form>

            <TableContainer component={Paper}>
                <Table className="table-bordered">
                    <TableHead className="bg-general">
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell># Boletas</TableCell>
                            <TableCell>Nuevo Valor</TableCell>
                            <TableCell>Vence</TableCell>
                            <TableCell>Activo</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>{item.number_of_tickets}</TableCell>
                                <TableCell>${Number(item.new_value).toLocaleString()}</TableCell>
                                <TableCell>{item.expiration_date ? formatDate(item.expiration_date) : '-'}</TableCell>
                                <TableCell>
                                    <Switch
                                        checked={item.state === 1}
                                        onChange={() => handleToggleState(item)}
                                    />
                                </TableCell>
                                <TableCell>
                                    <button className="btn btn-general btn-sm" onClick={() => handleOpen(item.id)}>
                                        Editar
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {items.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={6} align="center">Sin promociones</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
            <Paginator {...{ paginator, page, setPage }} />
        </>
    )
}

export default Promotions
