import { Dialog, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { datatable } from "../../../services/customer.service"
import { usePaginator } from "../../../hooks/usePaginator"
import type { Customer } from "../../../schemas/admin/customer.schema"
import { Paginator } from "../../../components/Paginator"
import { useDialogHandler } from "../../../hooks/useDialogHandler"
import CustomerForm from "./CustomerForm"
import useAlert from "../../../hooks/useAlert"
import type { AlertSeverity } from "../../../types/AlertSeverity"

interface CustomerFilters {
    name: string
}

const Customers = () => {

    const {
        items,
        paginator,
        page,
        setPage,
        refresh
    } = usePaginator<Customer, CustomerFilters>(datatable, { name: '' })

    /** Control de Dialog con formulario inyectado */
    const { open, title, id, handleOpen, handleClose } = useDialogHandler({
        create: "Crear Nuevo Cliente",
        edit: "Edición de Cliente"
    });

    /** Control de alertas/notificaciones en pantalla. */
    const { showAlert } = useAlert()

    /**
     * @param message - Mensaje retornado por el servidor.
     * @param alertSeverity - Nivel de la alerta (success, error, etc).
     * @param status - Código HTTP de respuesta.
     */
    const handleSuccess = (message: string, alertSeverity: AlertSeverity, status: number | undefined) => {
        if (status == 200) {
            handleClose()
            refresh()
        }
        showAlert(message, alertSeverity)
    }

    return (
        <>
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <CustomerForm id={id} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>
            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-general" onClick={() => handleOpen(0)}>Registrar</button>
            </div>
            <TableContainer component={Paper}>
                <Table className="table-bordered">
                    <TableHead className="bg-general">
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Teléfono</TableCell>
                            <TableCell>Documento</TableCell>
                            <TableCell>Ciudad</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell> {item.name} </TableCell>
                                    <TableCell> {`(${item.country_code}) ${item.phone}`} </TableCell>
                                    <TableCell> {item.document} </TableCell>
                                    <TableCell> {item.city.name} </TableCell>
                                    <TableCell>
                                        <button className="btn btn-general" onClick={() => handleOpen(item.id)}>Editar</button>
                                    </TableCell>
                                </TableRow>
                            ))
                        }
                    </TableBody>
                </Table>
            </TableContainer>
            <Paginator {...{ paginator, page, setPage }} />
        </>
    )
}

export default Customers