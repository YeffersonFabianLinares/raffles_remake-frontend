import type { AxiosResponse } from "axios";
import { type ChangeEvent } from "react";

/**
 * Configuración necesaria para inicializar el comportamiento del toggle.
 * 
 * @template T - Tipo de la entidad que debe extender de {@link Identifiable}.
 * @category Interfaces
 */

export interface ToggleOptions<T> {
  /** 
 * Función despachadora del estado para actualizar la lista local.
 * Generalmente proviene del hook {@link usePaginator}.
 */
  setItems: React.Dispatch<React.SetStateAction<T[]>>;
  /** 
 * Función del servicio que ejecuta la persistencia en el backend.
 * @param newValue - El nuevo estado booleano.
 * @param id - Identificador único del registro.
 */
  apiCall: (newValue: boolean, id: number) => Promise<AxiosResponse<T>>
  refresh : () => void
  /** 
 * Nombre de la propiedad que representa el estado en el objeto T.
 * @default "is_active"
 */
  fieldName?: keyof T;
}

/**
 * Restricción de tipo para asegurar que la entidad posea un identificador numérico.
 * 
 * @category Interfaces
 */
export interface Identifiable {
  /** Identificador único proveniente de la base de datos Oracle. */
  id: number
}

/**
 * @module Hooks/useStatusToggle
 * Utilidad para la gestión de cambios de estado binarios (Switch/Checkbox) con persistencia.
 */

/**
 * Hook para gestionar el cambio de estado (toggle) de elementos en una lista.
 * 
 * Implementa una **actualización optimista**: cambia el valor en la interfaz 
 * inmediatamente y, en caso de error en la petición HTTP, revierte el cambio 
 * automáticamente al valor original.
 * 
 * @example
 * ```tsx
 * const { handleChangeActive } = useStatusToggle<Specialist>({ 
 *   setItems, 
 *   apiCall: ChangeState 
 * });
 * ```
 * 
 * @template T - Tipo de dato de la entidad (debe tener una propiedad `id`).
 * @param options - Objeto de configuración {@link ToggleOptions}.
 * 
 * @returns {Object} functions - Funciones de control de estado.
 * @returns {Function} .handleChangeActive - Manejador para el evento `onChange` de componentes Switch/Input.
 * 
 * @category Hooks
 */
export function useStatusToggle<T extends Identifiable>(options: ToggleOptions<T>) {
  const { setItems, apiCall, fieldName = "is_active" as keyof T, refresh } = options;

  /**
 * Maneja el cambio de estado disparado por un componente de UI.
 * 
 * Incluye lógica de validación de límites (ej: máximo de elementos activos permitidos).
 * 
 * @async
 * @param event - Evento de cambio del input.
 * @param item - Objeto completo de la entidad a modificar.
 * @param limit - (Opcional) Cantidad máxima de elementos que pueden estar activos.
 * @param length - (Opcional) Cantidad actual de elementos activos en el sistema.
 */
  const handleChangeActive = async (
    event: ChangeEvent<HTMLInputElement>,
    item: T,
    limit: number | null = null,
    length: number | null = null,
  ) => {
    const originalValue = !!item[fieldName];
    const newValue = event.target.checked;
    const id = item.id;
    if (limit && length) {
      if (length >= limit && event.target.checked == true) {
        setStatus(id, fieldName, originalValue);
        alert(`Solamente pueden estar ${limit} item(s) activo(s) a la vez`);
        return;
      }
    }
    setStatus(id, fieldName, newValue);

    try {
      // 2. Llamada a la API dinámica
      await apiCall(newValue, id);
      refresh();
    } catch (error) {
      // 3. Reversión automática si falla
      setStatus(id, fieldName, originalValue);
      console.error("Error al actualizar estado:", error);
    }
  };

  /**
   * Actualiza el estado local de la lista de items.
   * 
   * @internal
   * @param id - ID del dato a editar.
   * @param fieldName - Nombre de la columna (key) a editar.
   * @param value - Nuevo valor booleano.
   */
  const setStatus = (id: number, fieldName: keyof T, value: boolean) => {
    setItems((prev) =>
      prev.map((i: T) => (i.id === id ? { ...i, [fieldName]: value } : i)),
    );
  };

  return { handleChangeActive };
}
