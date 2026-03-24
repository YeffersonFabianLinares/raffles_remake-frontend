import api from "../plugin/api";

export const dependencies = async () => {
    const response = await api.get('sellers-tickets/dependencies');
    return response.data;
};

export const storeRange = async (sellerId: number, data: { raffle_id: number; numbers: string[] }) => {
    const response = await api.post(`sellers-tickets/store/${sellerId}`, data);
    return response.data;
};

export const showRange = async (sellerId: number) => {
    const response = await api.get(`sellers-tickets/show/${sellerId}`);
    return response.data;
};

export const freeTickets = async () => {
    const response = await api.get('sellers-tickets/free');
    return response.data;
};
