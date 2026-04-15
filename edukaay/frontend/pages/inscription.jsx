/**
 * Page d'inscription
 * Formulaire de création de compte (étudiant ou tuteur)
 */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../lib/api';

export default function Inscription() {
  const router = useRouter();
  const roleInitial = router.query.role || 'etudiant';

  const [formData, setFormData] = useState({
    prenom: '',
    nom: '',
    email: '',
    telephone: '',
    motDePasse: '',
    role: roleInitial,
    niveauEtude: '',
    ville: 'Dakar',
  });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const response = await api.post('/users/inscription', formData);
      localStorage.setItem('edukaay_token', response.data.token);
      localStorage.setItem('edukaay_user', JSON.stringify(response.data.utilisateur));
      router.push('/tableau-de-bord');
    } catch (error) {
      setErreur(error.response?.data?.error || 'Erreur lors de l\'inscription');
    } finally {
      setChargement(false);
    }
  };

  return (
    <>
      <Head>
        <title>Inscription - EduKaay</title>
      </Head>

      <div className="min-h-[80vh] flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-lg">
          <h1 className="font-poppins text-2xl font-bold text-center mb-2">
            Rejoignez <span className="text-primary">EduKaay</span>
          </h1>
          <p className="text-center text-neutral-500 mb-8">Créez votre compte gratuitement</p>

          {erreur && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{erreur}</div>
          )}

          {/* Sélection du rôle */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                formData.role === 'etudiant'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
              onClick={() => setFormData({ ...formData, role: 'etudiant' })}
            >
              Je suis étudiant
            </button>
            <button
              type="button"
              className={`flex-1 py-3 rounded-xl font-medium transition-colors ${
                formData.role === 'tuteur'
                  ? 'bg-primary text-white'
                  : 'bg-neutral-100 text-neutral-600'
              }`}
              onClick={() => setFormData({ ...formData, role: 'tuteur' })}
            >
              Je suis tuteur
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Prénom</label>
                <input type="text" name="prenom" className="input-field" value={formData.prenom} onChange={handleChange} required />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Nom</label>
                <input type="text" name="nom" className="input-field" value={formData.nom} onChange={handleChange} required />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input type="email" name="email" className="input-field" placeholder="votre@email.com" value={formData.email} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Téléphone</label>
              <input type="tel" name="telephone" className="input-field" placeholder="+221 7X XXX XX XX" value={formData.telephone} onChange={handleChange} required />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input type="password" name="motDePasse" className="input-field" placeholder="Minimum 8 caractères" value={formData.motDePasse} onChange={handleChange} required minLength={8} />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium mb-1">Niveau d&apos;étude</label>
                <select name="niveauEtude" className="input-field" value={formData.niveauEtude} onChange={handleChange}>
                  <option value="">Sélectionner</option>
                  <option value="primaire">Primaire</option>
                  <option value="college">Collège</option>
                  <option value="lycee">Lycée</option>
                  <option value="universite">Université</option>
                  <option value="diplome">Diplômé</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Ville</label>
                <select name="ville" className="input-field" value={formData.ville} onChange={handleChange}>
                  <option value="Dakar">Dakar</option>
                  <option value="Thiès">Thiès</option>
                  <option value="Saint-Louis">Saint-Louis</option>
                  <option value="Ziguinchor">Ziguinchor</option>
                  <option value="Kaolack">Kaolack</option>
                </select>
              </div>
            </div>

            <button type="submit" className="btn-primary" disabled={chargement}>
              {chargement ? 'Inscription en cours...' : 'Créer mon compte'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-gray-600">
            Déjà un compte ?{' '}
            <Link href="/connexion" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
