/**
 * Composant Carte de fonctionnalité - Design amélioré
 * Affiche une icône, un titre et une description avec animations
 */
export default function FeatureCard({ icone, titre, description }) {
  return (
    <div className="group card text-center flex flex-col items-center
                    hover:border-primary-200 hover:bg-gradient-to-br hover:from-primary-50 hover:to-transparent">
      
      {/* Icône avec background circulaire animé */}
      <div className="relative mb-6">
        <div className="absolute inset-0 w-16 h-16 bg-gradient-to-br from-primary-100 to-accent-50
                        rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300
                        blur-md"></div>
        
        <div className="relative w-16 h-16 flex items-center justify-center
                        bg-gradient-to-br from-primary-50 to-accent-50
                        rounded-2xl border border-primary-100
                        text-primary-600 text-3xl
                        group-hover:scale-110 group-hover:shadow-lg
                        transition-all duration-300">
          {icone}
        </div>
      </div>
      
      {/* Titre avec texte gradient au hover */}
      <h3 className="font-poppins font-bold text-lg mb-3 text-neutral-900
                     group-hover:bg-gradient-to-r group-hover:from-primary-600 group-hover:to-accent-600
                     group-hover:bg-clip-text group-hover:text-transparent
                     transition-all duration-300 line-clamp-2">
        {titre}
      </h3>
      
      {/* Description avec animation */}
      <p className="text-neutral-700 text-sm leading-relaxed
                    group-hover:text-neutral-800 transition-colors duration-300
                    line-clamp-3">
        {description}
      </p>
    </div>
  );
}
