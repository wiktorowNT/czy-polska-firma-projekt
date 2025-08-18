import type { Metadata } from "next"
import ScrollToTop from "@/components/scroll-to-top"
import CategoryPageView from "@/components/category-page-view"
import categoriesData from "@/data/categories.json"

export const metadata: Metadata = {
  title: "Chemia i kosmetyki - Czy Polska Firma",
  description: "Sprawdź indeks polskości marek kosmetycznych i chemii gospodarczej. Które firmy są polskie?",
  openGraph: {
    title: "Chemia i kosmetyki - Czy Polska Firma",
    description: "Sprawdź indeks polskości marek kosmetycznych i chemii gospodarczej. Które firmy są polskie?",
  },
}

export default function ChemiaKosmetykiPage() {
  const category = categoriesData["chemia-i-kosmetyki"]

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
