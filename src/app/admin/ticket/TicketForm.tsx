import { useEffect, useState } from "react"
import { Button, CircularProgress, TextField } from "@mui/material"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { type TicketSchema, ticketSchema } from "../../../schemas/admin/ticket.schema"
import { useAsyncFormHandler } from "../../../hooks/useAsyncFormHandler"
import ErrorMessage from "../../../components/ErrorMessage"
import type { AlertSeverity } from "../../../types/AlertSeverity"

interface TicketFormProps {
    id: number
    onSuccess: (message: string, alertSeverity: AlertSeverity, status: number | undefined) => void
    raffles: { id: number; name: string }[]
    sellers: { id: number; name: string }[]
    generateRef: () => Promise<{ code: string }>
    storeTicket: (data: TicketSchema) => Promise<unknown>
}

const PAYMENT_METHODS = ['Efectivo', 'Transferencia', 'Nequi', 'Daviplata', 'Wompi']

export const TicketForm: React.FC<TicketFormProps> = ({ id, onSuccess, raffles, sellers, generateRef, storeTicket }) => {
    const {
        register,
        formState: { errors },
        handleSubmit,
        control,
        setValue,
        watch,
    } = useForm<TicketSchema>({
        resolver: zodResolver(ticketSchema),
        defaultValues: {
            number: [''],
            payments: [{ payment_method: 'Efectivo', reference: '', amount: '', expiration_date: '' }]
        }
    })

    const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
        control, name: 'payments'
    })

    const { execute, isLoading } = useAsyncFormHandler()
    const [generatingRef, setGeneratingRef] = useState(false)
    const numbers = watch('number')

    const handleGenerateRef = async () => {
        setGeneratingRef(true)
        try {
            const { code } = await generateRef()
            if (paymentFields.length > 0) {
                setValue(`payments.0.reference`, code)
            }
        } catch (e) {
            console.error(e)
        } finally {
            setGeneratingRef(false)
        }
    }

    const onSubmit = async (data: TicketSchema) => {
        const { response, message, alertSeverity } = await execute(
            () => storeTicket(data),
            'Boleta creada con éxito',
            'Error al crear la boleta'
        )
        setTimeout(() => {
            onSuccess(message, alertSeverity, (response as any)?.status ?? 201)
        }, 500)
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div className="row">
                <div className="col-md-4 mb-3">
                    <label className="label">Número(s) de Boleta</label>
                    <TextField
                        fullWidth
                        placeholder="0001, 0002, 0003"
                        onChange={e => {
                            const val = e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                            setValue('number', val.length > 0 ? val : [''])
                        }}
                        defaultValue={numbers?.join(', ')}
                    />
                    <ErrorMessage message={errors.number?.message} />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="label">Rifa</label>
                    <select className="form-select" {...register('raffle')}>
                        <option value="">Selecciona una rifa</option>
                        {raffles.map(r => <option key={r.id} value={r.id}>{r.name}</option>)}
                    </select>
                    <ErrorMessage message={errors.raffle?.message?.toString()} />
                </div>
                <div className="col-md-4 mb-3">
                    <label className="label">Vendedor</label>
                    <select className="form-select" {...register('seller')}>
                        <option value="">Oficina</option>
                        {sellers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                    </select>
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Documento Cliente</label>
                    <TextField fullWidth placeholder="Cédula" {...register('customer')} />
                    <ErrorMessage message={errors.customer?.message?.toString()} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Valor</label>
                    <TextField fullWidth type="number" {...register('value')} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Por Pagar</label>
                    <TextField fullWidth type="number" {...register('value_to_pay')} />
                </div>
                <div className="col-md-3 mb-3">
                    <label className="label">Promoción ID</label>
                    <TextField fullWidth type="number" {...register('promotion_id')} />
                </div>
            </div>

            <hr />
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h6>Pagos</h6>
                <button
                    type="button"
                    className="btn btn-general btn-sm"
                    onClick={() => appendPayment({ payment_method: 'Efectivo', reference: '', amount: '', expiration_date: '' })}
                >
                    + Pago
                </button>
            </div>
            {paymentFields.map((field, index) => (
                <div className="row align-items-center mb-2" key={field.id}>
                    <div className="col-md-3">
                        <select className="form-select" {...register(`payments.${index}.payment_method`)}>
                            {PAYMENT_METHODS.map(m => <option key={m} value={m}>{m}</option>)}
                        </select>
                    </div>
                    <div className="col-md-3">
                        <div className="d-flex gap-1">
                            <TextField fullWidth placeholder="Referencia" {...register(`payments.${index}.reference`)} size="small" />
                            <button
                                type="button"
                                className="btn btn-outline-secondary btn-sm"
                                onClick={handleGenerateRef}
                                disabled={generatingRef}
                                title="Generar referencia"
                            >
                                {generatingRef ? '...' : 'Gen'}
                            </button>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <TextField fullWidth type="number" placeholder="Monto" {...register(`payments.${index}.amount`)} size="small" />
                    </div>
                    <div className="col-md-3">
                        <TextField fullWidth type="date" {...register(`payments.${index}.expiration_date`)} size="small" InputLabelProps={{ shrink: true }} />
                    </div>
                    <div className="col-md-1">
                        {paymentFields.length > 1 && (
                            <button type="button" className="btn btn-danger btn-sm" onClick={() => removePayment(index)}>X</button>
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

export default TicketForm
