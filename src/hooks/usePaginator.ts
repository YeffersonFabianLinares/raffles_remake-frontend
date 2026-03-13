import { useState, useEffect, useCallback } from 'react';
import type { PaginatedResponse } from '../interfaces/PaginatedResponse';

/**
 * @module Hooks/usePaginator
 * Motor de paginación y filtrado dinámico para Datatables.
 */

/**
 * Hook universal para gestionar la paginación y el filtrado de datos desde una API.
 * 
 * Este hook encapsula la lógica de:
 * - Sincronización de la URL de la página con la petición HTTP.
 * - Gestión de estados de carga (loading).
 * - Actualización local de elementos sin re-consultar la base de datos.
 * - Manejo de formularios de filtrado.
 * 
 * @template T - Tipo de dato de los elementos de la lista.
 * @template F - Tipo de dato del objeto de filtros.
 * 
 * @param apiCall - Función del servicio que realiza la petición Axios. Debe aceptar filtros y número de página.
 * @param initialFilters - Estado inicial de los campos de búsqueda.
 * 
 * @example
 * ```tsx
 *   const {
 *      items,
 *      setItems,
 *      paginator,
 *      filters,
 *      page,
 *      setPage,
 *      loading,
 *      handleChange,
 *      handleFilter,
 *      refresh
 *   } = usePaginator<User, UsersFilters>(datatable, { name: '', email: '', type_user: '' })
 * ```
 * 
 * @returns {Object} result
 * @returns {T[]} .items - Lista actual de registros.
 * @returns {PaginatedResponse<T>|null} .paginator - Metadatos de la paginación (links, total, etc).
 * @returns {F} .filters - Estado actual de los campos de búsqueda.
 * @returns {boolean} .loading - Estado de la petición de red.
 * @returns {Function} .refresh - Función para forzar una recarga de la página actual.
 * @returns {Function} .handleFilter - Dispara la búsqueda desde la página 1.
 * @returns {Function} .updateLocalItem - Actualiza un registro en el estado local (útil para cambios de switch/toggle).
 * 
 * @category Hooks
 */

export function usePaginator<T, F>(
    apiCall: (params: F & { page: number }) => Promise<PaginatedResponse<T>>,
    initialFilters: F
) {
    /** Listado de items renderizables */
    const [items, setItems] = useState<T[]>([]);
    /** Objeto completo de respuesta de API */
    const [paginator, setPaginator] = useState<PaginatedResponse<T> | null>(null);
    /** Estado de los inputs de búsqueda */
    const [filters, setFilters] = useState<F>(initialFilters);
    /** Página actual del paginador */
    const [page, setPage] = useState(1);
    /** Control de spinner de carga */
    const [loading, setLoading] = useState(false);

    /**
 * Realiza la petición asíncrona al servicio.
 * @internal
 */
    const fetchData = useCallback(async (currentFilters: F, pageNum: number) => {
        setLoading(true);
        try {
            const response = await apiCall({ ...currentFilters, page: pageNum });
            setItems(response.data);
            setPaginator(response);
        } catch (error) {
            console.error("Error en paginación:", error);
        } finally {
            setLoading(false);
        }
    }, [apiCall]);

    // Disparar carga cuando cambia la página
    useEffect(() => {
        fetchData(filters, page);
    }, [page, fetchData]);

    /**
 * Maneja el evento onChange de inputs, selectores y textareas.
 * Actualiza el estado de filtros pero no dispara la búsqueda.
 */
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    /**
 * Procesa el evento de envío del formulario de filtros.
 * Reinicia la paginación a la página 1.
 */
    const handleFilter = (e?: React.FormEvent) => {
        e?.preventDefault();
        setPage(1);
        fetchData(filters, 1);
    };

    /** Recarga los datos manteniendo la posición y filtros actuales. */
    const refresh = () => {
        fetchData(filters, page); // Recarga con los filtros y página actuales
    };

        /**
     * Actualiza un único campo de un item en el estado local sin necesidad de refrescar la API.
     * Ideal para acciones rápidas como activar/desactivar un usuario.
     * 
     * @param id - Valor del identificador.
     * @param updatedFields - Objeto con las propiedades a actualizar.
     * @param key - Nombre de la propiedad llave (por defecto 'id').
     */
    const updateLocalItem = useCallback((id: number | string, updatedFields: Partial<T>, key: keyof T = 'id' as keyof T) => {
        setItems((prevItems) =>
            prevItems.map((item) =>
                item[key] === id ? { ...item, ...updatedFields } : item
            )
        );
    }, []);

    return {
        items,
        setItems,
        paginator,
        filters,
        setFilters,
        page,
        setPage,
        loading,
        refresh,
        handleChange,
        handleFilter,
        updateLocalItem
    };
}
