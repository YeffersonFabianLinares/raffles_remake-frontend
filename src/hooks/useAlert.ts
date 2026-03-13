import { useState } from "react"
import type { AlertSeverity } from "../types/AlertSeverity"

/**
 * Estructura de parámetros necesarios para el lanzamiento de la alerta
 * y el tipo de alerta con el mensaje
 * 
 * @category Interfaces
 */

export interface IAlert {
    /** Mensaje a mostrar */
    message: string
    /** 
     * Tipo de alerta, puede ser info, warning, error, success 
     * @see {@link AlertSeverity} 
     */
    severity: AlertSeverity,
    /** para que dice si abre o no la alerta */
    open: boolean
}

/**
 * @module Hooks/useAlert
 */

/**
 * Hook para gestionar el ciclo de vida y visibilidad de alertas.
 * 
 * Provee un estado reactivo y funciones para disparar o cerrar notificaciones
 * de forma sencilla en cualquier componente de la administración.
 * 
 * @example
 * ```tsx
 * const { alert, showAlert, hideAlert } = useAlert();
 * 
 * // Para disparar la alerta:
 * showAlert("Datos guardados con éxito", "success");
 * ```
 * 
 * @returns {Object} { alert, showAlert, hideAlert }
 * @returns {IAlert} .alert - Estado actual de la alerta.
 * @returns {Function} .showAlert - Función para activar la alerta. Recibe (message: string, severity?: AlertSeverity).
 * @returns {Function} .hideAlert - Función para cerrar la alerta manualmente.
 * 
 * @category Hooks
 */

export const useAlert = () => {
    const [alert, setAlert] = useState<IAlert>({ open: false, message: '', severity: 'info' })

    /**
     * 
     * 
     * @param message - Mensaje a mostrar
     * @param severity - Tipo de alerta, puede ser info, warning, error, success
     * @param open - para que dice si abre o no la alerta
     */
    const showAlert = (message: string, severity: AlertSeverity = 'info') => {
        setAlert({ open: true, message: message, severity: severity })
    }

    const hideAlert = () => {
        setAlert(prev => ({ ...prev, open: false }))
    }

    return {
        alert,
        showAlert,
        hideAlert
    }
}

export default useAlert