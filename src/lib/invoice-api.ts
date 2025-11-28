import api from './api';

export interface Invoice {
  startDate: string;      // "2025-11-24"
  endDate: string;        // "2025-12-24"
  packageName: string;    // "PREMIUM"
  amount: number;         // 199000
}

export interface InvoiceResponse {
  code: number;
  message: string;
  result: Invoice;
}

/**
 * Get user's invoice/transaction history
 * GET /api/candidate-invoice/my-invoice
 */
export const getMyInvoice = async (): Promise<Invoice> => {
  try {
    const response = await api.get<InvoiceResponse>('/api/candidate-invoice/my-invoice');
    
    if (response.data.code === 200) {
      return response.data.result;
    }
    
    throw new Error(response.data.message || 'Failed to fetch invoice');
  } catch (error: any) {
    console.error('❌ Error fetching invoice:', error);
    
    // If 404 or no invoice found, return null or throw
    if (error.response?.status === 404) {
      throw new Error('NO_INVOICE_FOUND');
    }
    
    throw error;
  }
};

/**
 * Format date from YYYY-MM-DD to readable format
 */
export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('vi-VN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date);
};

/**
 * Format price in VND
 */
export const formatInvoicePrice = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(price);
};
