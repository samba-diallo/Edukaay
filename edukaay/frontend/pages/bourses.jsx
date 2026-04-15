/**
 * Programme de Bourses Diaspora
 * Permet à la diaspora de financer des cours pour des étudiants défavorisés
 */
import Head from 'next/head';
import Link from 'next/link';
import { FiHeart, FiGlobe, FiUsers, FiTrendingUp } from 'react-icons/fi';

const stats = [
  { icone: FiUsers, valeur: '120+', label: 'Étudiants aidés' },
  { icone: FiGlobe, valeur: '15', label: 'Pays donateurs' },
  { icone: FiHeart, valeur: '2.4M', label: 'FCFA collectés' },
  { icone: FiTrendingUp, valeur: '94%', label: 'Taux de réussite' },
];

const montants = [
  { valeur: 5000, label: '5 000 FCFA', description: '1 heure de cours pour un élève' },
  { valeur: 25000, label: '25 000 FCFA', description: '5 heures — un mois de soutien scolaire' },
  { valeur: 100000, label: '100 000 FCFA', description: 'Trimestre complet pour un lycéen' },
];

export default function Bourses() {
  return (
    <>
      <Head>
        <title>Bourses Diaspora - EduKaay</title>
        <meta name="description" content="Financez les cours d'un étudiant défavorisé depuis la diaspora. Investissez dans l'éducation africaine." />
      </Head>

      {/* Héro */}
      <section className="bg-gradient-to-br from-primary to-primary-700 text-white py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="font-poppins text-3xl md:text-5xl font-bold mb-6">
            Programme de Bourses <span className="text-accent">Diaspora</span>
          </h1>
          <p className="text-lg md:text-xl font-medium text-white mb-8">
            Vous êtes dans la diaspora ? Investissez dans l&apos;éducation d&apos;un jeune
            africain et contribuez à la souveraineté intellectuelle du continent.
          </p>
          <a href="#donner" className="btn-accent inline-block w-auto px-10">
            Faire un don maintenant
          </a>
        </div>
      </section>

      {/* Statistiques */}
      <section className="py-12 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icone;
            return (
              <div key={i} className="text-center">
                <div className="flex justify-center mb-3">
                  <div className="p-3 rounded-full bg-primary/10 text-primary">
                    <Icon size={24} />
                  </div>
                </div>
                <div className="font-poppins text-2xl font-bold text-neutral-900">{s.valeur}</div>
                <div className="text-sm text-neutral-700">{s.label}</div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="py-16 px-4 bg-neutral-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="font-poppins text-2xl md:text-3xl font-bold text-center mb-12">
            Comment ça marche ?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '1', titre: 'Vous faites un don', texte: 'Choisissez un montant et payez via Mobile Money, carte ou virement.' },
              { num: '2', titre: 'Nous sélectionnons', texte: 'Notre équipe identifie les étudiants les plus méritants et défavorisés.' },
              { num: '3', titre: 'L\'élève progresse', texte: 'Vous recevez un rapport mensuel sur les progrès de l\'élève que vous financez.' },
            ].map((e) => (
              <div key={e.num} className="card p-6 text-center">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary-700 text-white font-bold text-xl flex items-center justify-center mx-auto mb-4">
                  {e.num}
                </div>
                <h3 className="font-poppins font-bold text-lg mb-2">{e.titre}</h3>
                <p className="text-neutral-600 text-sm">{e.texte}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Formulaire de don */}
      <section id="donner" className="py-16 px-4">
        <div className="max-w-lg mx-auto">
          <h2 className="font-poppins text-2xl font-bold text-center mb-8">Choisissez votre contribution</h2>
          <div className="space-y-4 mb-6">
            {montants.map((m) => (
              <label key={m.valeur} className="card p-4 flex items-center gap-4 cursor-pointer hover:border-primary-300 transition-colors">
                <input type="radio" name="montant" value={m.valeur} className="accent-primary w-5 h-5" />
                <div>
                  <div className="font-bold text-primary">{m.label}</div>
                  <div className="text-sm text-neutral-500">{m.description}</div>
                </div>
              </label>
            ))}
            <label className="card p-4 flex items-center gap-4 cursor-pointer hover:border-primary-300 transition-colors">
              <input type="radio" name="montant" value="custom" className="accent-primary w-5 h-5" />
              <div className="flex-1">
                <div className="font-bold">Montant libre</div>
                <input type="number" placeholder="Votre montant en FCFA" className="input-field mt-2" min="1000" />
              </div>
            </label>
          </div>
          <button className="btn-primary">Procéder au paiement</button>
          <p className="text-center text-xs text-neutral-700 mt-4">
            Paiement sécurisé via Wave, Orange Money ou carte bancaire
          </p>
        </div>
      </section>
    </>
  );
}
