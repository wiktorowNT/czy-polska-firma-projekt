import type { Metadata } from "next"
import ScrollToTop from "@/components/scroll-to-top"
import CategoryPageView from "@/components/category-page-view"
import categoriesData from "@/data/categories.json"

export const metadata: Metadata = {
  title: "Moda - Czy Polska Firma",
  description: "Sprawdź indeks polskości marek modowych. Odzież i akcesoria - które firmy są polskie?",
  openGraph: {
    title: "Moda - Czy Polska Firma",
    description: "Sprawdź indeks polskości marek modowych. Odzież i akcesoria - które firmy są polskie?",
  },
}

export default function ModaPage() {
  const category = categoriesData["moda"]

  if (!category) {
    return <div>Kategoria nie została znaleziona</div>
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop />
      <CategoryPageView category={category} />
    </div>
  )
}
