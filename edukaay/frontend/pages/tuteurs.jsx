import React, { useState } from 'react';
import { FiStar, FiUsers, FiTrendingUp, FiFilter } from 'react-icons/fi';

export default function Tuteurs() {
  const [filter, setFilter] = useState('tous');
  const [search, setSearch] = useState('');

  // Tuteurs de exemple
  const tuteurs = [
    {
      id: 1,
      nom: 'Aminata Diallo',
      matiere: 'Mathématiques',
      niveau: 'Secondaire & Supérieur',
      rating: 4.9,
      etudiants: 342,
      prix: '5000 FCFA/h',
      bio: 'Passionnée par l\'enseignement des mathématiques avec 8 ans d\'expérience',
      image: 'https://i.pravatar.cc/150?img=1',
      specialites: ['Algèbre', 'Géométrie', 'Calcul'],
    },
    {
      id: 2,
      nom: 'Moussa Traoré',
      matiere: 'Français',
      niveau: 'Primaire & Secondaire',
      rating: 4.8,
      etudiants: 298,
      prix: '3500 FCFA/h',
      bio: 'Expert en grammaire et littérature française moderne',
      image: 'https://i.pravatar.cc/150?img=2',
      specialites: ['Grammaire', 'Littérature', 'Rédaction'],
    },
    {
      id: 3,
      nom: 'Fatou Sow',
      matiere: 'Anglais',
      niveau: 'Tous niveaux',
      rating: 4.9,
      etudiants: 521,
      prix: '4000 FCFA/h',
      bio: 'Anglophone native avec certification TOEFL',
      image: 'https://i.pravatar.cc/150?img=3',
      specialites: ['Conversation', 'Grammaire', 'Business English'],
    },
    {
      id: 4,
      nom: 'Kofi Mensah',
      matiere: 'Sciences',
      niveau: 'Secondaire',
      rating: 4.7,
      etudiants: 187,
      prix: '4500 FCFA/h',
      bio: 'Ingénieur passionné par l\'enseignement scientifique',
      image: 'https://i.pravatar.cc/150?img=4',
      specialites: ['Physique', 'Chimie', 'Biologie'],
    },
    {
      id: 5,
      nom: 'Aïcha Sall',
      matiere: 'Histoire-Géographie',
      niveau: 'Tous niveaux',
      rating: 4.8,
      etudiants: 215,
      prix: '3500 FCFA/h',
      bio: 'Historienne et géographe avec passion pédagogique',
      image: 'https://i.pravatar.cc/150?img=5',
      specialites: ['Histoire', 'Géographie', 'Géopolitique'],
    },
    {
      id: 6,
      nom: 'Ibrahim Diop',
      matiere: 'Informatique',
      niveau: 'Secondaire & Supérieur',
      rating: 4.9,
      etudiants: 425,
      prix: '6000 FCFA/h',
      bio: 'Développeur et formateur en programmation',
      image: 'https://i.pravatar.cc/150?img=6',
      specialites: ['Python', 'Web Dev', 'Algorithmique'],
    },
  ];

  const matieres = ['tous', 'Mathématiques', 'Français', 'Anglais', 'Sciences', 'Informatique'];

  const tuteursFiltres = tuteurs.filter(tuteur => {
    const matchFilter = filter === 'tous' || tuteur.matiere === filter;
    const matchSearch = tuteur.nom.toLowerCase().includes(search.toLowerCase()) ||
                       tuteur.matiere.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Section Hero */}
        <div className="bg-gradient-to-br from-primary-600 to-primary-800 text-white py-16 px-4 sm:px-6 lg:px-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-poppins font-bold mb-4">Nos Tuteurs</h1>
            <p className="text-lg text-primary-100 max-w-2xl">
              Découvrez nos tuteurs qualifiés et expérimentés prêts à vous aider à réussir vos études.
            </p>
          </div>
        </div>

        {/* Section Filtrage et Recherche */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            {/* Statistiques */}
            <div className="card bg-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiUsers className="text-3xl text-primary-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-neutral-700">Tuteurs Actifs</p>
                  <p className="text-2xl font-bold text-neutral-900">{tuteurs.length}+</p>
                </div>
              </div>
            </div>

            <div className="card bg-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiTrendingUp className="text-3xl text-accent-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-neutral-700">Taux de Satisfaction</p>
                  <p className="text-2xl font-bold text-neutral-900">98%</p>
                </div>
              </div>
            </div>

            <div className="card bg-white">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <FiStar className="text-3xl text-yellow-500" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-neutral-700">Note Moyenne</p>
                  <p className="text-2xl font-bold text-neutral-900">4.8/5</p>
                </div>
              </div>
            </div>
          </div>

          {/* Barre de recherche */}
          <div className="mb-8">
            <input
              type="text"
              placeholder="Rechercher un tuteur ou une matière..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field"
            />
          </div>

          {/* Filtres par matière */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <FiFilter className="text-primary-600" />
              <span className="font-semibold text-neutral-900">Filtrer par matière:</span>
            </div>
            <div className="flex flex-wrap gap-3">
              {matieres.map(matiere => (
                <button
                  key={matiere}
                  onClick={() => setFilter(matiere)}
                  className={`px-4 py-2 rounded-lg font-medium transition-all duration-300 ${
                    filter === matiere
                      ? 'bg-primary-600 text-white shadow-md'
                      : 'bg-white text-neutral-700 border border-neutral-200 hover:border-primary-300'
                  }`}
                >
                  {matiere.charAt(0).toUpperCase() + matiere.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Grille de tuteurs */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tuteursFiltres.length > 0 ? (
              tuteursFiltres.map(tuteur => (
                <div
                  key={tuteur.id}
                  className="card-interactive bg-white overflow-hidden"
                >
                  {/* En-tête avec gradient */}
                  <div className="h-20 bg-gradient-to-r from-primary-500 to-primary-600"></div>

                  {/* Avatar */}
                  <div className="px-6 pb-6">
                    <div className="flex justify-center -mt-10 mb-4">
                      <img
                        src={tuteur.image}
                        alt={tuteur.nom}
                        className="w-20 h-20 rounded-full border-4 border-white shadow-md"
                      />
                    </div>

                    {/* Contenu */}
                    <h3 className="text-xl font-bold text-neutral-900 text-center mb-2">
                      {tuteur.nom}
                    </h3>
                    <p className="text-sm text-primary-600 font-semibold text-center mb-1">
                      {tuteur.matiere}
                    </p>
                    <p className="text-xs text-neutral-700 text-center mb-3">
                      {tuteur.niveau}
                    </p>

                    {/* Rating et statistiques */}
                    <div className="flex items-center justify-between bg-neutral-50 rounded-lg px-3 py-2 mb-4">
                      <div className="flex items-center gap-1">
                        <FiStar className="text-yellow-500 fill-current" />
                        <span className="font-bold text-neutral-900">{tuteur.rating}</span>
                      </div>
                      <div className="text-xs text-neutral-700">
                        {tuteur.etudiants} étudiants
                      </div>
                    </div>

                    {/* Bio */}
                    <p className="text-sm text-neutral-700 mb-3 line-clamp-2">
                      {tuteur.bio}
                    </p>

                    {/* Spécialités */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {tuteur.specialites.map(spec => (
                        <span
                          key={spec}
                          className="badge-primary text-xs"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>

                    {/* Prix et CTA */}
                    <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                      <span className="font-bold text-primary-600">{tuteur.prix}</span>
                      <button className="btn-primary py-2 px-4 text-sm">
                        Réserver
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-neutral-600 text-lg">
                  Aucun tuteur trouvé pour "{search}" dans la catégorie "{filter}"
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
  );
}
