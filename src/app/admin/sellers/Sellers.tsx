import { Dialog, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { datatable } from "../../../services/seller.service"
import { usePaginator } from "../../../hooks/usePaginator"
import type { Seller } from "../../../schemas/admin/seller.schema"
import { Paginator } from "../../../components/Paginator"
import { useDialogHandler } from "../../../hooks/useDialogHandler"
// import CustomerForm from "./CustomerForm"
import useAlert from "../../../hooks/useAlert"
import type { AlertSeverity } from "../../../types/AlertSeverity"
import SpinnerLoad from "../../../components/SpinnerLoad"

interface CustomerFilters {
    name: string
}

const Sellers = () => {

    const {
        items,
        paginator,
        page,
        setPage,
        refresh,
        loading
    } = usePaginator<Seller, CustomerFilters>(datatable, { name: '' })

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
        {loading && <SpinnerLoad />}
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    {/* <CustomerForm id={id} onSuccess={handleSuccess} /> */}
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
                            <TableCell>Documento</TableCell>
                            <TableCell>Correo</TableCell>
                            <TableCell>Acciones</TableCell>
                            <TableCell>Habilitar</TableCell>
                            <TableCell>Eliminar</TableCell>
                            <TableCell>Whatsapp</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell> {item.name} </TableCell>
                                    <TableCell> {item.document_number} </TableCell>
                                    <TableCell> {`(${item.country_code}) ${item.phone}`} </TableCell>
                                    <TableCell>
                                        <div className="d-flex justify-content-center">
                                            <button className="btn btn-general" type="button">
                                                <i className="fas fa-edit"></i>
                                            </button>
                                            <a href="/sellers-tracking/529/" className="">
                                                <button className="btn btn-general" type="button">
                                                    Seguimiento
                                                </button>
                                            </a>
                                            <a href="/sellers-tickets/529/" className="">
                                                <button className="btn btn-general" type="button">
                                                    Asignar
                                                </button>
                                            </a>
                                        </div>
                                    </TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
                                    <TableCell></TableCell>
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

export default Sellers