/**
 * Composant Header / Barre de navigation
 * Affiche le logo, les liens de navigation et les actions utilisateur
 */
import { useState } from 'react';
import Link from 'next/link';
import { FiMenu, FiX, FiPhone } from 'react-icons/fi';

export default function Header() {
  const [menuOuvert, setMenuOuvert] = useState(false);

  const liens = [
    { href: '/cours', label: 'Trouver un cours' },
    { href: '/tuteurs', label: 'Nos tuteurs' },
    { href: '/bourses', label: 'Bourses' },
    { href: '/a-propos', label: 'À propos' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50 transition-shadow duration-300">
      {/* Barre de recrutement — visible en haut */}
      <div className="bg-gradient-to-r from-primary-700 to-primary-600 text-white text-xs md:text-sm py-2 px-4 flex items-center justify-between">
        <span className="font-medium">Vous êtes étudiant ou diplômé ? Rejoignez nos tuteurs !</span>
        <div className="flex items-center gap-4">
          <a
            href="tel:+221338001234"
            className="flex items-center gap-1 hover:text-accent-300 transition-colors font-semibold"
          >
            <FiPhone size={13} />
            +221 33 800 12 34
          </a>
          <Link
            href="/devenir-tuteur"
            className="bg-accent-500 hover:bg-accent-400 text-white font-bold px-3 py-1 rounded-full text-xs transition-all duration-200 shadow"
          >
            Devenir Tuteur
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-4 flex items-center justify-between">
        
        {/* Logo - Design amélioré */}
        <Link href="/" className="flex items-center gap-2 group">
          <div className="flex items-center gap-1">
            <span className="font-poppins text-2xl md:text-3xl font-bold">
              <span className="bg-gradient-to-br from-primary-600 to-primary-700 bg-clip-text text-transparent">
                Edu
              </span>
              <span className="bg-gradient-to-br from-accent-700 to-accent-800 bg-clip-text text-transparent">
                Kaay
              </span>
            </span>
          </div>
          <span className="hidden md:block text-xs font-inter text-neutral-700 group-hover:text-primary-600 transition-colors duration-200">
            Plateforme de Tutorat
          </span>
        </Link>

        {/* Navigation desktop - Liens avec hover effect */}
        <nav className="hidden md:flex items-center gap-8">
          {liens.map((lien) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="font-inter text-neutral-700 font-medium
                         hover:text-primary-600 transition-colors duration-200
                         relative group"
            >
              {lien.label}
              {/* Underline animation au hover */}
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-600 to-accent-500
                               group-hover:w-full transition-all duration-300"></span>
            </Link>
          ))}
        </nav>

        {/* Actions - Boutons avec meilleur espacement */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/devenir-tuteur"
            className="py-2 px-4 font-poppins font-bold text-white
                       bg-gradient-to-br from-accent-500 to-accent-600
                       rounded-lg shadow
                       hover:shadow-md hover:from-accent-400 hover:to-accent-500
                       active:scale-95 transition-all duration-200
                       text-sm flex items-center gap-1"
          >
            Devenir Tuteur
          </Link>
          <Link
            href="/connexion"
            className="py-2.5 px-5 font-poppins font-medium text-neutral-900
                       border-2 border-primary-600 rounded-lg
                       hover:bg-primary-50 hover:border-primary-700
                       transition-all duration-200
                       text-sm"
          >
            Connexion
          </Link>
          <Link
            href="/inscription"
            className="py-2.5 px-5 font-poppins font-medium text-white
                       bg-gradient-to-br from-primary-600 to-primary-700
                       rounded-lg shadow-md
                       hover:shadow-lg hover:from-primary-500 hover:to-primary-600
                       active:scale-95
                       transition-all duration-200
                       text-sm"
          >
            S&apos;inscrire
          </Link>
        </div>

        {/* Menu mobile toggle - Icône améliorée */}
        <button
          className="md:hidden p-2 rounded-lg text-neutral-700
                     hover:bg-neutral-100 transition-colors duration-200
                     focus:outline-none focus:ring-2 focus:ring-primary-500"
          onClick={() => setMenuOuvert(!menuOuvert)}
          aria-label="Menu"
          aria-expanded={menuOuvert}
        >
          {menuOuvert ? (
            <FiX size={24} className="transition-transform duration-200" />
          ) : (
            <FiMenu size={24} className="transition-transform duration-200" />
          )}
        </button>
      </div>

      {/* Menu mobile déroulant - Avec animation fluide */}
      <div
        className={`md:hidden bg-white border-t border-neutral-200 transition-all duration-300 overflow-hidden
                     ${menuOuvert ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-4 md:px-8 py-4 space-y-3">
          {liens.map((lien, index) => (
            <Link
              key={lien.href}
              href={lien.href}
              className="block py-3 px-4 font-inter font-medium text-neutral-700
                         hover:text-primary-600 hover:bg-primary-50
                         rounded-lg transition-all duration-200
                         animate-fadeInUp"
              style={{ animationDelay: `${index * 50}ms` }}
              onClick={() => setMenuOuvert(false)}
            >
              {lien.label}
            </Link>
          ))}
          
          {/* Boutons mobile */}
          <div className="pt-4 border-t border-neutral-200 space-y-2">
            <Link
              href="/devenir-tuteur"
              className="block py-3 px-4 text-center font-poppins font-bold text-white
                         bg-gradient-to-br from-accent-500 to-accent-600
                         rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
              onClick={() => setMenuOuvert(false)}
            >
              Devenir Tuteur
            </Link>
            <Link
              href="/connexion"
              className="block py-3 px-4 text-center font-poppins font-medium text-neutral-900
                         border-2 border-primary-600 rounded-lg
                         hover:bg-primary-50 transition-all duration-200"
              onClick={() => setMenuOuvert(false)}
            >
              Connexion
            </Link>
            <Link
              href="/inscription"
              className="block py-3 px-4 text-center font-poppins font-medium text-white
                         bg-gradient-to-br from-primary-600 to-primary-700
                         rounded-lg shadow-md
                         hover:shadow-lg transition-all duration-200"
              onClick={() => setMenuOuvert(false)}
            >
              S&apos;inscrire
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
