import { useEffect, useState } from "react"
import { Dialog, DialogContent, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material"
import { datatable } from "../../../services/raffle.service"
import type { Raffle } from "../../../schemas/admin/raffle.schema"
import { useDialogHandler } from "../../../hooks/useDialogHandler"
import RaffleForm from "./RaffleForm"
import useAlert from "../../../hooks/useAlert"
import type { AlertSeverity } from "../../../types/AlertSeverity"
import SpinnerLoad from "../../../components/SpinnerLoad"
import { formatDate } from "../../../utils/helpers"

const Raffles = () => {
    const [raffles, setRaffles] = useState<Raffle[]>([])
    const [loading, setLoading] = useState(false)

    const load = () => {
        setLoading(true)
        datatable()
            .then(setRaffles)
            .catch(console.error)
            .finally(() => setLoading(false))
    }

    useEffect(() => { load() }, [])

    const { open, title, id, handleOpen, handleClose } = useDialogHandler({
        create: "Crear Rifa",
        edit: "Editar Rifa"
    })

    const { showAlert } = useAlert()

    const handleSuccess = (message: string, alertSeverity: AlertSeverity, status: number | undefined) => {
        if (status && status >= 200 && status < 300) {
            handleClose()
            load()
        }
        showAlert(message, alertSeverity)
    }

    return (
        <>
            {loading && <SpinnerLoad />}
            <Dialog open={open} onClose={handleClose} maxWidth="lg" fullWidth>
                <DialogTitle>{title}</DialogTitle>
                <DialogContent>
                    <RaffleForm id={id} onSuccess={handleSuccess} />
                </DialogContent>
            </Dialog>

            <div className="d-flex justify-content-end mb-3">
                <button className="btn btn-general" onClick={() => handleOpen(0)}>Crear Rifa</button>
            </div>

            <TableContainer component={Paper}>
                <Table className="table-bordered">
                    <TableHead className="bg-general">
                        <TableRow>
                            <TableCell>Nombre</TableCell>
                            <TableCell>Valor Boleta</TableCell>
                            <TableCell>Números</TableCell>
                            <TableCell>Fecha Rifa</TableCell>
                            <TableCell>Acciones</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {raffles.map((item) => (
                            <TableRow key={item.id}>
                                <TableCell>{item.name}</TableCell>
                                <TableCell>${Number(item.value_ticket).toLocaleString()}</TableCell>
                                <TableCell>{item.start_number} — {item.final_number}</TableCell>
                                <TableCell>{item.raffle_date ? formatDate(item.raffle_date) : '-'}</TableCell>
                                <TableCell>
                                    <button className="btn btn-general btn-sm" onClick={() => handleOpen(item.id)}>
                                        Editar
                                    </button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {raffles.length === 0 && !loading && (
                            <TableRow>
                                <TableCell colSpan={5} align="center">Sin rifas registradas</TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}

export default Raffles
