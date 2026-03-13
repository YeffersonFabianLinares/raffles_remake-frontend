import React from 'react'

/**
 * Mensaje tipo string recibido
 * 
 * @category Interfaces
 */
export interface ErrorMessageProps {
    /** Mensaje de error de tipo string o undefined */
    message?: string
}

/**
 * @module Hooks/components
 */

/**
 * Componente para gestionar mensajes de error de los schema zod
 * 
 * @param message - mensaje de error de los schema zod
 * 
 * @returns Un componente span de color rojo con el mensaje de error
 * @category Components
 */
export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
    if (!message) {
        return null
    }
    return (
        <>
            <span style={{ color: 'red', marginTop: '4px', display: 'block', fontSize: '.8em' }}>
                {message}
            </span>
        </>
    );
}

export default ErrorMessage