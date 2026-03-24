import api from "../plugin/api";
import type { CustomerSchema } from "../schemas/admin/customer.schema";
import { extractValue } from "../utils/helpers";

interface CustomerFilters {
    name: string
}

export const datatable = async (data: CustomerFilters) => {
    try {
        const response = await api.get('customers', { params: data });
        return response.data;
    }
    catch (error) {
        console.error('Error fetching customers:', error);
        throw error;
    }
}

export const store = async (data: CustomerSchema) => {
    const form = {
        ...data,
        city_id: extractValue(data.city_id)
    }
    try {
        const response = await api.post('customers/create', form);
        return response.data;
    }
    catch (error) {
        console.error('Error creating customer:', error);
        throw error;
    }
}

export const update = async (data: CustomerSchema, id: number) => {
    const form = {
        ...data,
        city_id: extractValue(data.city_id)
    }
    try {
        const response = await api.put(`customers/update/${id}`, form);
        return response.data;
    }
    catch (error) {
        console.error(`Error updating customer with ID ${id}:`, error);
        throw error;
    }
}

export const show = async (id: number) => {
    try {
        const response = await api.get(`customers/${id}`);
        return response.data;
    }
    catch (error) {
        console.error(`Error fetching customer with ID ${id}:`, error);
        throw error;
    }
}