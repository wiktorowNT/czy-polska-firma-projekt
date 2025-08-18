import type { Metadata } from "next"
import ScrollToTop from "@/components/scroll-to-top"
import CategoryPageView from "@/components/category-page-view"
import categoriesData from "@/data/categories.json"

export const metadata: Metadata = {
  title: "Sklepy spożywcze - CzyPolskaFirma",
  description: "Sprawdź indeks polskości sklepów spożywczych i sieci handlowych w Polsce",
}

export default function SklepySpozywczePage() {
  const category = categoriesData["sklepy-spozywcze"]

  return (
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop />
      <CategoryPageView category={category} />
    </div>
  )
}
