"use client";

import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation"; // UWAGA: bez useSearchParams
import { ChevronRight, Search, X, Info, Flag, ExternalLink } from "lucide-react";
import { CompanyLogo } from "@/components/company-logo";
import companyDetailsData from "@/data/company-details.json";

interface CategoryItem {
  id: string
  brand: string
  company: string
  score: number
  badges: string[]
  logo?: string
  logoUrl?: string
  logoDarkUrl?: string
  brandColor?: string
}

interface Category {
  slug: string
  name: string
  short: string
  items: CategoryItem[]
}

interface CategoryPageViewProps {
category: Category;
initialQ?: string;
initialSort?: string;
initialMinScore?: number;
initialBadges?: string[];
}

const badgeLabels: Record<string, string> = {
  PL_CAPITAL_50: ">50% kapitału PL",
  HQ_PL: "Siedziba w PL",
  CIT_PL: "CIT w PL",
  PRODUCTION_PL: "Produkcja w PL",
  PRODUCTION_PL_PARTIAL: "Produkcja: częściowo",
  EMPLOYMENT_PL: "Zatrudnia w PL",
  RD_PL: "R&D w PL",
  BRAND_FROM_PL: "Marka z PL",
  COOP: "Spółdzielnia",
  COOP_NETWORK: "Sieć partnerska",
}

const sortOptions = [
  { value: "score-desc", label: "Indeks malejąco" },
  { value: "score-asc", label: "Indeks rosnąco" },
  { value: "name-asc", label: "Nazwa A–Z" },
  { value: "name-desc", label: "Nazwa Z–A" },
  { value: "verified-desc", label: "Ostatnia weryfikacja" },
]

const filterBadges = [
  "PL_CAPITAL_50",
  "HQ_PL",
  "CIT_PL",
  "PRODUCTION_PL",
  "EMPLOYMENT_PL",
  "COOP",
  "COOP_NETWORK",
  "RD_PL",
]

function getScoreColor(score: number): string {
  if (score >= 70) return "bg-green-500"
  if (score >= 40) return "bg-yellow-500"
  return "bg-red-500"
}

function getScoreTextColor(score: number): string {
  if (score >= 70) return "text-green-700"
  if (score >= 40) return "text-yellow-700"
  return "text-red-700"
}

function calculateMicroBreakdown(item: CategoryItem) {
  const companyDetails = companyDetailsData[item.id as keyof typeof companyDetailsData]

  if (companyDetails?.breakdown) {
    return {
      capital: companyDetails.breakdown.capital,
      taxes: companyDetails.breakdown.taxes,
      hq: companyDetails.breakdown.hq,
    }
  }

  // Fallback calculation from badges
  const weights = { capital: 40, hq: 15, taxes: 15, production: 10, employment: 10, rd: 5, brand: 5 }
  const coverage = {
    capital: item.badges.includes("PL_CAPITAL_50") ? 0.8 : 0,
    hq: item.badges.includes("HQ_PL") ? 1.0 : 0,
    taxes: item.badges.includes("CIT_PL") ? 0.9 : 0,
    production: item.badges.includes("PRODUCTION_PL") ? 1.0 : item.badges.includes("PRODUCTION_PL_PARTIAL") ? 0.5 : 0,
    employment: item.badges.includes("EMPLOYMENT_PL") ? 0.7 : 0,
    rd: item.badges.includes("RD_PL") ? 0.9 : 0,
    brand: item.badges.includes("BRAND_FROM_PL") ? 1.0 : 0,
  }

  if (item.badges.includes("COOP")) coverage.employment += 0.1
  if (item.badges.includes("COOP_NETWORK")) coverage.capital += 0.1

  const basePoints = {
    capital: coverage.capital * weights.capital,
    hq: coverage.hq * weights.hq,
    taxes: coverage.taxes * weights.taxes,
  }

  const totalBase = Object.values(basePoints).reduce((sum, val) => sum + val, 0)
  const scaleFactor = item.score / totalBase

  return {
    capital: Math.round(basePoints.capital * scaleFactor),
    taxes: Math.round(basePoints.taxes * scaleFactor),
    hq: Math.round(basePoints.hq * scaleFactor),
  }
}

