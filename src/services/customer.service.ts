import api from "../plugin/api";

export const getCustomers = async () => {
    try {
        const response = await api.get('customers-list');
        return response.data;
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
}