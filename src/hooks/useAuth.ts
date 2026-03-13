/**
 * @module Contexts/AuthContext
 * Gestión del estado global de autenticación y sesión de usuario.
 */

import { createContext, useContext } from "react"
import type { User } from "../schemas/user.schema"

/**
 * Define el contrato del contexto de autenticación.
 * 
 * @category Interfaces
 */

export interface AuthContextType {
    /** 
 * Objeto con los datos del usuario autenticado. 
 * Es `undefined` si no hay una sesión activa o mientras se valida con API.
 */
    user: User | undefined,
    /** 
 * Indica si el proceso de verificación de sesión (`getUser`) está en curso.
 * Útil para mostrar componentes como {@link SpinnerLoad}.
 */
    loading: boolean,
    /** 
 * Función para actualizar globalmente los datos del usuario.
 * @param u - Nuevo objeto de usuario o undefined para cerrar sesión.
 */
    setUser: (u: User | undefined) => void
}

/**
 * Contexto de React para la autenticación.
 * 
 * **Nota:** No consumir este contexto directamente. Utilizar el hook {@link useAuth}.
 * @internal
 */
export const AuthContext = createContext<AuthContextType | undefined>(undefined)

/**
 * Hook personalizado para acceder a la sesión del usuario.
 * 
 * Este hook es el punto de entrada para obtener los datos del usuario
 * logueado y el estado de carga de la sesión.
 * 
 * @example
 * ```tsx
 * const { user, loading } = useAuth();
 * 
 * if (loading) return <SpinnerLoad />;
 * if (!user) return <Redirect to="/login" />;
 * ```
 * 
 * @returns {AuthContextType} El estado y las funciones de autenticación.
 * @throws {Error} Si el hook se utiliza fuera de un componente envuelto por `AuthProvider`.
 * @category Hooks
 */
export const useAuth = () => {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error("useAuth debe usarse dentro de AuthProvider")
    return ctx
}