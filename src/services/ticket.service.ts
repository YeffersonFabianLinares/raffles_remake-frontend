import api from "../plugin/api";
import type { TicketSchema } from "../schemas/admin/ticket.schema";

interface TicketFilters {
    name?: string;
    document?: string;
    number?: string;
    status?: string;
    seller_id?: string | number;
    raffle_id?: string | number;
    initial_date?: string;
    final_date?: string;
    page?: number;
}

export const datatable = async (data: TicketFilters) => {
    const response = await api.get('tickets', { params: data });
    return response.data;
};

export const store = async (data: TicketSchema) => {
    const response = await api.post('tickets/create', data);
    return response.data;
};

export const storeClient = async (data: TicketSchema) => {
    const response = await api.post('tickets/create/client', data);
    return response.data;
};

export const show = async (id: number) => {
    const response = await api.get(`tickets/${id}`);
    return response.data;
};

export const update = async (data: Partial<TicketSchema>, id: number) => {
    const response = await api.put(`tickets/update/${id}`, data);
    return response.data;
};

export const changeState = async (id: number, status: string) => {
    const response = await api.put(`tickets/change-state/${id}`, { status });
    return response.data;
};

export const destroy = async (id: number) => {
    const response = await api.delete(`tickets/delete/${id}`);
    return response.data;
};

export const dependencies = async () => {
    const response = await api.get('tickets/dependencies');
    return response.data;
};

export const byRaffle = async (raffleId: number) => {
    const response = await api.get(`tickets/by-raffle/${raffleId}`);
    return response.data;
};

export const generateReference = async () => {
    const response = await api.get('tickets/reference');
    return response.data;
};

export const statsForRaffle = async (raffleId: number) => {
    const response = await api.get(`tickets/${raffleId}/stats`);
    return response.data;
};

export const statsBySeller = async (params: object) => {
    const response = await api.get('tickets/by-seller', { params });
    return response.data;
};

export const getByNumber = async (data: object) => {
    const response = await api.post('tickets/by-number', data);
    return response.data;
};

export const totalValue = async (params: object) => {
    const response = await api.get('tickets/total-value', { params });
    return response.data;
};

export const verifyWompi = async () => {
    const response = await api.post('tickets/verify-wompi');
    return response.data;
};
