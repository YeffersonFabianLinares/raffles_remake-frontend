import api from "../plugin/api";
import type { PromotionSchema } from "../schemas/admin/promotion.schema";

interface PromotionFilters {
    name?: string;
    page?: number;
}

export const datatable = async (data: PromotionFilters) => {
    const response = await api.get('promotions', { params: data });
    return response.data;
};

export const store = async (data: PromotionSchema) => {
    const response = await api.post('promotions/create', data);
    return response.data;
};

export const update = async (data: Partial<PromotionSchema>, id: number) => {
    const response = await api.put(`promotions/update/${id}`, data);
    return response.data;
};

export const show = async (id: number) => {
    const response = await api.get(`promotions/${id}`);
    return response.data;
};

export const changeState = async (id: number, state: number) => {
    const response = await api.put(`promotions/change-state/${id}`, { state });
    return response.data;
};

export const byRaffle = async (raffleId: number) => {
    const response = await api.get(`promotions/by-raffle/${raffleId}`);
    return response.data;
};
