import { useState, useCallback } from 'react';

/**
 * @module Hooks/useDialogHandler
 * Manejo centralizado de estados para diálogos modales (Creación/Edición).
 */

/**
 * Interfaz para los títulos configurables del Dialog.
 * @category Interfaces
 */
export interface DialogNames {
    /** Título que se mostrará cuando el ID sea 0 (Modo Creación) */
    create: string;
    /** Título que se mostrará cuando exista un ID (Modo Edición) */
    edit: string;
}

/**
 * Hook para gestionar la apertura, cierre y títulos dinámicos de un Dialog.
 * 
 * Este hook centraliza la lógica de "Modo Creación" vs "Modo Edición" basándose
 * en la presencia de un ID, facilitando la reutilización de formularios.
 * 
 * @example
 * ```tsx
 * const { open, title, id, handleOpen, handleClose } = useDialogHandler({
 *   create: "Nuevo Especialista",
 *   edit: "Editar Especialista"
 * });
 * ```
 * 
 * @param names - Objeto de configuración con los títulos para los estados.
 * @param names.create - Título mostrado al llamar a `handleOpen()` sin parámetros.
 * @param names.edit - Título mostrado al llamar a `handleOpen(id)`.
 * 
 * @returns {Object} logic - Objeto con estados y controladores.
 * @returns {boolean} .open - Estado de visibilidad del Dialog.
 * @returns {string} .title - Título dinámico actual (create o edit).
 * @returns {number} .id - ID del registro seleccionado (0 para nuevos).
 * @returns {Function} .handleOpen - Función para abrir el Dialog. Acepta un `editId` opcional.
 * @returns {Function} .handleClose - Función para cerrar el Dialog y resetear el ID.
 * 
 * @category Hooks
 */
export const useDialogHandler = (names: DialogNames) => {
    /** Estado de visibilidad del modal */
    const [open, setOpen] = useState(false);
    /** Título dinámico según el modo */
    const [title, setTitle] = useState("");
    /** ID del elemento a editar o 0 para creación */
    const [id, setId] = useState<number>(0);

    /**
 * Abre el diálogo y establece el modo de trabajo.
 * @param editId - Si se proporciona, el hook entra en modo "Edición".
 */
    const handleOpen = useCallback((editId?: number) => {
        if (editId) {
            setId(editId);
            setTitle(names.edit);
        } else {
            setId(0);
            setTitle(names.create);
        }
        setOpen(true);
    }, [names]);

    /**
   * Cierra el diálogo y limpia el ID con un retraso para evitar saltos visuales 
   * durante la animación de salida de MUI.
   */
    const handleClose = useCallback(() => {
        setOpen(false);
        setTimeout(() => setId(0), 300);
    }, []);

    return { open, title, id, handleOpen, handleClose };
};

export default useDialogHandler