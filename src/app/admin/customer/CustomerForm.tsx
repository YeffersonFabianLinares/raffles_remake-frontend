import { Button, CircularProgress, TextField } from "@mui/material";

import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import type { GenericFormProps } from "../../../interfaces/GenericFormProps";
import { type CustomerSchema, customerSchema } from "../../../schemas/admin/customer.schema";
import { useAsyncFormHandler } from "../../../hooks/useAsyncFormHandler";
import { show, store, update } from "../../../services/customer.service";
import ErrorMessage from "../../../components/ErrorMessage";
import CountrySelect from "../../../components/CountrySelect";
import { Select2 } from "../../../components/Select2";
import type { ISelect2 } from "../../../interfaces/ISelect2";

export const CustomerForm: React.FC<GenericFormProps> = ({ id, onSuccess }) => {

    const {
        register,
        formState: { errors },
        reset,
        handleSubmit,
        control
    } = useForm<CustomerSchema>({
        resolver: zodResolver(customerSchema)
    })

    console.error('errors ==> ', errors);


    /** procesa el envío del formulario y la respuesta, siendo tolerable a errores y regresa estos mensajes. */
    const { execute, isLoading } = useAsyncFormHandler()

    const onSubmit = async (data: CustomerSchema) => {
        const action = () => id ? update(data, id) : store(data)
        const { response, message, alertSeverity } = await execute(
            action,
            'Datos guardados con éxito',
            'Error: datos inválidos.'
        )

        setTimeout(() => {
            onSuccess(message, alertSeverity, response?.status);
        }, 500);
    }

    useEffect(() => {
        const getCustomer = async (id: number | null | undefined) => {
            if (id) {
                const response = await show(id)
                reset(response)
            }
        }

        getCustomer(id)
    }, [])

    return (
        <>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <label className="label" htmlFor="name">Nombre</label>
                        <TextField fullWidth {...register('name')} />
                        <ErrorMessage message={errors.name?.message} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="label" htmlFor="document">Documento</label>
                        <TextField fullWidth {...register('document')} />
                        <ErrorMessage message={errors.document?.message} />
                    </div>
                    <div className="col-md-6 mb-3">
                        <label className="label" htmlFor="document">Teléfono</label>
                        <div className="d-flex">
                            <div className="col-3">
                                <Controller control={control} name="country_code" render={({ field }) => (
                                    <CountrySelect
                                        value={field.value}
                                        onChange={(dial) => {
                                            field.onChange(dial);
                                        }}
                                    />
                                )} />
                            </div>
                            <div className="col-9">
                                <TextField {...register('phone')} fullWidth />
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <Controller
                            name="city_id"
                            control={control}
                            render={({ field }) => (
                                <>
                                    <Select2
                                        {...field}
                                        endPoint="cities/select"
                                        label="Selecciona una ciudad"
                                        onChange={(selected: ISelect2) => {
                                            field.onChange(selected)
                                        }}
                                    />
                                </>
                            )}>
                        </Controller>
                    </div>
                </div>

                <div className="d-flex justify-content-center">
                    <Button
                        disabled={isLoading}
                        startIcon={isLoading ? <CircularProgress size={20} color="inherit" /> : null}
                        type="submit" variant='outlined'>
                        {isLoading ? 'Guardando...' : 'Guardar'}
                    </Button>
                </div>
            </form>
        </>
    )
}

export default CustomerForm