import { ShoppingCart, Tv, Shirt, Beaker, CreditCard, Hammer } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Categories() {
  const categories = [
    {
      icon: ShoppingCart,
      title: "Sklepy spożywcze",
      description: "Sieci handlowe, produkty spożywcze",
    },
    {
      icon: Tv,
      title: "RTV/AGD",
      description: "Elektronika, sprzęt gospodarstwa domowego",
    },
    {
      icon: Shirt,
      title: "Moda",
      description: "Odzież, obuwie, akcesoria",
    },
    {
      icon: Beaker,
      title: "Chemia i kosmetyki",
      description: "Środki czystości, kosmetyki, higiena",
    },
    {
      icon: CreditCard,
      title: "Banki i finanse",
      description: "Banki, ubezpieczenia, fintech",
    },
    {
      icon: Hammer,
      title: "Budowlane",
      description: "Materiały budowlane, narzędzia",
    },
  ]

  return (
    <section id="categories" className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-bold text-slate-900 mb-4">Kategorie</h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <div
              key={index}
              className="bg-white rounded-lg p-6 shadow-sm border border-slate-200 hover:shadow-md transition-shadow"
            >
              <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg mb-4">
                <category.icon className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-2">{category.title}</h3>
              <p className="text-slate-600 mb-4">{category.description}</p>
              <Button
                variant="outline"
                size="sm"
                disabled
                className="w-full opacity-50 cursor-not-allowed bg-transparent"
                title="Wkrótce"
              >
                Zobacz polskie marki
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
