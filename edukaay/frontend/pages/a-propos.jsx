import React from 'react';
import { FiTarget, FiHeart, FiAward, FiGlobe, FiUsers, FiTrendingUp } from 'react-icons/fi';

export default function APropos() {
  const valeurs = [
    {
      icon: FiTarget,
      titre: 'Notre Mission',
      description: 'Démocratiser l\'accès à l\'éducation de qualité en Afrique de l\'Ouest en connectant étudiants et tuteurs qualifiés.',
    },
    {
      icon: FiHeart,
      titre: 'Nos Valeurs',
      description: 'Intégrité, excellence pédagogique, inclusivité et impact social sont au cœur de chaque action.',
    },
    {
      icon: FiGlobe,
      titre: 'Notre Vision',
      description: 'Créer une plateforme éducative panafricaine qui transforme des vies par le savoir et l\'opportunité.',
    },
  ];

  const chiffres = [
    { nombre: '5000+', label: 'Étudiants actifs' },
    { nombre: '500+', label: 'Tuteurs qualifiés' },
    { nombre: '98%', label: 'Taux de satisfaction' },
    { nombre: '50+', label: 'Villes couvertes' },
  ];

  const equipe = [
    {
      nom: 'Fatou Bah',
      poste: 'Fondatrice & PDG',
      bio: 'Éducatrice passionnée avec 15 ans d\'expérience',
      image: 'https://i.pravatar.cc/150?img=10',
    },
    {
      nom: 'Kwame Osei',
      poste: 'CTO',
      bio: 'Ingénieur fintech avec expertise edtech',
      image: 'https://i.pravatar.cc/150?img=11',
    },
    {
      nom: 'Aïssatou Diallo',
      poste: 'COO',
      bio: 'Responsable opérationnel et relations client',
      image: 'https://i.pravatar.cc/150?img=12',
    },
    {
      nom: 'Yacine Ba',
      poste: 'Directeur Pédagogique',
      bio: 'Curriculum expert et qualité d\'enseignement',
      image: 'https://i.pravatar.cc/150?img=13',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-neutral-50 to-neutral-100">
        {/* Section Hero */}
        <div className="bg-gradient-to-br from-primary-600 via-primary-700 to-primary-800 text-white py-20 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-poppins font-bold mb-6">À Propos d'EduKaay</h1>
            <p className="text-xl text-white font-medium leading-relaxed">
              EduKaay est une plateforme éducative innovante qui connecte étudiants et tuteurs qualifiés
              pour transformer l'éducation en Afrique de l'Ouest.
            </p>
          </div>
        </div>

        {/* Section Mission, Valeurs, Vision */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            {valeurs.map((valeur, index) => {
              const IconComponent = valeur.icon;
              return (
                <div
                  key={index}
                  className="card-interactive bg-white text-center"
                >
                  <div className="mb-4 flex justify-center">
                    <div className="p-4 rounded-full bg-gradient-to-br from-primary-100 to-primary-200">
                      <IconComponent className="text-3xl text-primary-600" />
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-neutral-900 mb-3">
                    {valeur.titre}
                  </h3>
                  <p className="text-neutral-700 leading-relaxed">
                    {valeur.description}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Chiffres clés */}
          <div className="bg-gradient-to-r from-primary-600 to-primary-700 rounded-2xl text-white py-16 px-8 mb-20">
            <h2 className="text-3xl font-bold text-center mb-12">Nos Chiffres</h2>
            <div className="grid md:grid-cols-4 gap-8">
              {chiffres.map((chiffre, index) => (
                <div key={index} className="text-center">
                  <p className="text-4xl font-bold mb-2">{chiffre.nombre}</p>
                  <p className="text-primary-100">{chiffre.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Historique */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Notre Histoire</h2>
            <div className="card bg-white p-8">
              <div className="space-y-6 text-neutral-700 leading-relaxed">
                <p>
                  EduKaay a été fondée en 2020 par Fatou Bah, une éducatrice passionnée originaire de Dakar,
                  qui voyait le potentiel inexploité de l'éducation numérique en Afrique de l'Ouest.
                </p>
                <p>
                  Partant du constat que des milliers d'étudiants talentueux manquaient d'accès à des tuteurs qualifiés
                  et que de nombreux tuteurs ne pouvaient pas monétiser leurs compétences, elle a créé une plateforme
                  pour résoudre ces deux problèmes simultanément.
                </p>
                <p>
                  En trois ans, EduKaay a grandi pour servir plus de 5000 étudiants dans 50 villes à travers
                  la Guinée, le Mali, le Sénégal, la Côte d'Ivoire et le Burkina Faso.
                </p>
              </div>
            </div>
          </div>

          {/* Équipe */}
          <div className="mb-20">
            <h2 className="text-3xl font-bold text-neutral-900 mb-12 text-center">L'Équipe</h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {equipe.map((membre, index) => (
                <div
                  key={index}
                  className="card-interactive bg-white text-center"
                >
                  <div className="mb-4">
                    <img
                      src={membre.image}
                      alt={membre.nom}
                      className="w-24 h-24 rounded-full mx-auto border-4 border-primary-100"
                    />
                  </div>
                  <h3 className="text-lg font-bold text-neutral-900 mb-1">
                    {membre.nom}
                  </h3>
                  <p className="text-sm font-semibold text-primary-600 mb-2">
                    {membre.poste}
                  </p>
                  <p className="text-sm text-neutral-700">
                    {membre.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Partenaires & Prix */}
          <div className="grid md:grid-cols-2 gap-8 mb-20">
            <div className="card bg-white p-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <FiAward className="text-accent-600" />
                Distinctions
              </h3>
              <ul className="space-y-3 text-neutral-700">
                <li>Meilleure Startup EdTech 2022 - West Africa Innovation Awards</li>
                <li>Impact Award - UNESCO Digital Learning Initiative</li>
                <li>Top 10 EdTech Companies - TechCrunch Africa</li>
              </ul>
            </div>

            <div className="card bg-white p-8">
              <h3 className="text-2xl font-bold text-neutral-900 mb-4 flex items-center gap-2">
                <FiUsers className="text-primary-600" />
                Impact Social
              </h3>
              <ul className="space-y-3 text-neutral-700">
                <li>10 000+ heures de tutorat fournies</li>
                <li>Programme de bourses pour 500+ etudiants</li>
                <li>Formation de 200+ tuteurs en methodologie pedagogique</li>
              </ul>
            </div>
          </div>

          {/* CTA */}
          <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-2xl p-12 text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-900 mb-4">
              Envie de nous rejoindre?
            </h2>
            <p className="text-neutral-800 mb-8 max-w-2xl mx-auto">
              Que tu sois étudiant cherchant un tuteur ou tuteur souhaitant partager tes connaissances,
              EduKaay t'offre les outils et la communauté pour réussir.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">Trouver un Tuteur</button>
              <button className="btn-outline">Devenir Tuteur</button>
            </div>
          </div>
        </div>

        {/* Section FAQ */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h2 className="text-3xl font-bold text-neutral-900 mb-8 text-center">Questions Fréquentes</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Comment fonctionnent les sessions de tutorat?',
                r: 'Les sessions se déroulent en ligne via vidéoconférence. Vous pouvez réserver en fonction de votre emploi du temps et celui du tuteur.',
              },
              {
                q: 'Comment suis-je assuré de la qualité des tuteurs?',
                r: 'Tous nos tuteurs sont vérifiés et évalués. Nous maintenons une note minimale de 4.5/5.',
              },
              {
                q: 'Quels sont les moyens de paiement?',
                r: 'Nous acceptons Orange Money, Wave, MTN MoMo et virement bancaire.',
              },
            ].map((faq, index) => (
              <div key={index} className="card bg-white p-6">
                <h3 className="font-bold text-neutral-900 mb-2">{faq.q}</h3>
                <p className="text-neutral-700">{faq.r}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
  );
}
