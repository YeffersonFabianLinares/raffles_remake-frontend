import api from "../plugin/api";
import type { SellerSchema } from "../schemas/admin/seller.schema";

interface SellerFilters {
    name?: string;
    document_number?: string;
    email?: string;
    page?: number;
}

export const datatable = async (data: SellerFilters) => {
    const response = await api.get('sellers', { params: data });
    return response.data;
};

export const store = async (data: SellerSchema) => {
    const response = await api.post('sellers/register', data);
    return response.data;
};

export const update = async (data: Partial<SellerSchema>, id: number) => {
    const response = await api.put(`sellers/update/${id}`, data);
    return response.data;
};

export const show = async (id: number) => {
    const response = await api.get(`sellers/${id}`);
    return response.data;
};

export const destroy = async (id: number) => {
    const response = await api.delete(`sellers/delete/${id}`);
    return response.data;
};

export const updateStatus = async (id: number, state: number) => {
    const response = await api.put(`sellers/update-status/${id}`, { state });
    return response.data;
};

export const office = async () => {
    const response = await api.get('sellers/office');
    return response.data;
};

export const byUserId = async (userId: number) => {
    const response = await api.get(`sellers/by-user/${userId}`);
    return response.data;
};

export const tracking = async (id: number) => {
    const response = await api.get(`sellers/${id}/tracking`);
    return response.data;
};
