"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import {
  ChevronRight,
  ExternalLink,
  Share2,
  AlertTriangle,
  Check,
  Flag,
  Building,
  MapPin,
  Factory,
  Users,
  History,
  FileText,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ScrollToTop } from "@/components/scroll-to-top"
import { ReportForm } from "@/components/report-form"
import { CompanyLogo } from "@/components/company-logo"
import { calculateIndexBreakdown, getScoreColor, CRITERION_LABELS, type CompanyBreakdown } from "@/lib/company-utils"
import categories from "@/data/categories.json"

interface CompanyDetail {
  id: string
  brand: string
  company: string
  categorySlug: string
  score: number
  badges: string[]
  website?: string
  logoUrl?: string
  logoDarkUrl?: string
  brandColor?: string
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

function getCategoryName(slug: string): string {
  const category = categories[slug as keyof typeof categories]
  return category?.name || slug
}

function getPolishAlternatives(categorySlug: string, currentId: string) {
  const category = categories[categorySlug as keyof typeof categories]
  if (!category) return []

  return category.items
    .filter((item: any) => item.id !== currentId && item.score >= 70)
    .sort((a: any, b: any) => b.score - a.score)
    .slice(0, 6)
}

function ShareButton({ url, brand }: { url: string; brand: string }) {
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy URL:", err)
    }
  }

  return (
    <Button variant="outline" onClick={handleShare} className="flex items-center gap-2 bg-transparent">
      {copied ? <Check className="h-4 w-4" /> : <Share2 className="h-4 w-4" />}
      {copied ? "Skopiowano!" : "Udostępnij"}
    </Button>
  )
}

