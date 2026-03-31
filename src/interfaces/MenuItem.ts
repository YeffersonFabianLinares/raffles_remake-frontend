import type { ReactNode } from "react"

export interface MenuItem {
    text: string
    icon: ReactNode
    path?: string
    statusFilter?: string
    children?: MenuItem[]
}