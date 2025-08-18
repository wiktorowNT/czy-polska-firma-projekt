import type { Metadata } from "next"
import ScrollToTop from "@/components/scroll-to-top"
import CategoryPageView from "@/components/category-page-view"
import categoriesData from "@/data/categories.json"

export const metadata: Metadata = {
  title: "RTV/AGD - Czy Polska Firma",
  description: "Sprawdź indeks polskości marek RTV/AGD. Elektronika i sprzęt AGD - które firmy są polskie?",
  openGraph: {
    title: "RTV/AGD - Czy Polska Firma",
    description: "Sprawdź indeks polskości marek RTV/AGD. Elektronika i sprzęt AGD - które firmy są polskie?",
  },
}

export default function RTVAGDPage() {
  const category = categoriesData["rtv-agd"]

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
