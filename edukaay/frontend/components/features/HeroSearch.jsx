/**
 * Composant de recherche héro - Design amélioré
 * Barre de recherche principale avec animations fluides
 */
import { useState } from 'react';
import { useRouter } from 'next/router';
import { FiSearch } from 'react-icons/fi';

export default function HeroSearch() {
  const router = useRouter();
  const [recherche, setRecherche] = useState('');
  const [niveau, setNiveau] = useState('');
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (recherche) params.set('q', recherche);
    if (niveau) params.set('niveau', niveau);
    router.push(`/cours?${params.toString()}`);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
      <div className={`bg-white rounded-2xl p-2 flex flex-col md:flex-row gap-2
                       shadow-md transition-all duration-300
                       ${focused ? 'shadow-xl ring-2 ring-primary-200' : 'shadow-md'}`}>
        
        {/* Champ de recherche avec icône */}
        <div className="flex-1 relative flex items-center">
          <FiSearch className={`absolute left-4 text-neutral-400 transition-colors duration-200
                              ${focused ? 'text-primary-600' : 'text-neutral-400'}`}
          />
          <input
            type="text"
            placeholder="Quelle matière cherchez-vous ?"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            onFocus={() => setFocused(true)}
            onBlur={() => setFocused(false)}
            className="w-full py-4 pl-11 pr-4 rounded-xl
                       text-neutral-900 font-inter font-medium
                       bg-neutral-50 hover:bg-neutral-100
                       border border-transparent
                       focus:outline-none focus:bg-white
                       transition-all duration-200
                       placeholder-neutral-500"
          />
        </div>

        {/* Select niveau */}
        <select
          value={niveau}
          onChange={(e) => setNiveau(e.target.value)}
          className="py-4 px-5 rounded-xl text-neutral-700 font-inter font-medium
                     bg-neutral-50 hover:bg-neutral-100
                     border border-transparent hover:border-neutral-200
                     focus:outline-none focus:bg-white focus:ring-2 focus:ring-primary-500
                     transition-all duration-200
                     cursor-pointer"
        >
          <option value="">Tous niveaux</option>
          <option value="primaire">Primaire</option>
          <option value="college">Collège</option>
          <option value="lycee">Lycée</option>
          <option value="universite">Université</option>
        </select>

        {/* Bouton Rechercher avec gradient */}
        <button 
          type="submit"
          className="bg-gradient-to-br from-primary-600 to-primary-700
                     text-white font-poppins font-bold py-4 px-8
                     rounded-xl shadow-md
                     hover:shadow-lg hover:from-primary-500 hover:to-primary-600
                     active:scale-95
                     transition-all duration-300 ease-out
                     flex items-center justify-center gap-2
                     md:w-auto w-full
                     focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2"
        >
          <FiSearch size={20} />
          <span className="hidden md:inline">Rechercher</span>
          <span className="md:hidden">Go</span>
        </button>
      </div>

      {/* Suggestions texte */}
      <div className="mt-4 text-center">
        <p className="text-sm text-neutral-600 font-inter">
          Exemples : <span className="font-medium text-primary-600">Mathématiques</span>
          {' • '}
          <span className="font-medium text-primary-600">Français</span>
          {' • '}
          <span className="font-medium text-primary-600">Anglais</span>
        </p>
      </div>
    </form>
  );
}
