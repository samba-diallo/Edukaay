/**
 * Page d'accueil EduKaay
 * Présente la proposition de valeur et les fonctionnalités clés
 */
import Head from 'next/head';
import Link from 'next/link';
import { FiSearch, FiVideo, FiShield, FiDollarSign, FiPhone, FiBookOpen, FiUsers } from 'react-icons/fi';
import HeroSearch from '../components/features/HeroSearch';
import FeatureCard from '../components/ui/FeatureCard';

const fonctionnalites = [
  {
    icone: <FiSearch size={32} />,
    titre: 'Trouvez le tuteur idéal',
    description: 'Recherchez parmi des centaines de tuteurs qualifiés, filtrés par matière, niveau et localisation.',
  },
  {
    icone: <FiVideo size={32} />,
    titre: 'Cours en ligne ou à domicile',
    description: 'Choisissez entre des cours en visioconférence ou des séances à domicile dans votre ville.',
  },
  {
    icone: <FiShield size={32} />,
    titre: 'Tuteurs vérifiés',
    description: 'Tous nos tuteurs sont vérifiés et évalués par la communauté pour garantir la qualité.',
  },
  {
    icone: <FiDollarSign size={32} />,
    titre: 'Paiement Mobile Money',
    description: 'Payez facilement via Wave, Orange Money ou MTN MoMo. Simple, rapide, sécurisé.',
  },
];

export default function Accueil() {
  return (
    <>
      <Head>
        <title>EduKaay - Marketplace de Tutorat en Afrique</title>
        <meta
          name="description"
          content="Trouvez le tuteur idéal pour réussir vos études. Cours à domicile et en ligne au Sénégal. Paiement Mobile Money."
        />
      </Head>

      {/* Section Recrutement — HAUT DE PAGE */}
      <section className="bg-gradient-to-r from-accent-600 to-accent-500 text-white py-6 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-full">
              <FiUsers size={28} />
            </div>
            <div>
              <p className="font-poppins font-bold text-lg md:text-xl">
                Vous êtes étudiant ou diplômé ?
              </p>
              <p className="text-white/90 text-sm">
                Devenez tuteur et gagnez en partageant votre savoir
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <a
              href="tel:+221338001234"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 transition px-4 py-2 rounded-lg font-semibold text-sm"
            >
              <FiPhone size={16} />
              Appeler
            </a>
            <Link
              href="/devenir-tuteur"
              className="bg-white text-accent-700 hover:bg-white/90 font-bold px-6 py-2 rounded-lg text-sm transition-all duration-200 shadow-md"
            >
              Postuler maintenant
            </Link>
          </div>
        </div>
      </section>

      {/* Section Héro */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-poppins text-3xl md:text-5xl font-bold mb-4">
            Réussissez avec <span className="text-accent">EduKaay</span>
          </h1>
          <p className="text-lg md:text-xl mb-8 font-medium bg-white text-neutral-900 px-6 py-4 rounded-xl inline-block shadow-lg">
            La première marketplace de tutorat conçue pour l&apos;Afrique de l&apos;Ouest.
            Trouvez votre tuteur, réservez un cours, progressez.
          </p>
          <HeroSearch />
        </div>
      </section>

      {/* Section Fonctionnalités */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold text-center mb-12">
            Pourquoi choisir <span className="text-primary">EduKaay</span> ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {fonctionnalites.map((f, i) => (
              <FeatureCard key={i} icone={f.icone} titre={f.titre} description={f.description} />
            ))}
          </div>
        </div>
      </section>

      {/* Section Bourses / Diaspora */}
      <section className="bg-accent/10 py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-4">
            Programme de Bourses Diaspora
          </h2>
          <p className="text-lg mb-8 text-neutral-700">
            Vous êtes dans la diaspora ? Financez les cours d&apos;un étudiant défavorisé
            et contribuez à la souveraineté éducative africaine.
          </p>
          <Link href="/bourses" className="btn-accent inline-block w-auto px-10">
            Faire un don
          </Link>
        </div>
      </section>

      {/* Section Accès rapide */}
      <section className="py-12 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-poppins font-bold text-center mb-8">Commencer maintenant</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link
              href="/tuteurs"
              className="flex items-center gap-5 p-6 bg-white rounded-2xl shadow-sm border border-neutral-200 hover:border-primary-400 hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-4 bg-primary-50 rounded-xl text-primary-600 group-hover:bg-primary-100 transition">
                <FiUsers size={28} />
              </div>
              <div>
                <p className="font-poppins font-bold text-lg">Trouver un tuteur</p>
                <p className="text-neutral-500 text-sm mt-1">Cours particuliers à domicile ou en ligne</p>
              </div>
            </Link>
            <Link
              href="/cours"
              className="flex items-center gap-5 p-6 bg-white rounded-2xl shadow-sm border border-neutral-200 hover:border-accent-400 hover:shadow-md transition-all duration-200 group"
            >
              <div className="p-4 bg-accent-50 rounded-xl text-accent-600 group-hover:bg-accent-100 transition">
                <FiBookOpen size={28} />
              </div>
              <div>
                <p className="font-poppins font-bold text-lg">Accéder aux cours</p>
                <p className="text-neutral-500 text-sm mt-1">Vidéos et ressources pédagogiques</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Section Recrutement — BAS DE PAGE (rappel) */}
      <section className="py-16 px-4 bg-gradient-to-br from-primary-700 to-primary-900 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <FiUsers size={16} />
            Rejoignez notre communauté de tuteurs
          </div>
          <h2 className="text-2xl md:text-3xl font-poppins font-bold mb-4">
            Partagez votre savoir, créez votre emploi
          </h2>
          <p className="text-lg mb-8 text-white/80 max-w-2xl mx-auto">
            Devenez tuteur sur EduKaay. Fixez vos horaires, vos tarifs,
            et aidez des élèves à progresser partout en Afrique de l&apos;Ouest.
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <a
              href="tel:+221338001234"
              className="flex items-center gap-2 bg-white/20 hover:bg-white/30 border border-white/30 text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200"
            >
              <FiPhone size={18} />
              +221 33 800 12 34
            </a>
            <Link
              href="/devenir-tuteur"
              className="bg-accent-500 hover:bg-accent-400 text-white font-bold px-8 py-3 rounded-xl shadow-lg transition-all duration-200 active:scale-95"
            >
              Postuler en ligne
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
