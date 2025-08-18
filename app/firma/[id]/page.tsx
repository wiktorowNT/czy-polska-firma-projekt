import type { Metadata } from "next"
import { notFound } from "next/navigation"
import companyDetails from "@/data/company-details.json"
import categories from "@/data/categories.json"
import { calculateIndexBreakdown, type CompanyBreakdown } from "@/lib/company-utils"
import CompanyProfileClient from "./CompanyProfileClient"

interface CompanyDetail {
  id: string
  brand: string
  company: string
  categorySlug: string
  score: number
  badges: string[]
  website?: string
  logoUrl?: string
  headquarters?: { country: string; city: string }
  registry?: { krs?: string; nip?: string; regon?: string }
  tax?: { paysCITinPL?: boolean; lastYear?: string }
  production?: { inPL?: "tak" | "częściowo" | "nie"; notes?: string }
  employment?: { inPL?: "tak" | "częściowo" | "brak danych"; headcountPL?: number }
  rnd?: { inPL?: boolean; notes?: string }
  brandOrigin?: { fromPL?: boolean; notes?: string }
  ownership?: {
    companyTree?: Array<{ label: string; value: string }>
    beneficialOwners?: Array<{ name: string; country?: string; share?: string }>
  }
  breakdown?: CompanyBreakdown
  history?: Array<{ date: string; title: string; text?: string }>
  sources?: Array<{ label: string; url: string }>
  lastVerified?: string
}

function normalizeId(id: string): string {
  return id.toLowerCase().replace(/[\s_]/g, "-")
}

function findCompanyInCategories(id: string) {
  const normalizedId = normalizeId(id)

  for (const [categorySlug, categoryData] of Object.entries(categories)) {
    const company = categoryData.items.find((item: any) => normalizeId(item.id) === normalizedId)
    if (company) {
      return {
        ...company,
        categorySlug,
        categoryName: categoryData.name,
      }
    }
  }
  return null
}

function getCompanyData(id: string): CompanyDetail | null {
  const normalizedId = normalizeId(id)

  const detailedData = companyDetails[normalizedId as keyof typeof companyDetails]
  if (detailedData) {
    return detailedData as CompanyDetail
  }

  const categoryCompany = findCompanyInCategories(normalizedId)
  if (categoryCompany) {
    const breakdown = calculateIndexBreakdown(categoryCompany.score, categoryCompany.badges)

    return {
      id: categoryCompany.id,
      brand: categoryCompany.brand,
      company: categoryCompany.company || categoryCompany.brand,
      categorySlug: categoryCompany.categorySlug,
      score: categoryCompany.score,
      badges: categoryCompany.badges,
      breakdown,
      history: [{ date: "Dane w przygotowaniu", title: "Historia firmy będzie dostępna wkrótce" }],
      sources: [{ label: "Dane w przygotowaniu", url: "#" }],
      lastVerified: "2024-01-01",
    }
  }

  return null
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const company = getCompanyData(params.id)

  if (!company) {
    return {
      title: "Firma nie znaleziona | CzyPolskaFirma",
      description: "Nie znaleziono profilu firmy w bazie danych CzyPolskaFirma.",
    }
  }

  return {
    title: `${company.brand} — Indeks polskości | CzyPolskaFirma`,
    description: `Sprawdź indeks polskości firmy ${company.brand} (${company.company}). Wynik: ${company.score}/100 punktów.`,
    openGraph: {
      title: `${company.brand} — Indeks polskości ${company.score}/100`,
      description: `Szczegółowy profil firmy ${company.brand} w serwisie CzyPolskaFirma`,
      type: "website",
    },
  }
}

export default function CompanyProfilePage({ params }: { params: { id: string } }) {
  const company = getCompanyData(params.id)

  if (!company) {
    notFound()
  }

  return <CompanyProfileClient params={params} company={company} />
}
