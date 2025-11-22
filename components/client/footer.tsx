import Link from 'next/link'
import { Facebook, Instagram, Phone, Mail, MapPin } from 'lucide-react'

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          {/* À propos */}
          <div className="space-y-4">
            <h3 className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              anasCB
            </h3>
            <p className="text-sm text-muted-foreground">
              Votre boutique de vêtements féminins tendance à Rabat, Maroc. 
              Qualité, style et élégance pour toutes les occasions.
            </p>
          </div>

          {/* Navigation */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Navigation</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/boutique" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Boutique
                </Link>
              </li>
              <li>
                <Link 
                  href="/a-propos" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  À propos
                </Link>
              </li>
              <li>
                <Link 
                  href="/contact" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Informations légales */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Informations</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link 
                  href="/politique-confidentialite" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link 
                  href="/conditions-utilisation" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link 
                  href="/politique-retour" 
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  Politique de retour
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="text-sm font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center space-x-2 text-muted-foreground">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>Rabat, Maroc</span>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Phone className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="tel:+212600000000" 
                  className="hover:text-primary transition-colors"
                >
                  +212 6 00 00 00 00
                </a>
              </li>
              <li className="flex items-center space-x-2 text-muted-foreground">
                <Mail className="h-4 w-4 flex-shrink-0" />
                <a 
                  href="mailto:contact@anascb.ma" 
                  className="hover:text-primary transition-colors"
                >
                  contact@anascb.ma
                </a>
              </li>
            </ul>

            {/* Réseaux sociaux */}
            <div className="flex space-x-4 pt-2">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </a>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} anasCB. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  )
}