function ScoreRing({ score, size = 120 }: { score: number; size?: number }) {
  const radius = (size - 8) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (score / 100) * circumference

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="transform -rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          className="text-slate-200"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          className={`transition-all duration-1000 ${
            score >= 70 ? "text-green-500" : score >= 40 ? "text-yellow-500" : "text-red-500"
          }`}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-2xl font-bold text-slate-900">{score}</span>
        <span className="text-xs text-slate-600">/100</span>
      </div>
    </div>
  )
}

function SegmentBar({ breakdown }: { breakdown: CompanyBreakdown }) {
  const segments = [
    { key: "capital", max: 40, color: "bg-red-500" },
    { key: "hq", max: 15, color: "bg-blue-500" },
    { key: "taxes", max: 15, color: "bg-green-500" },
    { key: "production", max: 10, color: "bg-yellow-500" },
    { key: "employment", max: 10, color: "bg-purple-500" },
    { key: "rnd", max: 5, color: "bg-pink-500" },
    { key: "brandOrigin", max: 5, color: "bg-indigo-500" },
  ]

  return (
    <div className="w-full">
      <div className="flex h-8 rounded-lg overflow-hidden bg-slate-200">
        {segments.map(({ key, max, color }) => {
          const value = breakdown[key as keyof CompanyBreakdown] || 0
          const percentage = (value / 100) * 100
          return (
            <div
              key={key}
              className={`${color} flex items-center justify-center text-white text-xs font-medium`}
              style={{ width: `${max}%` }}
              title={`${CRITERION_LABELS[key as keyof typeof CRITERION_LABELS]}: ${value}/${max}`}
            >
              {value > 0 && `${value}/${max}`}
            </div>
          )
        })}
      </div>
      <div className="flex justify-between text-xs text-slate-600 mt-2">
        {segments.map(({ key, max }) => (
          <span key={key} className="text-center" style={{ width: `${max}%` }}>
            {CRITERION_LABELS[key as keyof typeof CRITERION_LABELS]}
          </span>
        ))}
      </div>
    </div>
  )
}

function StickyNav({ activeSection }: { activeSection: string }) {
  const sections = [
    { id: "overview", label: "Przegląd", icon: Star },
    { id: "ownership", label: "Właścicielstwo", icon: Building },
    { id: "hq-tax", label: "Siedziba i podatki", icon: MapPin },
    { id: "production", label: "Produkcja", icon: Factory },
    { id: "employment", label: "Zatrudnienie i R&D", icon: Users },
    { id: "sources", label: "Źródła", icon: FileText },
    { id: "history", label: "Historia", icon: History },
    { id: "alternatives", label: "Alternatywy", icon: Star },
  ]

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(`section-${sectionId}`)
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" })
    }
  }

  return (
    <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex overflow-x-auto scrollbar-hide">
          {sections.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => scrollToSection(id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeSection === id
                  ? "border-red-600 text-red-600"
                  : "border-transparent text-slate-600 hover:text-slate-900"
              }`}
            >
              <Icon className="h-4 w-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default function CompanyProfileClient({ params, company }: { params: { id: string }; company: CompanyDetail }) {
  const [activeSection, setActiveSection] = useState("overview")
  const categoryName = getCategoryName(company.categorySlug)
  const polishAlternatives = getPolishAlternatives(company.categorySlug, company.id)

  const currentUrl =
    typeof window !== "undefined" ? `${window.location.origin}/firma/${company.id}` : `/firma/${company.id}`

  const breakdown = company.breakdown || calculateIndexBreakdown(company.score, company.badges)

  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "overview",
        "ownership",
        "hq-tax",
        "production",
        "employment",
        "sources",
        "history",
        "alternatives",
      ]
      const scrollPosition = window.scrollY + 200

      for (const sectionId of sections) {
        const element = document.getElementById(`section-${sectionId}`)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(sectionId)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const getScoreFactors = () => {
    const positive = []
    const negative = []

    if (company.badges.includes("KAPITAŁ_PL")) positive.push("Kapitał polski")
    else negative.push("Kapitał poza PL")

    if (company.badges.includes("SIEDZIBA_PL")) positive.push("Siedziba w PL")
    else negative.push("Siedziba poza PL")

    if (company.badges.includes("CIT_PL")) positive.push("Płaci CIT w PL")
    else negative.push("Brak potwierdzenia CIT w PL")

    if (company.badges.includes("PRODUKCJA_PL")) positive.push("Produkcja w PL")
    else negative.push("Brak danych o produkcji w PL")

    if (company.badges.includes("ZATRUDNIENIE_PL")) positive.push("Zatrudnia w PL")
    else negative.push("Brak danych o zatrudnieniu w PL")

    return { positive, negative }
  }

  const { positive, negative } = getScoreFactors()

  return (
    <>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50">
        {/* Breadcrumb */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="flex items-center space-x-2 text-sm text-slate-600">
              <Link href="/" className="hover:text-slate-900">
                Strona główna
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href="/#kategorie" className="hover:text-slate-900">
                Kategorie
              </Link>
              <ChevronRight className="h-4 w-4" />
              <Link href={`/kategoria/${company.categorySlug}`} className="hover:text-slate-900">
                {categoryName}
              </Link>
              <ChevronRight className="h-4 w-4" />
              <span className="text-slate-900 font-medium">{company.brand}</span>
            </nav>
          </div>
        </div>

        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Left Column */}
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <CompanyLogo
                    id={company.id}
                    brandName={company.brand}
                    logoUrl={company.logoUrl}
                    logoDarkUrl={company.logoDarkUrl}
                    brandColor={company.brandColor}
                    size={64}
                    rounded={8}
                    priority={true}
                    className="flex-shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <h1 className="text-2xl lg:text-3xl font-bold text-slate-900 mb-1">{company.brand}</h1>
                    <p className="text-slate-600 mb-2">{company.company}</p>
                    <Link
                      href={`/kategoria/${company.categorySlug}`}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      {categoryName}
                    </Link>
                  </div>
                </div>

                {/* Facts Pills */}
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  <div className="pill bg-slate-100 px-3 py-2 rounded-lg text-center">
                    <div className="text-xs text-slate-600">Kapitał</div>
                    <div className="text-sm font-medium">
                      {company.badges.includes("KAPITAŁ_PL") ? "PL" : "Międzynarodowy"}
                    </div>
                  </div>
                  <div className="pill bg-slate-100 px-3 py-2 rounded-lg text-center">
                    <div className="text-xs text-slate-600">Siedziba</div>
                    <div className="text-sm font-medium">
                      {company.headquarters ? `${company.headquarters.city}, ${company.headquarters.country}` : "—"}
                    </div>
                  </div>
                  <div className="pill bg-slate-100 px-3 py-2 rounded-lg text-center">
                    <div className="text-xs text-slate-600">CIT w PL</div>
                    <div className="text-sm font-medium">{company.tax?.paysCITinPL ? "Tak" : "Nie"}</div>
                  </div>
                  <div className="pill bg-slate-100 px-3 py-2 rounded-lg text-center">
                    <div className="text-xs text-slate-600">Produkcja w PL</div>
                    <div className="text-sm font-medium capitalize">{company.production?.inPL || "—"}</div>
                  </div>
                  <div className="pill bg-slate-100 px-3 py-2 rounded-lg text-center">
                    <div className="text-xs text-slate-600">Zatrudnienie w PL</div>
                    <div className="text-sm font-medium capitalize">{company.employment?.inPL || "—"}</div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div className="flex flex-col items-center lg:items-end">
                  <ScoreRing score={company.score} />
                  <div className="text-center lg:text-right mt-4">
                    <div className="text-lg font-bold text-slate-900 mb-1">Indeks polskości: {company.score}/100</div>
                    <p className="text-sm text-slate-600 max-w-xs">
                      {negative.length > 0
                        ? `Główny wpływ: ${negative.slice(0, 2).join(" i ").toLowerCase()}.`
                        : "Wysoki wynik dzięki polskiemu kapitałowi i działalności w PL."}
                    </p>
                  </div>
                </div>

                <div className="text-center lg:text-right">
                  <div className="text-xs text-slate-500 mb-4">
                    Ostatnia weryfikacja: {company.lastVerified} • Źródła: {company.sources?.length || 0} • Poziom
                    zaufania:{" "}
                    {company.sources && company.sources.length > 3
                      ? "wysoki"
                      : company.sources && company.sources.length > 1
                        ? "średni"
                        : "niski"}
                  </div>

                  <div className="flex flex-wrap gap-2 justify-center lg:justify-end">
                    <ShareButton url={currentUrl} brand={company.brand} />
                    <ReportForm />
                    {company.website && (
                      <Button variant="outline" asChild size="sm">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2"
                        >
                          <ExternalLink className="h-4 w-4" />
                          Strona firmy
                        </a>
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Demo Warning */}
            <div className="mt-6 p-3 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertTriangle className="h-4 w-4" />
                <span className="text-sm">Wartości demonstracyjne — nie są danymi rzeczywistymi.</span>
              </div>
            </div>
          </div>
        </div>

        <StickyNav activeSection={activeSection} />

        <div className="container mx-auto px-4 py-8 space-y-8">
          <section id="section-overview" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-6">
              <Star className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Przegląd</h2>
            </div>

            <div className="space-y-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Rozbicie wyniku na kryteria</h3>
                <SegmentBar breakdown={breakdown} />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Co podnosi wynik</h4>
                  {positive.length > 0 ? (
                    <ul className="text-sm text-green-700 space-y-1">
                      {positive.map((factor, index) => (
                        <li key={index}>• {factor}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-green-700">Brak pozytywnych czynników</p>
                  )}
                </div>

                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <h4 className="font-semibold text-red-800 mb-2">Co obniża wynik</h4>
                  {negative.length > 0 ? (
                    <ul className="text-sm text-red-700 space-y-1">
                      {negative.map((factor, index) => (
                        <li key={index}>• {factor}</li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-sm text-red-700">Brak negatywnych czynników</p>
                  )}
                </div>
              </div>

              <div className="text-sm text-slate-600">
                <Link href="/#metodologia" className="text-red-600 hover:text-red-700">
                  Jak to liczymy?
                </Link>
              </div>
            </div>
          </section>

          <section id="section-ownership" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Building className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Właścicielstwo i kapitał</h2>
              <button className="ml-auto text-slate-400 hover:text-red-600">
                <Flag className="h-4 w-4" />
              </button>
            </div>

            {company.ownership?.companyTree ? (
              <div className="space-y-4">
                <div className="space-y-2">
                  {company.ownership.companyTree.map((level, index) => (
                    <div key={index} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg">
                      <div className="w-2 h-2 bg-red-600 rounded-full"></div>
                      <span className="font-medium text-slate-700">{level.label}:</span>
                      <span className="text-slate-900">{level.value}</span>
                    </div>
                  ))}
                </div>

                {company.ownership?.beneficialOwners && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Beneficjenci rzeczywiści</h3>
                    <div className="space-y-2">
                      {company.ownership.beneficialOwners.map((owner, index) => (
                        <div key={index} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                          <span className="font-medium text-slate-900">{owner.name}</span>
                          <div className="text-right">
                            <div className="text-sm text-slate-600">{owner.country}</div>
                            {owner.share && <div className="font-medium text-slate-900">{owner.share}</div>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800">
                    {company.badges.includes("KAPITAŁ_PL")
                      ? "Kapitał większościowy w PL → pełne punkty w komponencie Kapitał"
                      : "Kapitał większościowy poza PL → 0/40 w komponencie Kapitał"}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500 mb-2">Brak potwierdzonych danych o właścicielach.</p>
                <button className="text-red-600 hover:text-red-700 text-sm font-medium">Dodaj źródło</button>
              </div>
            )}
          </section>

          <section id="section-hq-tax" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Siedziba i podatki</h2>
              <button className="ml-auto text-slate-400 hover:text-red-600">
                <Flag className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Siedziba</h3>
                {company.headquarters ? (
                  <div className="space-y-2">
                    <div className="p-3 bg-slate-50 rounded-lg">
                      <div className="font-medium text-slate-900">
                        {company.headquarters.city}, {company.headquarters.country}
                      </div>
                    </div>
                    {company.registry && (
                      <div className="space-y-1 text-sm text-slate-600">
                        {company.registry.krs && <div>KRS: {company.registry.krs}</div>}
                        {company.registry.nip && <div>NIP: {company.registry.nip}</div>}
                        {company.registry.regon && <div>REGON: {company.registry.regon}</div>}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Dane w przygotowaniu</p>
                )}
              </div>

              <div>
                <h3 className="font-semibold text-slate-900 mb-3">Podatki</h3>
                {company.tax ? (
                  <div className="p-3 bg-slate-50 rounded-lg">
                    <div className="font-medium text-slate-900">
                      CIT w Polsce: {company.tax.paysCITinPL ? "Tak" : "Nie"}
                    </div>
                    {company.tax.lastYear && (
                      <div className="text-sm text-slate-600 mt-1">Ostatni rok: {company.tax.lastYear}</div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Dane w przygotowaniu</p>
                )}
              </div>
            </div>

            <div className="mt-4 text-xs text-slate-500">
              Pewność danych:{" "}
              {company.sources && company.sources.length > 3
                ? "wysoka"
                : company.sources && company.sources.length > 1
                  ? "średnia"
                  : "niska"}
            </div>
          </section>

          <section id="section-production" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Factory className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Produkcja i łańcuch dostaw</h2>
              <button className="ml-auto text-slate-400 hover:text-red-600">
                <Flag className="h-4 w-4" />
              </button>
            </div>

            {company.production ? (
              <div className="space-y-4">
                <div className="p-4 bg-slate-50 rounded-lg">
                  <div className="font-semibold text-slate-900 mb-2">
                    Produkcja w PL: <span className="capitalize">{company.production.inPL}</span>
                  </div>
                  {company.production.notes && <p className="text-slate-600 text-sm">{company.production.notes}</p>}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">Brak potwierdzonych danych o miejscu produkcji.</p>
              </div>
            )}
          </section>

          <section id="section-employment" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Zatrudnienie i R&D</h2>
              <button className="ml-auto text-slate-400 hover:text-red-600">
                <Flag className="h-4 w-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">Zatrudnienie w PL</h3>
                </div>
                {company.employment ? (
                  <div>
                    <div className="font-medium text-slate-900 capitalize">{company.employment.inPL}</div>
                    {company.employment.headcountPL && (
                      <div className="text-sm text-slate-600 mt-1">
                        {company.employment.headcountPL.toLocaleString()} osób
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Brak danych</p>
                )}
              </div>

              <div className="p-4 bg-slate-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Star className="h-4 w-4 text-slate-600" />
                  <h3 className="font-semibold text-slate-900">R&D w PL</h3>
                </div>
                {company.rnd ? (
                  <div>
                    <div className="font-medium text-slate-900">{company.rnd.inPL ? "Tak" : "Nie"}</div>
                    {company.rnd.notes && <p className="text-sm text-slate-600 mt-1">{company.rnd.notes}</p>}
                  </div>
                ) : (
                  <p className="text-slate-500 italic">Brak danych</p>
                )}
              </div>
            </div>
          </section>

          <section id="section-sources" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Źródła</h2>
            </div>

            {company.sources && company.sources.length > 0 ? (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-slate-900 mb-3">Rejestry i raporty</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {company.sources.slice(0, 2).map((source, index) => (
                      <a
                        key={index}
                        href={source.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="source-link flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4 text-slate-400" />
                        <div>
                          <div className="font-medium text-slate-900">{source.label}</div>
                          <div className="text-xs text-slate-500">Weryfikacja: {company.lastVerified}</div>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                {company.sources.length > 2 && (
                  <div>
                    <h3 className="font-semibold text-slate-900 mb-3">Strony firm</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {company.sources.slice(2).map((source, index) => (
                        <a
                          key={index}
                          href={source.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="source-link flex items-center gap-3 p-3 border rounded-lg hover:bg-slate-50 transition-colors"
                        >
                          <ExternalLink className="h-4 w-4 text-slate-400" />
                          <div>
                            <div className="font-medium text-slate-900">{source.label}</div>
                            <div className="text-xs text-slate-500">Weryfikacja: {company.lastVerified}</div>
                          </div>
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">Dane w przygotowaniu</p>
              </div>
            )}
          </section>

          <section id="section-history" className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center gap-2 mb-4">
              <History className="h-5 w-5 text-slate-600" />
              <h2 className="text-xl font-bold text-slate-900">Krótka historia</h2>
            </div>

            {company.history && company.history.length > 0 && company.history[0].date !== "Dane w przygotowaniu" ? (
              <div className="space-y-4">
                {company.history.slice(0, 6).map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex-shrink-0 w-16 text-right">
                      <span className="text-sm font-semibold text-red-600">{event.date}</span>
                    </div>
                    <div className="flex-shrink-0 w-3 h-3 bg-red-600 rounded-full mt-1"></div>
                    <div className="flex-1">
                      <div className="font-medium text-slate-900">{event.title}</div>
                      {event.text && <p className="text-slate-600 text-sm mt-1">{event.text}</p>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-500">Historia w przygotowaniu</p>
              </div>
            )}
          </section>

          {polishAlternatives.length > 0 && (
            <section id="section-alternatives" className="bg-white rounded-lg shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <Star className="h-5 w-5 text-slate-600" />
                <h2 className="text-xl font-bold text-slate-900">Polskie alternatywy</h2>
              </div>

              <div className="mb-4">
                <label className="flex items-center gap-2 text-sm">
                  <input type="checkbox" className="rounded" />
                  Pokaż tylko z wyższym indeksem niż ta firma
                </label>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {polishAlternatives.slice(0, 6).map((alternative: any) => (
                  <Link
                    key={alternative.id}
                    href={`/firma/${alternative.id}`}
                    className="alt-card block p-4 border rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <div className="flex items-start gap-3 mb-2">
                      <CompanyLogo
                        id={alternative.id}
                        brandName={alternative.brand}
                        logoUrl={alternative.logoUrl}
                        brandColor={alternative.brandColor}
                        size={28}
                        rounded={4}
                        priority={false}
                        className="flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h3 className="font-semibold text-slate-900 truncate">{alternative.brand}</h3>
                          <span className={`text-sm font-bold ml-2 ${getScoreColor(alternative.score)}`}>
                            {alternative.score}/100
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {alternative.badges.slice(0, 2).map((badge: string) => (
                        <Badge key={badge} variant="secondary" className="text-xs">
                          {badge.replace(/_/g, " ")}
                        </Badge>
                      ))}
                      {alternative.badges.length > 2 && (
                        <Badge variant="secondary" className="text-xs">
                          +{alternative.badges.length - 2}
                        </Badge>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}
        </div>
      </div>
    </>
  )
}
