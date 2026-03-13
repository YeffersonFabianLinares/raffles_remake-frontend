import { Pagination, Stack } from "@mui/material"
import type { JSX } from "react"
import type { PaginatedResponse } from "../interfaces/PaginatedResponse"

export interface PaginatorProps<T> {
    paginator: PaginatedResponse<T> | null
    page: number
    setPage: (value: number) => void,
}

export const Paginator = <T,>({ paginator, page, setPage }: PaginatorProps<T>): JSX.Element => {
    return (
        <Stack spacing={2} sx={{ mt: 4, alignItems: 'center' }}>
            <Pagination
                count={paginator?.last_page || 1}
                page={page}
                onChange={(_, value) => setPage(value)}
                variant="outlined"
                color="primary"
                shape="rounded"
            />
        </Stack>
    )
}