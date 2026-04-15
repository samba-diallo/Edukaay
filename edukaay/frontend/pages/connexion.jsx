/**
 * Page de connexion
 * Formulaire d'authentification par email et mot de passe
 */
import { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import api from '../lib/api';

export default function Connexion() {
  const router = useRouter();
  const [formData, setFormData] = useState({ email: '', motDePasse: '' });
  const [erreur, setErreur] = useState('');
  const [chargement, setChargement] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErreur('');
    setChargement(true);

    try {
      const response = await api.post('/users/connexion', formData);
      localStorage.setItem('edukaay_token', response.data.token);
      localStorage.setItem('edukaay_user', JSON.stringify(response.data.utilisateur));
      router.push('/tableau-de-bord');
    } catch (error) {
      setErreur(error.response?.data?.error || 'Erreur de connexion');
    } finally {
      setChargement(false);
    }
  };

  return (
    <>
      <Head>
        <title>Connexion - EduKaay</title>
      </Head>

      <div className="min-h-[70vh] flex items-center justify-center px-4">
        <div className="w-full max-w-md">
          <h1 className="font-poppins text-2xl font-bold text-center mb-8">
            Connexion à <span className="text-primary">EduKaay</span>
          </h1>

          {erreur && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl mb-4 text-sm">{erreur}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                className="input-field"
                placeholder="votre@email.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Mot de passe</label>
              <input
                type="password"
                className="input-field"
                placeholder="Votre mot de passe"
                value={formData.motDePasse}
                onChange={(e) => setFormData({ ...formData, motDePasse: e.target.value })}
                required
              />
            </div>

            <button type="submit" className="btn-primary" disabled={chargement}>
              {chargement ? 'Connexion en cours...' : 'Se connecter'}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-neutral-600">
            Pas encore de compte ?{' '}
            <Link href="/inscription" className="text-primary font-medium hover:underline">
              S&apos;inscrire gratuitement
            </Link>
          </p>
        </div>
      </div>
    </>
  );
}
