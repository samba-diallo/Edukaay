/**
 * Composant Footer - Design amélioré
 * Pied de page avec liens utiles et informations légales
 */
import Link from 'next/link';
import { FiFacebook, FiTwitter, FiLinkedin, FiInstagram } from 'react-icons/fi';

export default function Footer() {
  const anneeActuelle = new Date().getFullYear();

  const colonnes = [
    {
      titre: 'Navigation',
      liens: [
        { label: 'Trouver un cours', href: '/cours' },
        { label: 'Devenir tuteur', href: '/inscription?role=tuteur' },
        { label: 'Programme de bourses', href: '/bourses' },
      ]
    },
    {
      titre: 'Support',
      liens: [
        { label: 'Centre d\'aide', href: '/aide' },
        { label: 'Nous contacter', href: '/contact' },
        { label: 'FAQ', href: '/faq' },
      ]
    },
    {
      titre: 'Légal',
      liens: [
        { label: 'Conditions d\'utilisation', href: '/cgu' },
        { label: 'Politique de confidentialité', href: '/confidentialite' },
        { label: 'Mentions légales', href: '/mentions-legales' },
      ]
    }
  ];

  const reseaux = [
    { icone: FiFacebook, label: 'Facebook', href: 'https://facebook.com/edukaay' },
    { icone: FiTwitter, label: 'Twitter', href: 'https://twitter.com/edukaay' },
    { icone: FiLinkedin, label: 'LinkedIn', href: 'https://linkedin.com/company/edukaay' },
    { icone: FiInstagram, label: 'Instagram', href: 'https://instagram.com/edukaay' },
  ];

  return (
    <footer className="bg-gradient-to-b from-neutral-900 to-neutral-950 text-neutral-300 py-16 px-4 md:px-8 border-t-4 border-primary-600">
      <div className="max-w-7xl mx-auto">
        
        {/* Section principale du footer */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          {/* Logo et description */}
          <div className="lg:col-span-1">
            <Link href="/" className="group inline-block">
              <div className="flex items-center gap-2 mb-4">
                <span className="font-poppins text-2xl font-bold">
                  <span className="bg-gradient-to-r from-primary-300 to-primary-400 bg-clip-text text-transparent">
                    Edu
                  </span>
                  <span className="bg-gradient-to-r from-accent-200 to-accent-300 bg-clip-text text-transparent">
                    Kaay
                  </span>
                </span>
              </div>
            </Link>
            
            <p className="text-sm leading-relaxed text-neutral-300 mb-6">
              La marketplace de tutorat pour l&apos;Afrique de l&apos;Ouest.
              <br />
              <span className="text-primary-400 font-medium">
                Connecter les savoirs, créer des emplois.
              </span>
            </p>

            {/* Réseaux sociaux */}
            <div className="flex items-center gap-3">
              {reseaux.map((reseau) => {
                const Icon = reseau.icone;
                return (
                  <a
                    key={reseau.label}
                    href={reseau.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={reseau.label}
                    className="w-10 h-10 rounded-full bg-neutral-800 flex items-center justify-center
                             text-neutral-300 hover:text-accent-300 hover:bg-accent-500/20
                             transition-all duration-300 group-hover:scale-110"
                  >
                    <Icon size={18} />
                  </a>
                );
              })}
            </div>
          </div>

          {/* Colonnes de liens */}
          {colonnes.map((colonne, idx) => (
            <div key={idx} className="lg:col-span-1">
              <h4 className="font-poppins font-bold text-white mb-4 text-lg">
                {colonne.titre}
              </h4>
              <ul className="space-y-3">
                {colonne.liens.map((lien) => (
                  <li key={lien.href}>
                    <Link
                      href={lien.href}
                      className="text-neutral-300 hover:text-primary-400 font-inter text-sm
                               transition-colors duration-200
                               relative group"
                    >
                      {lien.label}
                      <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-primary-500 to-accent-500
                                     group-hover:w-full transition-all duration-300"></span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-neutral-700 mb-8"></div>

        {/* Bas du footer */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <p className="text-sm text-neutral-500 font-inter text-center md:text-left">
            &copy; {anneeActuelle} <span className="text-primary-400 font-semibold">EduKaay</span>. 
            Tous droits réservés.
            <br className="md:hidden" />
            <span className="hidden md:inline"> Fait avec passion au Sénégal.</span>
          </p>

          {/* Version */}
          <div className="text-xs text-neutral-600">
            Version <span className="font-mono text-primary-400">1.0.0</span>
          </div>
        </div>

        {/* Message de statut */}
        <div className="mt-8 pt-6 border-t border-neutral-800">
          <p className="text-xs text-neutral-600 text-center">
            EduKaay opere en Afrique de l&apos;Ouest | 
            {' '}
            <a href="/statut" className="text-primary-400 hover:text-primary-300 underline">
              Statut des services
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
