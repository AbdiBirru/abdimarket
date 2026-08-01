export const LOW_STOCK_THRESHOLD = 5;

export function getStockStatus(stock: number): "out" | "low" | "ok" {
  if (stock <= 0) return "out";
  if (stock <= LOW_STOCK_THRESHOLD) return "low";
  return "ok";
}
