import { Badge } from "@/components/ui/badge"

export function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-200 uppercase font-bold text-[10px]",
    CONFIRMED: "bg-blue-50 text-blue-700 border-blue-200 uppercase font-bold text-[10px]",
    CANCELLED: "bg-red-50 text-red-700 border-red-200 uppercase font-bold text-[10px]",
    COMPLETED: "bg-emerald-50 text-emerald-700 border-emerald-200 uppercase font-bold text-[10px]",
  }

  return (
    <Badge variant="outline" className={styles[status] || styles.PENDING}>
      {status}
    </Badge>
  )
}
