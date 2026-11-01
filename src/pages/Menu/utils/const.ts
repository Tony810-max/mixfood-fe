import { formatVND } from '@/utils/formatters';
/**
 * Menu utility functions
 *
 * This file contains utility functions for menu-related operations.
 * Static menu data has been removed in favor of API-based data fetching.
 */

export const formatPrice = (price: number): string => formatVND(price);
