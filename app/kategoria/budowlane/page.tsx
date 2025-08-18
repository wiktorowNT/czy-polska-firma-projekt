import type { Metadata } from "next"
import ScrollToTop from "@/components/scroll-to-top"
import CategoryPageView from "@/components/category-page-view"
import categoriesData from "@/data/categories.json"

export const metadata: Metadata = {
  title: "Budowlane - Czy Polska Firma",
  description:
    "Sprawdź indeks polskości firm budowlanych. Materiały, markety i wyposażenie domu - które firmy są polskie?",
  openGraph: {
    title: "Budowlane - Czy Polska Firma",
    description:
      "Sprawdź indeks polskości firm budowlanych. Materiały, markety i wyposażenie domu - które firmy są polskie?",
  },
}

export default function BudowlanePage() {
  const category = categoriesData["budowlane"]

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
