import api from "../plugin/api";
import type { RaffleSchema } from "../schemas/admin/raffle.schema";

export const datatable = async () => {
    const response = await api.get('raffles');
    return response.data;
};

export const store = async (data: RaffleSchema) => {
    const response = await api.post('raffles/create', data);
    return response.data;
};

export const update = async (data: Partial<RaffleSchema>, id: number) => {
    const response = await api.put(`raffles/update/${id}`, data);
    return response.data;
};

export const show = async (id: number) => {
    const response = await api.get(`raffles/${id}`);
    return response.data;
};

export const last = async () => {
    const response = await api.get('raffles/last');
    return response.data;
};

export const ticketCount = async (id: number) => {
    const response = await api.get(`raffles/${id}/ticket-count`);
    return response.data;
};

export const updateAwardImage = async (awardId: number, formData: FormData) => {
    const response = await api.put(`awards/${awardId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
    });
    return response.data;
};
