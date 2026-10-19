type StatusBadgeProps = { stock: number; minimumStock: number };

export default function StatusBadge({ stock, minimumStock }: StatusBadgeProps) {
  const isLowStock = stock <= minimumStock;
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${isLowStock ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"}`}>
      {isLowStock ? "Stok Menipis" : "Stok Aman"}
    </span>
  );
}
