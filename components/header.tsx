"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, X, ChevronDown, ShoppingCart, Tv, Shirt, Sparkles, Building, Hammer } from "lucide-react"
import Link from "next/link"

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false)
  const categoriesRef = useRef<HTMLDivElement>(null)
  const categoriesButtonRef = useRef<HTMLButtonElement>(null)
  const pathname = usePathname()
  const router = useRouter()

  const scrollToSection = (id: string) => {
    if (pathname === "/") {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth" })
    } else {
      window.location.href = `/#${id}`
    }
    setIsMenuOpen(false)
  }

  const handleLogoClick = () => {
    if (pathname === "/") {
      window.scrollTo({ top: 0, behavior: "smooth" })
    } else {
      router.push("/")
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoriesRef.current && !categoriesRef.current.contains(event.target as Node)) {
        setIsCategoriesOpen(false)
      }
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsCategoriesOpen(false)
        categoriesButtonRef.current?.focus()
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", handleKeyDown)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", handleKeyDown)
    }
  }, [])

  const handleCategoriesKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault()
      setIsCategoriesOpen(!isCategoriesOpen)
    }
  }

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <div
              onClick={handleLogoClick}
              className="cursor-pointer"
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault()
                  handleLogoClick()
                }
              }}
              aria-label="Przejdź do strony głównej"
            >
              <h1 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-2xl">🇵🇱</span>
                CzyPolskaFirma
              </h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-8">
              <div className="relative" ref={categoriesRef}>
                <button
                  ref={categoriesButtonRef}
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  onMouseEnter={() => setIsCategoriesOpen(true)}
                  onKeyDown={handleCategoriesKeyDown}
                  className="flex items-center gap-1 text-slate-600 hover:text-slate-900 transition-colors"
                  aria-haspopup="menu"
                  aria-expanded={isCategoriesOpen}
                >
                  Kategorie
                  <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`} />
                </button>

                {isCategoriesOpen && (
                  <div
                    className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-slate-200 p-4"
                    role="menu"
                    onMouseLeave={() => setIsCategoriesOpen(false)}
                  >
                    <div className="grid grid-cols-1 gap-3">
                      <Link
                        href="/kategoria/sklepy-spozywcze"
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <ShoppingCart className="h-5 w-5 text-green-600" />
                        <div>
                          <div className="font-medium text-slate-900">Sklepy spożywcze</div>
                          <div className="text-sm text-slate-500">Sieci handlowe i sklepy</div>
                        </div>
                      </Link>
                      <Link
                        href="/kategoria/rtv-agd"
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <Tv className="h-5 w-5 text-blue-600" />
                        <div>
                          <div className="font-medium text-slate-900">RTV/AGD</div>
                          <div className="text-sm text-slate-500">Elektronika i sprzęt AGD</div>
                        </div>
                      </Link>
                      <Link
                        href="/kategoria/moda"
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <Shirt className="h-5 w-5 text-purple-600" />
                        <div>
                          <div className="font-medium text-slate-900">Moda</div>
                          <div className="text-sm text-slate-500">Odzież i akcesoria</div>
                        </div>
                      </Link>
                      <Link
                        href="/kategoria/chemia-i-kosmetyki"
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <Sparkles className="h-5 w-5 text-pink-600" />
                        <div>
                          <div className="font-medium text-slate-900">Chemia i kosmetyki</div>
                          <div className="text-sm text-slate-500">Kosmetyki i chemia</div>
                        </div>
                      </Link>
                      <Link
                        href="/kategoria/banki-i-finanse"
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <Building className="h-5 w-5 text-emerald-600" />
                        <div>
                          <div className="font-medium text-slate-900">Banki i finanse</div>
                          <div className="text-sm text-slate-500">Usługi finansowe</div>
                        </div>
                      </Link>
                      <Link
                        href="/kategoria/budowlane"
                        role="menuitem"
                        className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 transition-colors"
                        onClick={() => setIsCategoriesOpen(false)}
                      >
                        <Hammer className="h-5 w-5 text-orange-600" />
                        <div>
                          <div className="font-medium text-slate-900">Budowlane</div>
                          <div className="text-sm text-slate-500">Materiały i narzędzia</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Jak to działa
              </button>
              <button
                onClick={() => scrollToSection("methodology")}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Metodologia
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                Funkcje
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-slate-600 hover:text-slate-900 transition-colors"
              >
                FAQ
              </button>
            </nav>
          </div>

          {/* CTA Button */}
          <div className="hidden md:block">
            <Button onClick={() => scrollToSection("newsletter")} className="bg-red-600 hover:bg-red-700 text-white">
              Zostań beta testerem
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button variant="ghost" size="sm" onClick={() => setIsMenuOpen(!isMenuOpen)}>
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-slate-200">
            <div className="flex flex-col space-y-3">
              <button
                onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                className="text-left text-slate-600 hover:text-slate-900 transition-colors py-2 flex items-center justify-between"
              >
                Kategorie
                <ChevronDown className={`h-4 w-4 transition-transform ${isCategoriesOpen ? "rotate-180" : ""}`} />
              </button>

              {isCategoriesOpen && (
                <div className="pl-4 space-y-2">
                  <Link
                    href="/kategoria/sklepy-spozywcze"
                    className="block text-slate-500 hover:text-slate-700 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sklepy spożywcze
                  </Link>
                  <Link
                    href="/kategoria/rtv-agd"
                    className="block text-slate-500 hover:text-slate-700 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    RTV/AGD
                  </Link>
                  <Link
                    href="/kategoria/moda"
                    className="block text-slate-500 hover:text-slate-700 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Moda
                  </Link>
                  <Link
                    href="/kategoria/chemia-i-kosmetyki"
                    className="block text-slate-500 hover:text-slate-700 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Chemia i kosmetyki
                  </Link>
                  <Link
                    href="/kategoria/banki-i-finanse"
                    className="block text-slate-500 hover:text-slate-700 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Banki i finanse
                  </Link>
                  <Link
                    href="/kategoria/budowlane"
                    className="block text-slate-500 hover:text-slate-700 py-1"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Budowlane
                  </Link>
                </div>
              )}

              <button
                onClick={() => scrollToSection("how-it-works")}
                className="text-left text-slate-600 hover:text-slate-900 transition-colors py-2"
              >
                Jak to działa
              </button>
              <button
                onClick={() => scrollToSection("methodology")}
                className="text-left text-slate-600 hover:text-slate-900 transition-colors py-2"
              >
                Metodologia
              </button>
              <button
                onClick={() => scrollToSection("features")}
                className="text-left text-slate-600 hover:text-slate-900 transition-colors py-2"
              >
                Funkcje
              </button>
              <button
                onClick={() => scrollToSection("faq")}
                className="text-left text-slate-600 hover:text-slate-900 transition-colors py-2"
              >
                FAQ
              </button>
              <Button
                onClick={() => scrollToSection("newsletter")}
                className="bg-red-600 hover:bg-red-700 text-white mt-4"
              >
                Zostań beta testerem
              </Button>
            </div>
          </div>
        )}
      </div>
    </header>
  )
}