export default function CategoryPageView({
  category,
  initialQ = "",
  initialSort = "score-desc",
  initialMinScore = 0,
  initialBadges = [],
}: CategoryPageViewProps) {
  const router = useRouter()

  const [searchTerm, setSearchTerm] = useState(initialQ)
  const [sortBy, setSortBy] = useState(initialSort)
  const [minScore, setMinScore] = useState(initialMinScore)
  const [selectedBadges, setSelectedBadges] = useState<string[]>(initialBadges)
  const [visibleItems, setVisibleItems] = useState(12)
  const [showMobileFilters, setShowMobileFilters] = useState(false)

  // Update URL when filters change
  useEffect(() => {
    const params = new URLSearchParams()
    if (searchTerm) params.set("q", searchTerm)
    if (sortBy !== "score-desc") params.set("sort", sortBy)
    if (minScore > 0) params.set("minScore", minScore.toString())
    if (selectedBadges.length > 0) params.set("badges", selectedBadges.join(","))

    const newUrl = `${window.location.pathname}${params.toString() ? `?${params.toString()}` : ""}`
    router.replace(newUrl, { scroll: false })
  }, [searchTerm, sortBy, minScore, selectedBadges, router])

  const filteredAndSortedItems = useMemo(() => {
    const filtered = category.items.filter((item) => {
      // Search filter
      if (
        searchTerm &&
        !item.brand.toLowerCase().includes(searchTerm.toLowerCase()) &&
        !item.company.toLowerCase().includes(searchTerm.toLowerCase())
      ) {
        return false
      }

      // Score filter
      if (item.score < minScore) return false

      // Badge filters
      if (selectedBadges.length > 0 && !selectedBadges.every((badge) => item.badges.includes(badge))) {
        return false
      }

      return true
    })

    // Sort
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "score-asc":
          return a.score - b.score
        case "name-asc":
          return a.brand.localeCompare(b.brand)
        case "name-desc":
          return b.brand.localeCompare(a.brand)
        case "verified-desc":
          const aDetails = companyDetailsData[a.id as keyof typeof companyDetailsData]
          const bDetails = companyDetailsData[b.id as keyof typeof companyDetailsData]
          const aDate = aDetails?.lastVerified || "2024-01-01"
          const bDate = bDetails?.lastVerified || "2024-01-01"
          return new Date(bDate).getTime() - new Date(aDate).getTime()
        default: // score-desc
          return b.score - a.score
      }
    })

    return filtered
  }, [category.items, searchTerm, sortBy, minScore, selectedBadges])

  // Calculate metrics
  const metrics = useMemo(() => {
    const scores = filteredAndSortedItems.map((item) => item.score)
    const median = scores.length > 0 ? scores.sort((a, b) => a - b)[Math.floor(scores.length / 2)] : 0
    const highScoreCount = scores.filter((score) => score >= 70).length
    const highScorePercent = scores.length > 0 ? Math.round((highScoreCount / scores.length) * 100) : 0

    // Get latest verification date
    const verificationDates = filteredAndSortedItems
      .map((item) => companyDetailsData[item.id as keyof typeof companyDetailsData]?.lastVerified)
      .filter(Boolean)
      .sort()
    const latestVerification = verificationDates.length > 0 ? verificationDates[verificationDates.length - 1] : null

    return {
      count: filteredAndSortedItems.length,
      median,
      highScorePercent,
      latestVerification,
    }
  }, [filteredAndSortedItems])

  const topCompanies = useMemo(() => {
    return [...category.items].sort((a, b) => b.score - a.score).slice(0, 3)
  }, [category.items])

  const clearFilters = () => {
    setSearchTerm("")
    setSortBy("score-desc")
    setMinScore(0)
    setSelectedBadges([])
    setVisibleItems(12)
  }

  const activeFiltersCount =
    (searchTerm ? 1 : 0) + (sortBy !== "score-desc" ? 1 : 0) + (minScore > 0 ? 1 : 0) + selectedBadges.length

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav aria-label="Breadcrumb" className="mb-6">
        <ol className="flex items-center space-x-2 text-sm text-slate-600">
          <li>
            <Link href="/" className="hover:text-slate-900 transition-colors">
              Strona główna
            </Link>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li>
            <span className="text-slate-400">Kategorie</span>
          </li>
          <li>
            <ChevronRight className="w-4 h-4" />
          </li>
          <li>
            <span className="text-slate-900 font-medium">{category.name}</span>
          </li>
        </ol>
      </nav>

      {/* Hero Section */}
      <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">{category.name}</h1>
            <p className="text-lg text-slate-600 mb-4">{category.short}</p>

            {/* Metrics Bar */}
            <div className="flex flex-wrap gap-4 text-sm text-slate-600">
              <span>
                Liczba marek: <strong>{metrics.count}</strong>
              </span>
              <span>
                Mediana: <strong>{metrics.median}</strong>
              </span>
              <span>
                &gt;70 pkt: <strong>{metrics.highScorePercent}%</strong>
              </span>
              <span>
                Ostatnia aktualizacja: <strong>{metrics.latestVerification || "—"}</strong>
              </span>
            </div>
          </div>

          {/* Worth Noting Box */}
          <div className="lg:w-80">
            <h3 className="text-sm font-medium text-slate-700 mb-3">Warte uwagi</h3>
            <div className="space-y-2">
              {topCompanies.map((item) => (
                <Link
                  key={item.id}
                  href={`/firma/${item.id}`}
                  className="flex items-center justify-between p-2 bg-slate-50 rounded-md hover:bg-slate-100 transition-colors"
                >
                  <span className="text-sm font-medium">{item.brand}</span>
                  <span className={`text-sm font-bold ${getScoreTextColor(item.score)}`}>{item.score}/100</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Toolbar */}
      <div className="sticky top-0 z-10 bg-white rounded-lg shadow-sm border border-slate-200 p-4 mb-6">
        {/* Desktop Toolbar */}
        <div className="hidden lg:flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Szukaj po nazwie marki lub spółki…"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm("")}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort */}
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
          >
            {sortOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Badge Filters */}
          <div className="flex flex-wrap gap-2">
            {filterBadges.map((badge) => (
              <button
                key={badge}
                onClick={() => {
                  setSelectedBadges((prev) =>
                    prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge],
                  )
                }}
                className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                  selectedBadges.includes(badge)
                    ? "bg-red-100 text-red-800 border border-red-200"
                    : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                }`}
              >
                {badgeLabels[badge]}
              </button>
            ))}
          </div>

          {/* Min Score Slider */}
          <div className="flex items-center gap-2 min-w-32">
            <label className="text-sm text-slate-600">Min:</label>
            <input
              type="range"
              min="0"
              max="100"
              value={minScore}
              onChange={(e) => setMinScore(Number.parseInt(e.target.value))}
              className="flex-1"
            />
            <span className="text-sm font-medium w-8">{minScore}</span>
          </div>
        </div>

        {/* Mobile Toolbar */}
        <div className="lg:hidden">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="w-full flex items-center justify-between p-3 bg-slate-50 rounded-md"
          >
            <span>Filtry i sortowanie ({activeFiltersCount})</span>
            <ChevronRight className={`w-4 h-4 transition-transform ${showMobileFilters ? "rotate-90" : ""}`} />
          </button>

          {showMobileFilters && (
            <div className="mt-4 space-y-4 p-4 bg-slate-50 rounded-md">
              {/* Mobile Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Szukaj po nazwie marki lub spółki…"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-8 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Mobile Sort */}
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-3 py-2 border border-slate-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>

              {/* Mobile Badge Filters */}
              <div className="flex flex-wrap gap-2">
                {filterBadges.map((badge) => (
                  <button
                    key={badge}
                    onClick={() => {
                      setSelectedBadges((prev) =>
                        prev.includes(badge) ? prev.filter((b) => b !== badge) : [...prev, badge],
                      )
                    }}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                      selectedBadges.includes(badge)
                        ? "bg-red-100 text-red-800 border border-red-200"
                        : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                    }`}
                  >
                    {badgeLabels[badge]}
                  </button>
                ))}
              </div>

              {/* Mobile Min Score */}
              <div className="flex items-center gap-2">
                <label className="text-sm text-slate-600">Minimalny indeks:</label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={minScore}
                  onChange={(e) => setMinScore(Number.parseInt(e.target.value))}
                  className="flex-1"
                />
                <span className="text-sm font-medium w-8">{minScore}</span>
              </div>
            </div>
          )}
        </div>

        {/* Results Counter and Clear Filters */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-slate-200">
          <span className="text-sm text-slate-600">
            Znaleziono <strong>{metrics.count}</strong> marek
          </span>
          {activeFiltersCount > 0 && (
            <button onClick={clearFilters} className="text-sm text-red-600 hover:text-red-700 font-medium">
              Usuń filtry
            </button>
          )}
        </div>
      </div>

      {/* Company Cards */}
      {filteredAndSortedItems.length > 0 ? (
        <>
          <div className="grid gap-4 mb-6">
            {filteredAndSortedItems.slice(0, visibleItems).map((item) => {
              const microBreakdown = calculateMicroBreakdown(item)
              const companyDetails = companyDetailsData[item.id as keyof typeof companyDetailsData]

              return (
                <Link
                  key={item.id}
                  href={`/firma/${item.id}`}
                  className="block bg-white rounded-lg shadow-sm border border-slate-200 p-4 hover:shadow-md hover:border-slate-300 transition-all duration-200 focus:ring-2 focus:ring-red-500 focus:outline-none group"
                  aria-label={`Profil marki ${item.brand} – indeks ${item.score} na 100`}
                >
                  <div className="flex items-start justify-between mb-3">
                    {/* Left Column */}
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <CompanyLogo
                          id={item.id}
                          brandName={item.brand}
                          logoUrl={item.logoUrl}
                          logoDarkUrl={item.logoDarkUrl}
                          brandColor={item.brandColor}
                          size={32}
                          rounded={6}
                          priority={false}
                        />
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 group-hover:text-red-600 transition-colors">
                            {item.brand}
                          </h3>
                          <p className="text-sm text-slate-600">{item.company}</p>
                        </div>
                      </div>

                      {/* Top Badges */}
                      <div className="flex flex-wrap gap-1 mb-2">
                        {item.badges.slice(0, 3).map((badge) => (
                          <span
                            key={badge}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700"
                          >
                            {badgeLabels[badge] || badge}
                          </span>
                        ))}
                        {item.badges.length > 3 && (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-500">
                            +{item.badges.length - 3}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Right Column */}
                    <div className="flex flex-col items-end">
                      <div className="flex items-center gap-2 mb-1">
                        <span className={`text-2xl font-bold ${getScoreTextColor(item.score)}`}>{item.score}/100</span>
                        <div className="group/tooltip relative">
                          <Info className="w-4 h-4 text-slate-400 hover:text-slate-600 cursor-help" />
                          <div className="absolute right-0 top-6 w-48 p-2 bg-slate-900 text-white text-xs rounded shadow-lg opacity-0 group-hover/tooltip:opacity-100 transition-opacity pointer-events-none z-20">
                            Ostatnia weryfikacja: {companyDetails?.lastVerified || "—"} • Źródła:{" "}
                            {companyDetails?.sources?.length || 0}
                          </div>
                        </div>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-24 bg-slate-200 rounded-full h-2 mb-2">
                        <div
                          className={`h-2 rounded-full ${getScoreColor(item.score)}`}
                          style={{ width: `${item.score}%` }}
                          role="progressbar"
                          aria-valuenow={item.score}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`Indeks polskości: ${item.score} na 100`}
                        />
                      </div>

                      {/* Report Flag */}
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          // Open report form with pre-filled brand name
                          console.log("Report form for:", item.brand)
                        }}
                        className="text-slate-400 hover:text-red-500 transition-colors"
                        title="Zgłoś poprawkę"
                      >
                        <Flag className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Micro-breakdown */}
                  <div className="border-t border-slate-100 pt-3">
                    <div className="grid grid-cols-3 gap-4 text-xs">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-600">Kapitał</span>
                          <span className="font-medium">{microBreakdown.capital}/40</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1">
                          <div
                            className="bg-slate-600 h-1 rounded-full"
                            style={{ width: `${(microBreakdown.capital / 40) * 100}%` }}
                            aria-label={`Kapitał: ${microBreakdown.capital} na 40`}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-600">Podatki</span>
                          <span className="font-medium">{microBreakdown.taxes}/15</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1">
                          <div
                            className="bg-slate-600 h-1 rounded-full"
                            style={{ width: `${(microBreakdown.taxes / 15) * 100}%` }}
                            aria-label={`Podatki: ${microBreakdown.taxes} na 15`}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-slate-600">Siedziba</span>
                          <span className="font-medium">{microBreakdown.hq}/15</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-1">
                          <div
                            className="bg-slate-600 h-1 rounded-full"
                            style={{ width: `${(microBreakdown.hq / 15) * 100}%` }}
                            aria-label={`Siedziba: ${microBreakdown.hq} na 15`}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-slate-500">
                        Wartości demonstracyjne — nie są danymi rzeczywistymi.
                      </span>
                      <span className="text-xs text-red-600 font-medium flex items-center gap-1">
                        Zobacz profil <ExternalLink className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>

          {/* Show More Button */}
          {visibleItems < filteredAndSortedItems.length && (
            <div className="text-center">
              <button
                onClick={() => setVisibleItems((prev) => prev + 12)}
                className="px-6 py-3 bg-white border border-slate-300 rounded-md hover:bg-slate-50 transition-colors focus:ring-2 focus:ring-red-500 focus:outline-none"
              >
                Pokaż więcej ({filteredAndSortedItems.length - visibleItems} pozostało)
              </button>
            </div>
          )}
        </>
      ) : (
        /* Empty State */
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-slate-200">
          <div className="mb-4">
            <Search className="w-12 h-12 text-slate-300 mx-auto" />
          </div>
          <h3 className="text-lg font-medium text-slate-900 mb-2">Brak marek spełniających kryteria</h3>
          <p className="text-slate-600 mb-6">Spróbuj zmienić filtry lub wyszukiwane hasło</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={clearFilters}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Usuń filtry
            </button>
            <div className="flex gap-2">
              {topCompanies.map((item) => (
                <Link
                  key={item.id}
                  href={`/firma/${item.id}`}
                  className="px-3 py-2 bg-slate-100 text-slate-700 rounded-md hover:bg-slate-200 transition-colors text-sm"
                >
                  {item.brand}
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
