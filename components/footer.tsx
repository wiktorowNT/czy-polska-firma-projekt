import { Mail, Github, Twitter, Linkedin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-4 gap-8 mb-12">
          {/* O projekcie */}
          <div>
            <h3 className="font-semibold mb-4">O projekcie</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  O nas
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Misja
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Zespół
                </a>
              </li>
            </ul>
          </div>

          {/* Metodologia */}
          <div>
            <h3 className="font-semibold mb-4">Metodologia</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Kryteria oceny
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Źródła danych
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Aktualizacje
                </a>
              </li>
            </ul>
          </div>

          {/* Kategorie */}
          <div>
            <h3 className="font-semibold mb-4">Kategorie</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Spożywcze
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  RTV/AGD
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Moda
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Wszystkie
                </a>
              </li>
            </ul>
          </div>

          {/* Kontakt */}
          <div>
            <h3 className="font-semibold mb-4">Kontakt</h3>
            <ul className="space-y-2 text-slate-300">
              <li>
                <a href="mailto:kontakt@czypolskafirma.pl" className="hover:text-white transition-colors">
                  kontakt@czypolskafirma.pl
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Polityka prywatności
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Regulamin
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Social Media */}
        <div className="flex justify-center space-x-6 mb-8">
          <a href="#" className="text-slate-400 hover:text-white transition-colors">
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">
            <Linkedin className="h-6 w-6" />
          </a>
          <a href="#" className="text-slate-400 hover:text-white transition-colors">
            <Github className="h-6 w-6" />
          </a>
          <a href="mailto:kontakt@czypolskafirma.pl" className="text-slate-400 hover:text-white transition-colors">
            <Mail className="h-6 w-6" />
          </a>
        </div>

        {/* Newsletter Signup */}
        <div id="newsletter" className="bg-slate-800 rounded-lg p-8 mb-8">
          <div className="text-center mb-6">
            <h3 className="text-xl font-semibold mb-2">Dołącz do listy oczekujących</h3>
            <p className="text-slate-300">Bądź pierwszym, który dowie się o uruchomieniu serwisu</p>
          </div>
          <form className="max-w-md mx-auto">
            <div className="flex gap-3">
              <input
                type="email"
                placeholder="Twój e-mail"
                className="flex-1 px-4 py-2 rounded-lg bg-slate-700 border border-slate-600 text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
              <button
                type="submit"
                className="px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors"
              >
                Zapisz mnie
              </button>
            </div>
          </form>
        </div>

        <div className="border-t border-slate-700 pt-8">
          <div className="text-center text-slate-400 text-sm space-y-4">
            <div className="bg-slate-800 rounded-lg p-6 text-left max-w-4xl mx-auto">
              <h4 className="font-semibold text-slate-200 mb-3">Ważne informacje prawne</h4>
              <div className="space-y-3 text-xs leading-relaxed">
                <p>
                  <strong>Charakter serwisu:</strong> Serwis ma charakter wyłącznie informacyjny i edukacyjny. Nie
                  stanowi porady prawnej, finansowej ani inwestycyjnej. Wszystkie informacje prezentowane w serwisie
                  służą wyłącznie celom informacyjnym.
                </p>
                <p>
                  <strong>Dane demonstracyjne:</strong> Obecnie prezentowane dane mają charakter demonstracyjny i nie
                  odzwierciedlają rzeczywistych informacji o firmach. Rzeczywiste dane będą dostępne po oficjalnym
                  uruchomieniu serwisu.
                </p>
                <p>
                  <strong>Prawa autorskie i znaki towarowe:</strong> Wszystkie prezentowane logo, znaki towarowe i nazwy
                  firm są własnością ich prawnych właścicieli. Wykorzystujemy je wyłącznie w celach informacyjnych na
                  podstawie dozwolonego użytku. Jeśli jesteś właścicielem praw do logo lub znaku towarowego i chcesz je
                  usunąć, skontaktuj się z nami.
                </p>
                <p>
                  <strong>Dokładność danych:</strong> Dokładamy wszelkich starań, aby prezentowane informacje były
                  aktualne i dokładne, jednak nie gwarantujemy ich kompletności ani bezbłędności. Dane mogą ulegać
                  zmianie bez wcześniejszego powiadomienia.
                </p>
                <p>
                  <strong>Odpowiedzialność:</strong> Nie ponosimy odpowiedzialności za decyzje podjęte na podstawie
                  informacji zawartych w serwisie. Użytkownicy korzystają z serwisu na własną odpowiedzialność.
                </p>
                <p>
                  <strong>Źródła:</strong> Wszystkie informacje pochodzą z publicznie dostępnych źródeł. Podajemy daty
                  ostatniej weryfikacji i linki do źródeł danych tam, gdzie to możliwe.
                </p>
              </div>
            </div>
            <p className="pt-4">© 2024 CzyPolskaFirma. Wszystkie prawa zastrzeżone.</p>
          </div>
        </div>
      </div>
    </footer>
  )
}
