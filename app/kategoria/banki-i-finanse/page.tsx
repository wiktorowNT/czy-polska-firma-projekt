import type { Metadata } from "next"
import ScrollToTop from "@/components/scroll-to-top"
import CategoryPageView from "@/components/category-page-view"
import categoriesData from "@/data/categories.json"

export const dynamic = 'force-dynamic';
export const metadata: Metadata = {
  title: "Banki i finanse - Czy Polska Firma",
  description: "Sprawdź indeks polskości banków i usług finansowych. Które instytucje finansowe są polskie?",
  openGraph: {
    title: "Banki i finanse - Czy Polska Firma",
    description: "Sprawdź indeks polskości banków i usług finansowych. Które instytucje finansowe są polskie?",
  },
}

export default function CategoryBankiFinanse() {
  const category = categoriesData["banki-i-finanse"]

  if (!category) {
    return <div>Kategoria nie została znaleziona</div>
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop />
      <CategoryPageView category={category} />
    </div>
    </Suspense>
  )
}

