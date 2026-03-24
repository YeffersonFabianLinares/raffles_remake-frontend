import { Button, CircularProgress, TextField, FormControlLabel, Checkbox } from "@mui/material";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { GenericFormProps } from "../../../interfaces/GenericFormProps";
import { type SellerSchema, sellerSchema } from "../../../schemas/admin/seller.schema";
import { useAsyncFormHandler } from "../../../hooks/useAsyncFormHandler";
import { show, store, update } from "../../../services/seller.service";
import ErrorMessage from "../../../components/ErrorMessage";
import CountrySelect from "../../../components/CountrySelect";

export const SellerForm: React.FC<GenericFormProps> = ({ id, onSuccess }) => {
    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        control
    } = useForm<SellerSchema>({
        resolver: zodResolver(sellerSchema)
    })

    const { execute, isLoading } = useAsyncFormHandler()

    const onSubmit = async (data: SellerSchema) => {
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
        const getSeller = async (sellerId: number | null | undefined) => {
            if (sellerId) {
                const response = await show(sellerId)
                reset({
                    name: response.name,
                    document_number: response.document_number,
                    country_code: response.country_code,
                    phone: response.phone,
                    email: response.user?.email ?? '',
                    is_superuser: response.user?.is_superuser ?? false,
                })
            }
        }
        getSeller(id)
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="label">Nombre</label>
                        <TextField fullWidth {...register('name')} />
                        <ErrorMessage message={errors.name?.message} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="label">Documento</label>
                        <TextField fullWidth {...register('document_number')} />
                        <ErrorMessage message={errors.document_number?.message} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="label">Teléfono</label>
                        <div className="d-flex">
                            <div className="col-3">
                                <Controller control={control} name="country_code" render={({ field }) => (
                                    <CountrySelect value={field.value} onChange={field.onChange} />
                                )} />
                            </div>
                            <div className="col-9">
                                <TextField {...register('phone')} fullWidth />
                            </div>
                        </div>
                        <ErrorMessage message={errors.phone?.message} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="label">Correo</label>
                        <TextField fullWidth type="email" {...register('email')} />
                        <ErrorMessage message={errors.email?.message} />
                    </div>
                    {!id && (
                        <div className="col-md-6 mb-3">
                            <label className="label">Contraseña</label>
                            <TextField fullWidth type="password" {...register('password')} />
                            <ErrorMessage message={errors.password?.message} />
                        </div>
                    )}
                    <div className="col-md-6 mb-3 d-flex align-items-center">
                        <Controller control={control} name="is_superuser" render={({ field }) => (
                            <FormControlLabel
                                control={<Checkbox checked={!!field.value} onChange={field.onChange} />}
                                label="Administrador"
                            />
                        )} />
                    </div>
                </div>
                <div className="d-flex justify-content-center">
                    <Button
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        type="submit"
                        variant="outlined">
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default SellerForm
