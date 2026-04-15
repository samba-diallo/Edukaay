/**
 * Page Devenir Tuteur
 * Formulaire de candidature pour rejoindre l'équipe de tuteurs EduKaay
 */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { FiUser, FiPhone, FiMail, FiBook, FiFileText, FiCheckCircle, FiAlertCircle } from 'react-icons/fi';

const NIVEAUX_ETUDE = [
  'Bac',
  'Bac+1 / Bac+2 (DUT, BTS)',
  'Licence (Bac+3)',
  'Master (Bac+5)',
  'Doctorat',
  'Ingénieur',
  'Autre',
];

const MATIERES_POPULAIRES = [
  'Mathématiques', 'Physique-Chimie', 'SVT / Biologie', 'Français',
  'Arabe', 'Anglais', 'Histoire-Géographie', 'Philosophie',
  'Économie', 'Informatique', 'Comptabilité',
];

export default function DevenirTuteur() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm();
  const [statut, setStatut] = useState(null); // 'succes' | 'erreur'
  const [chargement, setChargement] = useState(false);
  const [messageServeur, setMessageServeur] = useState('');

  const onSubmit = async (data) => {
    setChargement(true);
    setStatut(null);

    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        if (key === 'document' && value?.[0]) {
          formData.append('document', value[0]);
        } else if (value) {
          formData.append(key, value);
        }
      });

      const apiBase = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
      const res = await fetch(
        `${apiBase}/recruitment/postuler`,
        { method: 'POST', body: formData }
      );

      const json = await res.json();

      if (res.ok) {
        setStatut('succes');
        setMessageServeur(json.message);
        reset();
      } else {
        setStatut('erreur');
        setMessageServeur(json.error || 'Une erreur est survenue.');
      }
    } catch {
      setStatut('erreur');
      setMessageServeur('Impossible de contacter le serveur. Veuillez réessayer.');
    } finally {
      setChargement(false);
    }
  };

  return (
    <>
      <Head>
        <title>Devenir Tuteur — EduKaay</title>
        <meta name="description" content="Rejoignez l'équipe EduKaay et devenez tuteur. Partagez votre savoir et créez votre emploi." />
      </Head>

      {/* Hero */}
      <section className="bg-gradient-to-br from-accent-600 to-accent-700 text-white py-14 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <h1 className="font-poppins text-3xl md:text-4xl font-bold mb-4">
            Devenez Tuteur sur EduKaay
          </h1>
          <p className="text-lg text-white/90 mb-6">
            Partagez votre savoir, fixez vos propres horaires et tarifs.
            Rejoignez des centaines de tuteurs qui aident les élèves à réussir.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-6 text-sm font-medium">
            <span className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
              Remuneration rapide (Mobile Money)
            </span>
            <span className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
              Cours en ligne ou a domicile
            </span>
            <span className="flex items-center gap-2 bg-white/15 px-4 py-2 rounded-full">
              Reponse sous 48h
            </span>
          </div>
        </div>
      </section>

      {/* Formulaire */}
      <section className="py-14 px-4">
        <div className="max-w-2xl mx-auto">

          {statut === 'succes' && (
            <div className="flex items-start gap-4 bg-green-50 border border-green-200 text-green-800 rounded-xl p-5 mb-8">
              <FiCheckCircle size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold font-poppins">Candidature envoyée !</p>
                <p className="text-sm mt-1">{messageServeur}</p>
              </div>
            </div>
          )}

          {statut === 'erreur' && (
            <div className="flex items-start gap-4 bg-red-50 border border-red-200 text-red-800 rounded-xl p-5 mb-8">
              <FiAlertCircle size={24} className="flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold font-poppins">Erreur</p>
                <p className="text-sm mt-1">{messageServeur}</p>
              </div>
            </div>
          )}

          <div className="bg-white rounded-2xl shadow-sm border border-neutral-200 p-8">
            <h2 className="font-poppins font-bold text-xl mb-6">Formulaire de candidature</h2>

            <form onSubmit={handleSubmit(onSubmit)} noValidate>
              {/* Nom / Prénom */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Prénom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      {...register('prenom', { required: 'Champ requis' })}
                      type="text"
                      placeholder="Ex : Moussa"
                      className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.prenom ? 'border-red-400' : 'border-neutral-300'}`}
                    />
                  </div>
                  {errors.prenom && <p className="text-red-500 text-xs mt-1">{errors.prenom.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-700 mb-1">
                    Nom <span className="text-red-500">*</span>
                  </label>
                  <div className="relative">
                    <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                    <input
                      {...register('nom', { required: 'Champ requis' })}
                      type="text"
                      placeholder="Ex : Diallo"
                      className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.nom ? 'border-red-400' : 'border-neutral-300'}`}
                    />
                  </div>
                  {errors.nom && <p className="text-red-500 text-xs mt-1">{errors.nom.message}</p>}
                </div>
              </div>

              {/* Date de naissance */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Date de naissance <span className="text-red-500">*</span>
                </label>
                <input
                  {...register('dateNaissance', { required: 'Champ requis' })}
                  type="date"
                  className={`w-full px-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.dateNaissance ? 'border-red-400' : 'border-neutral-300'}`}
                />
                {errors.dateNaissance && <p className="text-red-500 text-xs mt-1">{errors.dateNaissance.message}</p>}
              </div>

              {/* Téléphone */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Téléphone <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('telephone', { required: 'Champ requis' })}
                    type="tel"
                    placeholder="+221 77 000 00 00"
                    className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.telephone ? 'border-red-400' : 'border-neutral-300'}`}
                  />
                </div>
                {errors.telephone && <p className="text-red-500 text-xs mt-1">{errors.telephone.message}</p>}
              </div>

              {/* Email */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Email <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('email', { required: 'Champ requis', pattern: { value: /\S+@\S+\.\S+/, message: 'Email invalide' } })}
                    type="email"
                    placeholder="exemple@email.com"
                    className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.email ? 'border-red-400' : 'border-neutral-300'}`}
                  />
                </div>
                {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
              </div>

              {/* Niveau d'étude */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Niveau d&apos;étude <span className="text-red-500">*</span>
                </label>
                <select
                  {...register('niveauEtude', { required: 'Champ requis' })}
                  className={`w-full px-4 py-3 border rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.niveauEtude ? 'border-red-400' : 'border-neutral-300'}`}
                >
                  <option value="">— Sélectionner —</option>
                  {NIVEAUX_ETUDE.map(n => <option key={n} value={n}>{n}</option>)}
                </select>
                {errors.niveauEtude && <p className="text-red-500 text-xs mt-1">{errors.niveauEtude.message}</p>}
              </div>

              {/* Matières */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Matières enseignées <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <FiBook className="absolute left-3 top-3.5 text-neutral-400" size={16} />
                  <textarea
                    {...register('matieres', { required: 'Indiquez au moins une matière' })}
                    rows={3}
                    placeholder="Ex : Mathématiques, Physique-Chimie, Arabe..."
                    className={`w-full pl-9 pr-4 py-3 border rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400 ${errors.matieres ? 'border-red-400' : 'border-neutral-300'}`}
                  />
                </div>
                {/* Suggestions rapides */}
                <div className="flex flex-wrap gap-2 mt-2">
                  {MATIERES_POPULAIRES.slice(0, 6).map(m => (
                    <span key={m} className="text-xs bg-primary-50 text-primary-700 px-2 py-1 rounded-full cursor-default">{m}</span>
                  ))}
                </div>
                {errors.matieres && <p className="text-red-500 text-xs mt-1">{errors.matieres.message}</p>}
              </div>

              {/* Message */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Motivation (optionnel)
                </label>
                <textarea
                  {...register('message')}
                  rows={3}
                  placeholder="Parlez-nous de votre expérience et de votre motivation..."
                  className="w-full px-4 py-3 border border-neutral-300 rounded-xl text-sm resize-none focus:outline-none focus:ring-2 focus:ring-primary-400"
                />
              </div>

              {/* Document PDF */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-neutral-700 mb-1">
                  Document PDF (CV, diplôme — optionnel)
                </label>
                <div className="relative">
                  <FiFileText className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" size={16} />
                  <input
                    {...register('document')}
                    type="file"
                    accept=".pdf"
                    className="w-full pl-9 pr-4 py-3 border border-neutral-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary-400 file:mr-4 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-primary-50 file:text-primary-700"
                  />
                </div>
                <p className="text-xs text-neutral-500 mt-1">Format PDF uniquement, 5 Mo max.</p>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={chargement}
                className="w-full py-4 bg-gradient-to-br from-accent-500 to-accent-600 text-white font-poppins font-bold rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {chargement ? 'Envoi en cours...' : 'Envoyer ma candidature'}
              </button>
            </form>
          </div>

          <p className="text-center text-sm text-neutral-500 mt-6">
            Une question ?{' '}
            <a href="tel:+221338001234" className="text-primary-600 font-medium hover:underline">
              Appelez-nous : +221 33 800 12 34
            </a>
          </p>
        </div>
      </section>
    </>
  );
}
