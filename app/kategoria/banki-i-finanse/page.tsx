import { Suspense } from "react";
import type { Metadata } from "next";
import ScrollToTop from "@/components/scroll-to-top";
import CategoryPageView from "@/components/category-page-view";
import categoriesData from "@/data/categories.json";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Banki i finanse - Czy Polska Firma",
  description: "Sprawdź indeks polskości banków i usług finansowych. Które instytucje finansowe są polskie?",
  openGraph: {
    title: "Banki i finanse - Czy Polska Firma",
    description: "Sprawdź indeks polskości banków i usług finansowych. Które instytucje finansowe są polskie?",
  },
};

type SearchParams = { [key: string]: string | string[] | undefined };

export default function CategoryBankiFinanse({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const category = categoriesData["banki-i-finanse"];
  if (!category) return <div>Kategoria nie została znaleziona</div>;

  const q = typeof searchParams.q === "string" ? searchParams.q : "";
  const sort = typeof searchParams.sort === "string" ? searchParams.sort : "score-desc";
  const minScore =
    typeof searchParams.minScore === "string" ? parseInt(searchParams.minScore) || 0 : 0;
  const badges =
    typeof searchParams.badges === "string" && searchParams.badges.length > 0
      ? searchParams.badges.split(",").filter(Boolean)
      : [];

  return (
    <div className="min-h-screen bg-slate-50">
      <ScrollToTop />
      <Suspense fallback={<div>Ładowanie…</div>}>
        <CategoryPageView
          category={category}
          initialQ={q}
          initialSort={sort}
          initialMinScore={minScore}
          initialBadges={badges}
        />
      </Suspense>
    </div>
  );
}