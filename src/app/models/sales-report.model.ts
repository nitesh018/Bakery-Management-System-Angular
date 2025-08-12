export interface SalesReportEntry {
  order_id?: number;
  item_name?: string;
  quantity?: number;
  total_price?: number;
  created_at?: string;
  user_email?: string; // added
  status?: string;     // added
}

export interface SalesReportSummary {
  sales: SalesReportEntry[];
  totalSales: number;
  totalOrders: number;
  totalProducts: number;
}
