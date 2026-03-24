import { Button, CircularProgress, TextField } from "@mui/material"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useEffect } from "react"
import type { GenericFormProps } from "../../../interfaces/GenericFormProps"
import { type RaffleSchema, raffleSchema } from "../../../schemas/admin/raffle.schema"
import { useAsyncFormHandler } from "../../../hooks/useAsyncFormHandler"
import { show, store, update } from "../../../services/raffle.service"
import ErrorMessage from "../../../components/ErrorMessage"

export const RaffleForm: React.FC<GenericFormProps> = ({ id, onSuccess }) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        control,
    } = useForm<RaffleSchema>({
        resolver: zodResolver(raffleSchema),
        defaultValues: { awards: [{ award: '', date: '', type_award: '1', image: '' }] }
    })

    const { fields, append, remove } = useFieldArray({ control, name: 'awards' })

    const { execute, isLoading } = useAsyncFormHandler()

    const onSubmit = async (data: RaffleSchema) => {
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

    useEffect(() => {
        if (id) {
            show(id).then(reset).catch(console.error)
        }
    }, [])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-6 mb-3">
                    <label className="label">Nombre de la Rifa</label>
                    <TextField fullWidth {...register('name')} />
                    <ErrorMessage message={errors.name?.message} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Valor Boleta</label>
                    <TextField fullWidth type="number" {...register('value_ticket')} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Fecha Rifa</label>
                    <TextField fullWidth type="date" {...register('raffle_date')} InputLabelProps={{ shrink: true }} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Número Inicial</label>
                    <TextField fullWidth {...register('start_number')} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Número Final</label>
                    <TextField fullWidth {...register('final_number')} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Pago Total</label>
                    <TextField fullWidth type="number" {...register('paymentall')} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Primer Pago</label>
                    <TextField fullWidth type="number" {...register('paymentfirst')} />
                </div>
                <div className="col-md-6 mb-3">
                    <label className="label">Descripción</label>
                    <TextField fullWidth multiline rows={2} {...register('description')} />
                </div>
            </div>

            <hr />
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6>Premios</h6>
                <button
                    type="button"
                    className="btn btn-general btn-sm"
                    onClick={() => append({ award: '', date: '', type_award: '1', image: '' })}
                >
                    + Premio
                </button>
            </div>
            {fields.map((field, index) => (
                <div className="row align-items-center mb-2" key={field.id}>
                    <div className="col-md-5">
                        <TextField fullWidth placeholder="Nombre del premio" {...register(`awards.${index}.award`)} />
                    </div>
                    <div className="col-md-3">
                        <TextField fullWidth type="date" {...register(`awards.${index}.date`)} InputLabelProps={{ shrink: true }} />
                    </div>
                    <div className="col-md-2">
                        <select className="form-select" {...register(`awards.${index}.type_award`)}>
                            <option value="1">Principal</option>
                            <option value="2">Secundario</option>
                        </select>
                    </div>
                    <div className="col-md-2">
                        {fields.length > 1 && (
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => remove(index)}>
                                Eliminar
                            </button>
                        )}
                    </div>
                </div>
            ))}

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

export default RaffleForm
