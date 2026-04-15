/**
 * Composant Carte de cours - Design amélioré
 * Affiche un résumé de cours avec tuteur, prix, notation et modalité
 */
import Link from 'next/link';
import { FiStar, FiMapPin, FiMonitor, FiVideo, FiArrowRight } from 'react-icons/fi';

export default function CourseCard({ cours }) {
  // Labels pour les modalités
  const modaliteLabel = {
    en_ligne: { label: 'En ligne', icon: FiVideo },
    domicile: { label: 'À domicile', icon: FiMapPin },
    les_deux: { label: 'Flexible', icon: FiMonitor },
  };

  const modalite = modaliteLabel[cours.modalite] || modaliteLabel.les_deux;
  const ModaliteIcon = modalite.icon;

  // Rang de note
  const noteRang = cours.noteMoyenne >= 4.5 ? 'excellent' : 
                   cours.noteMoyenne >= 4 ? 'tres-bon' :
                   cours.noteMoyenne >= 3 ? 'bon' : 'nouveau';

  return (
    <Link href={`/cours/${cours.id}`}>
      <div className="card-interactive group h-full flex flex-col">
        
        {/* En-tête avec badges */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex gap-2 flex-wrap">
            <span className="badge-primary text-xs font-semibold">
              {cours.matiere}
            </span>
            <span className="badge-accent text-xs font-semibold">
              {cours.niveau}
            </span>
          </div>
          
          {/* Badge de notation */}
          <div className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                          bg-yellow-50 border border-yellow-200">
            <FiStar size={14} className="text-yellow-600 fill-current" />
            <span className="text-sm font-semibold text-yellow-800">
              {cours.noteMoyenne?.toFixed(1) || 'N/A'}
            </span>
          </div>
        </div>

        {/* Titre du cours */}
        <h3 className="font-poppins font-bold text-lg mb-2 text-neutral-900
                       group-hover:text-primary-600 transition-colors duration-200
                       line-clamp-2">
          {cours.titre}
        </h3>

        {/* Description */}
        <p className="text-neutral-600 text-sm mb-4 line-clamp-2 leading-relaxed">
          {cours.description}
        </p>

        {/* Informations tuteur */}
        {cours.tuteur && (
          <div className="flex items-center gap-3 mb-4 pb-4 border-b border-neutral-100">
            {/* Avatar initiales */}
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-100 to-primary-50
                            flex items-center justify-center text-primary-700 font-bold text-sm
                            border border-primary-200">
              {cours.tuteur.prenom?.[0]?.toUpperCase()}
              {cours.tuteur.nom?.[0]?.toUpperCase()}
            </div>
            
            <div className="flex-1">
              <p className="font-medium text-sm text-neutral-900">
                {cours.tuteur.prenom} {cours.tuteur.nom}
              </p>
              {cours.tuteur.niveauEtude && (
                <p className="text-xs text-neutral-700">
                  {cours.tuteur.niveauEtude}
                </p>
              )}
            </div>
          </div>
        )}

        {/* Détails sectondaires */}
        <div className="flex items-center gap-4 text-sm text-neutral-700 mb-4">
          {/* Notation détaillée */}
          <div className="flex items-center gap-1">
            <FiStar size={14} className="text-neutral-600" />
            <span className="text-xs">
              {cours.nombreAvis || 0} avis
            </span>
          </div>
          
          {/* Localisation */}
          {cours.villeDisponible && (
            <div className="flex items-center gap-1">
              <FiMapPin size={14} className="text-neutral-600" />
              <span className="text-xs">{cours.villeDisponible}</span>
            </div>
          )}

          {/* Modalité */}
          <div className="flex items-center gap-1">
            <ModaliteIcon size={14} className="text-neutral-600" />
            <span className="text-xs">{modalite.label}</span>
          </div>
        </div>

        {/* Pied de carte - Prix et CTA */}
        <div className="mt-auto pt-4 border-t border-neutral-100 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-xs text-neutral-700 font-medium">Tarif horaire</span>
            <span className="font-poppins font-bold text-lg text-primary-600">
              {parseInt(cours.tarifHoraire || 0).toLocaleString('fr-FR')}
              <span className="text-xs font-normal text-neutral-700"> XOF</span>
            </span>
          </div>
          
          {/* Bouton CTA avec flèche */}
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg
                          bg-primary-50 text-primary-600 font-medium
                          group-hover:bg-primary-600 group-hover:text-white
                          transition-all duration-300">
            <span className="text-sm">Détails</span>
            <FiArrowRight size={16} className="transition-transform duration-300
                                              group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
