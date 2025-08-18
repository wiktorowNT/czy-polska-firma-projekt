"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  CheckCircle,
  Building,
  CreditCard,
  Factory,
  ShoppingCart,
  Tv,
  Shirt,
  Sparkles,
  Banknote,
  Hammer,
} from "lucide-react"
import Link from "next/link"
import { CompanySearch } from "@/components/company-search"
import { CompanyLogo } from "@/components/company-logo"

export function Hero() {
  const [showDemo, setShowDemo] = useState(false)

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
  }

  const getIndexColor = (value: number) => {
    if (value >= 70) return "bg-green-500"
    if (value >= 40) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getIndexColorText = (value: number) => {
    if (value >= 70) return "text-green-600"
    if (value >= 40) return "text-yellow-600"
    return "text-red-600"
  }

  const categoriesData = [
    {
      title: "Sklepy spożywcze",
      icon: ShoppingCart,
      description: "Sieci handlowe i sklepy spożywcze",
      link: "/kategoria/sklepy-spozywcze",
      companies: [
        {
          id: "dino",
          name: "Dino",
          company: "Dino Polska S.A.",
          index: 84,
          badges: [">50% kapitału PL", "CIT w PL: tak"],
          logoUrl: "/logos/dino.png",
          brandColor: "#147D3F",
        },
        {
          id: "polomarket",
          name: "POLOmarket",
          company: "POLOmarket S.A.",
          index: 78,
          badges: ["Siedziba w PL"],
          logoUrl: "/logos/polomarket.png",
          brandColor: "#DC2626",
        },
        {
          id: "topaz",
          name: "Topaz",
          company: "PHU Topaz",
          index: 76,
          badges: ["Zatrudnia w PL"],
          logoUrl: "/logos/topaz.png",
          brandColor: "#F59E0B",
        },
      ],
    },
    {
      title: "RTV/AGD",
      icon: Tv,
      description: "Elektronika i sprzęt AGD",
      link: "/kategoria/rtv-agd",
      companies: [
        {
          id: "rtv-euro-agd",
          name: "RTV EURO AGD",
          company: "EURO‑NET sp. z o.o.",
          index: 80,
          badges: [">50% kapitału PL"],
        },
        {
          id: "media-expert",
          name: "Media Expert",
          company: "TERG S.A.",
          index: 82,
          badges: ["Zatrudnia w PL"],
        },
        {
          id: "x-kom",
          name: "x‑kom",
          company: "x‑kom sp. z o.o.",
          index: 74,
          badges: ["R&D w PL"],
        },
      ],
    },
    {
      title: "Moda",
      icon: Shirt,
      description: "Odzież i akcesoria",
      link: "/kategoria/moda",
      companies: [
        {
          id: "4f",
          name: "4F",
          company: "OTCF S.A.",
          index: 86,
          badges: ["R&D w PL"],
        },
        {
          id: "reserved",
          name: "Reserved",
          company: "LPP S.A.",
          index: 72,
          badges: ["Marka z PL", "Siedziba w PL"],
        },
        {
          id: "house",
          name: "House",
          company: "LPP S.A.",
          index: 70,
          badges: ["Marka z PL"],
        },
      ],
    },
    {
      title: "Chemia i kosmetyki",
      icon: Sparkles,
      description: "Marki kosmetyczne i chemia gospodarcza",
      link: "/kategoria/chemia-i-kosmetyki",
      companies: [
        {
          id: "ziaja",
          name: "Ziaja",
          company: "Ziaja Ltd. sp. z o.o.",
          index: 90,
          badges: ["Produkcja: częściowo w PL", "R&D w PL"],
        },
        {
          id: "bielenda",
          name: "Bielenda",
          company: "Bielenda Sp. z o.o.",
          index: 82,
          badges: ["R&D w PL"],
        },
        {
          id: "aa",
          name: "AA",
          company: "Oceanic S.A.",
          index: 78,
          badges: ["Siedziba w PL"],
        },
      ],
    },
    {
      title: "Banki i finanse",
      icon: Banknote,
      description: "Banki i usługi finansowe",
      link: "/kategoria/banki-i-finanse",
      companies: [
        {
          id: "pko-bp",
          name: "PKO Bank Polski",
          company: "PKO BP S.A.",
          index: 85,
          badges: ["CIT w PL: tak"],
        },
        {
          id: "pekao",
          name: "Bank Pekao",
          company: "Bank Pekao S.A.",
          index: 80,
          badges: ["Siedziba w PL"],
        },
        {
          id: "alior",
          name: "Alior Bank",
          company: "Alior Bank S.A.",
          index: 76,
          badges: ["Siedziba w PL"],
        },
      ],
    },
    {
      title: "Budowlane",
      icon: Hammer,
      description: "Materiały, markety i wyposażenie domu",
      link: "/kategoria/budowlane",
      companies: [
        {
          id: "psb-mrowka",
          name: "PSB Mrówka",
          company: "Grupa PSB S.A.",
          index: 84,
          badges: ["Sieć partnerska"],
        },
        {
          id: "castorama",
          name: "Castorama",
          company: "Castorama Polska",
          index: 40,
          badges: ["Zatrudnia w PL"],
        },
        {
          id: "leroy-merlin",
          name: "Leroy Merlin",
          company: "Leroy Merlin Polska",
          index: 38,
          badges: ["Zatrudnia w PL"],
        },
      ],
    },
  ]

  return (
    <section className="relative py-12 lg:py-16 bg-gradient-to-b from-white to-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Sprawdź, czy firma jest polska</h1>

          <p className="text-lg text-slate-600 mb-8">Indeks polskości na podstawie publicznych źródeł.</p>

          <div className="max-w-2xl mx-auto mb-8">
            <CompanySearch
              placeholder="Wpisz nazwę firmy lub marki…"
              showButton={true}
              onDemoSearch={() => setShowDemo(true)}
            />

            {/* Demo Result Card */}
            {showDemo && (
              <div className="bg-white rounded-lg shadow-lg p-6 border border-slate-200 text-left animate-in slide-in-from-top-4 duration-300 mt-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-xl font-semibold text-slate-900">Przykładowa Marka S.A.</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">72/100</div>
                    <div className="text-sm text-slate-500">Indeks polskości</div>
                  </div>
                </div>

                <div className="w-full bg-slate-200 rounded-full h-3 mb-4">
                  <div className="bg-green-500 h-3 rounded-full" style={{ width: "72%" }}></div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-2 text-sm">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>&gt;50% kapitału PL</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-green-500" />
                    <span>Siedziba w PL</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <CreditCard className="h-4 w-4 text-green-500" />
                    <span>CIT w PL: tak</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Factory className="h-4 w-4 text-yellow-500" />
                    <span>Produkcja: częściowo</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
            <Button
              onClick={() => scrollToSection("newsletter")}
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3"
            >
              Dołącz do listy oczekujących
            </Button>
            <Button
              onClick={() => scrollToSection("polish-index")}
              variant="outline"
              className="px-6 py-3 border-slate-300 hover:bg-slate-50"
            >
              Jak liczymy indeks
            </Button>
          </div>

          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-6">
              <h2 className="text-xl font-semibold text-slate-900 mb-2">Wybrane kategorie</h2>
              <p className="text-sm text-slate-500">Wartości demonstracyjne — nie są danymi rzeczywistymi.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categoriesData.map((category, index) => {
                const IconComponent = category.icon
                return (
                  <section key={index} className="bg-white rounded-lg shadow-sm border border-slate-200 p-6">
                    <Link href={category.link} className="block">
                      <div className="flex items-center gap-3 mb-3 hover:text-red-600 transition-colors">
                        <IconComponent className="h-5 w-5 text-slate-600" />
                        <h3 className="font-semibold text-slate-900">{category.title}</h3>
                      </div>
                    </Link>
                    <p className="text-sm text-slate-600 mb-4">{category.description}</p>

                    <ul className="space-y-3 mb-4">
                      {category.companies.map((company, companyIndex) => (
                        <li key={companyIndex} className="border-b border-slate-100 pb-3 last:border-b-0">
                          <Link
                            href={`/firma/${company.id}`}
                            className="block hover:bg-slate-50 rounded-md p-2 -m-2 transition-colors"
                          >
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-2">
                                <CompanyLogo
                                  id={company.id}
                                  brandName={company.name}
                                  logoUrl={company.logoUrl}
                                  brandColor={company.brandColor}
                                  size={24}
                                  rounded={4}
                                  priority={index < 3}
                                />
                                <div>
                                  <div className="font-medium text-slate-900 text-sm">{company.name}</div>
                                  <div className="text-xs text-slate-500">({company.company})</div>
                                </div>
                              </div>
                              <div className={`text-sm font-semibold ${getIndexColorText(company.index)}`}>
                                {company.index}/100
                              </div>
                            </div>

                            <div className="w-full bg-slate-200 rounded-full h-2 mb-2">
                              <div
                                className={`h-2 rounded-full ${getIndexColor(company.index)}`}
                                style={{ width: `${company.index}%` }}
                                aria-label={`Indeks polskości ${company.name}: ${company.index} na 100`}
                              ></div>
                            </div>

                            <div className="flex flex-wrap gap-1">
                              {company.badges.slice(0, 2).map((badge, badgeIndex) => (
                                <span
                                  key={badgeIndex}
                                  className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded"
                                >
                                  {badge}
                                </span>
                              ))}
                            </div>
                          </Link>
                        </li>
                      ))}
                    </ul>

                    <Link href={category.link} className="text-sm text-red-600 hover:text-red-700 font-medium">
                      Zobacz więcej →
                    </Link>
                  </section>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
