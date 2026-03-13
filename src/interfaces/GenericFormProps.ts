/** 
 * @module Interfaces/GenericForm
 */

import type { AlertSeverity } from "../types/AlertSeverity";

/**
 * Propiedades estándar para los componentes de formulario del sistema.
 * 
 * Esta interfaz asegura que todos los formularios (Creación/Edición) 
 * manejen de forma consistente el identificador del registro y la 
 * notificación de éxito hacia el componente padre.
 * 
 * @category Interfaces
 */
export interface GenericFormProps {
    /** 
 * Identificador del registro para el modo edición.
 * Si es `0` o `undefined`, el formulario operará en modo **Creación**.
 * 
 * @default undefined
 * @example 16
 */
    id: number
    /** 
   * Callback ejecutado tras una respuesta exitosa del servidor.
   * 
   * Permite que el formulario notifique al componente contenedor (generalmente un Dialog)
   * para que este pueda cerrar el modal, refrescar la tabla y mostrar una alerta.
   * 
   * @param alertMessage - Mensaje descriptivo retornado por Laravel o definido localmente.
   * @param alertSeverity - Nivel de severidad de la alerta. {@link AlertSeverity}
   * @param status - Código de estado HTTP de la respuesta (ej: 200, 201).
   * 
   * @returns void
   */
    onSuccess: (alertMessage: string, alertSeverity: AlertSeverity, status: number | undefined) => void
}