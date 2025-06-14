export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  } catch (error) {
    console.error("Error formatting date:", error)
    return dateString
  }
}

export function formatCurrency(amount: number): string {
  try {
    return new Intl.NumberFormat("en-NP", {
      style: "currency",
      currency: "NPR",
      maximumFractionDigits: 0,
    }).format(amount)
  } catch (error) {
    console.error("Error formatting currency:", error)
    return amount.toString()
  }
}

// Utility function to conditionally join class names
export function cn(...classes: (string | undefined | false | null)[]): string {
  return classes.filter(Boolean).join(" ")
}

export function calculateTotalDays(startDate: string, endDate: string): number {
  try {
    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  } catch (error) {
    console.error("Error calculating total days:", error)
    return 0
  }
}

export function calculateTotalCost(totalDays: number, pricePerDay: number): number {
  return totalDays * pricePerDay
}
