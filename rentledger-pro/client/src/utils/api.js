import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

export const createProperty = (data) => api.post('/properties', data);
export const getLandlordProperties = (wallet) => api.get(`/properties/landlord/${wallet}`);
export const getPropertyByLink = (link) => api.get(`/properties/link/${link}`);
export const getPropertyById = (id) => api.get(`/properties/${id}`);

export const recordPayment = (data) => api.post('/payments/record', data);
export const getTenantPayments = (wallet) => api.get(`/payments/tenant/${wallet}`);
export const getLandlordPayments = (wallet) => api.get(`/payments/landlord/${wallet}`);

export const getReceipt = (txHash) => api.get(`/receipts/${txHash}`);
export const getPropertyReceipts = (propertyId) => api.get(`/receipts/property/${propertyId}`);
