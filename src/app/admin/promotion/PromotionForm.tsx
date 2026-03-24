import { Button, CircularProgress, TextField } from "@mui/material"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect, useState } from "react"
import type { GenericFormProps } from "../../../interfaces/GenericFormProps"
import { type PromotionSchema, promotionSchema } from "../../../schemas/admin/promotion.schema"
import { useAsyncFormHandler } from "../../../hooks/useAsyncFormHandler"
import { show, store, update } from "../../../services/promotion.service"
import { datatable as raffleList } from "../../../services/raffle.service"
import ErrorMessage from "../../../components/ErrorMessage"

export const PromotionForm: React.FC<GenericFormProps> = ({ id, onSuccess }) => {
    const [raffles, setRaffles] = useState<{ id: number; name: string }[]>([])

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
    } = useForm<PromotionSchema>({
        resolver: zodResolver(promotionSchema)
    })

    const { execute, isLoading } = useAsyncFormHandler()

    useEffect(() => {
        raffleList().then(setRaffles).catch(console.error)
        if (id) {
            show(id).then(reset).catch(console.error)
        }
    }, [])

    const onSubmit = async (data: PromotionSchema) => {
        const action = () => id ? update(data, id) : store(data)
        const { response, message, alertSeverity } = await execute(
            action,
            'Datos guardados con éxito',
            'Error: datos inválidos.'
        )
        setTimeout(() => {
            onSuccess(message, alertSeverity, response?.status ?? (id ? 200 : 201))
        }, 500)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="label">Nombre</label>
                    <TextField fullWidth {...register('name')} />
                    <ErrorMessage message={errors.name?.message} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="label">Rifa</label>
                    <select className="form-select" {...register('raffle_id')}>
                        <option value="">Selecciona una rifa</option>
                        {raffles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <ErrorMessage message={errors.raffle_id?.message?.toString()} />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="label">Número de Boletas</label>
                    <TextField fullWidth type="number" {...register('number_of_tickets')} />
                    <ErrorMessage message={errors.number_of_tickets?.message?.toString()} />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="label">Nuevo Valor</label>
                    <TextField fullWidth type="number" {...register('new_value')} />
                    <ErrorMessage message={errors.new_value?.message?.toString()} />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="label">Fecha de Expiración</label>
                    <TextField fullWidth type="date" {...register('expiration_date')} InputLabelProps={{ shrink: true }} />
                </div>
            </div>
            <div className="d-flex justify-content-center mt-3">
                <Button
                    disabled={isLoading}
                    startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                    type="submit"
                    variant="outlined">
                    {isLoading ? 'Guardando...' : 'Guardar'}
                </Button>
            </div>
        </form>
    )
}

export default PromotionForm
