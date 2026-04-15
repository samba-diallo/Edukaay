/**
 * Tableau de bord utilisateur
 * Redirige selon le rôle (étudiant ou tuteur)
 */
import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { FiBook, FiCalendar, FiUser, FiLogOut, FiStar, FiCheckCircle, FiAlertCircle, FiClock } from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export default function TableauDeBord() {
  const router = useRouter();
  const [utilisateur, setUtilisateur] = useState(null);
  const [seancesAValider, setSeancesAValider] = useState([]);
  const [chargementValidation, setChargementValidation] = useState(false);
  const [actionEnCours, setActionEnCours] = useState(null);

  const chargerSeancesAValider = useCallback(async (token) => {
    try {
      const res = await fetch(`${API_URL}/bookings/a-valider`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data = await res.json();
        setSeancesAValider(data.reservations || []);
      }
    } catch {
      // Silencieux si hors-ligne
    }
  }, []);

  useEffect(() => {
    const token = localStorage.getItem('edukaay_token');
    const user = localStorage.getItem('edukaay_user');
    if (!token || !user) {
      router.push('/connexion');
      return;
    }
    const parsed = JSON.parse(user);
    setUtilisateur(parsed);
    if (parsed.role === 'etudiant' || parsed.role === 'parent') {
      chargerSeancesAValider(token);
    }
  }, [router, chargerSeancesAValider]);

  const validerSeance = async (reservationId, decision) => {
    setActionEnCours(reservationId);
    const token = localStorage.getItem('edukaay_token');
    try {
      const res = await fetch(`${API_URL}/bookings/${reservationId}/valider-famille`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ decision }),
      });
      if (res.ok) {
        setSeancesAValider(prev => prev.filter(s => s.id !== reservationId));
      }
    } catch {
      // Erreur silencieuse
    } finally {
      setActionEnCours(null);
    }
  };

  const handleDeconnexion = () => {
    localStorage.removeItem('edukaay_token');
    localStorage.removeItem('edukaay_user');
    router.push('/');
  };

  if (!utilisateur) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-neutral-500">Chargement...</p>
      </div>
    );
  }

  const estTuteur = utilisateur.role === 'tuteur';

  return (
    <>
      <Head>
        <title>Tableau de bord - EduKaay</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold">
              Bonjour, <span className="text-primary">{utilisateur.prenom}</span> !
            </h1>
            <p className="text-neutral-500 mt-1">
              {estTuteur ? 'Espace tuteur' : 'Espace étudiant'} — {utilisateur.ville || 'Dakar'}
            </p>
          </div>
          <button
            onClick={handleDeconnexion}
            className="flex items-center gap-2 py-2 px-4 border border-neutral-300 rounded-lg text-neutral-600 hover:bg-neutral-100 transition-colors text-sm"
          >
            <FiLogOut size={16} />
            Se déconnecter
          </button>
        </div>

        {/* Cartes de navigation rapide */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          {!estTuteur ? (
            <>
              <Link href="/cours" className="card card-interactive flex items-start gap-4 p-6">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <FiBook size={24} />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Trouver un cours</h3>
                  <p className="text-sm text-neutral-500 mt-1">Parcourez notre catalogue de tuteurs</p>
                </div>
              </Link>
              <div className="card flex items-start gap-4 p-6">
                <div className="p-3 rounded-xl bg-accent/10 text-accent-600">
                  <FiCalendar size={24} />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Mes réservations</h3>
                  <p className="text-sm text-neutral-500 mt-1">Aucune réservation pour l&apos;instant</p>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-6">
                <div className="p-3 rounded-xl bg-green-50 text-green-600">
                  <FiStar size={24} />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Mes évaluations</h3>
                  <p className="text-sm text-neutral-500 mt-1">Aucune évaluation pour l&apos;instant</p>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="card flex items-start gap-4 p-6">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <FiBook size={24} />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Mes cours publiés</h3>
                  <p className="text-sm text-neutral-500 mt-1">Gérez vos offres de tutorat</p>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-6">
                <div className="p-3 rounded-xl bg-accent/10 text-accent-600">
                  <FiCalendar size={24} />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Mes séances</h3>
                  <p className="text-sm text-neutral-500 mt-1">Aucune séance planifiée</p>
                </div>
              </div>
              <div className="card flex items-start gap-4 p-6">
                <div className="p-3 rounded-xl bg-green-50 text-green-600">
                  <FiUser size={24} />
                </div>
                <div>
                  <h3 className="font-semibold font-poppins">Mon profil tuteur</h3>
                  <p className="text-sm text-neutral-500 mt-1">Complétez votre profil pour attirer plus d&apos;élèves</p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Section Validation Famille — visible pour étudiants et parents */}
        {(utilisateur.role === 'etudiant' || utilisateur.role === 'parent') && seancesAValider.length > 0 && (
          <div className="mb-10">
            <div className="flex items-center gap-2 mb-4">
              <FiClock className="text-accent-600" size={20} />
              <h2 className="font-poppins font-bold text-lg">
                Séances à valider
                <span className="ml-2 bg-accent-100 text-accent-700 text-sm font-bold px-2 py-0.5 rounded-full">
                  {seancesAValider.length}
                </span>
              </h2>
            </div>
            <div className="space-y-4">
              {seancesAValider.map((seance) => (
                <div key={seance.id} className="card p-5 border-l-4 border-accent-400">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold font-poppins">
                        {seance.cours?.titre || 'Cours'}
                      </p>
                      <p className="text-sm text-neutral-500 mt-1">
                        Tuteur : {seance.tuteur?.prenom} {seance.tuteur?.nom}
                        {seance.tuteur?.telephone && (
                          <a href={`tel:${seance.tuteur.telephone}`} className="ml-2 text-primary-600 hover:underline">
                            {seance.tuteur.telephone}
                          </a>
                        )}
                      </p>
                      <p className="text-sm text-neutral-500">
                        Montant : <span className="font-semibold">{Number(seance.montantTotal).toLocaleString('fr-SN')} FCFA</span>
                      </p>
                    </div>
                    <div className="flex gap-3 flex-shrink-0">
                      <button
                        onClick={() => validerSeance(seance.id, 'confirmee')}
                        disabled={actionEnCours === seance.id}
                        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
                      >
                        <FiCheckCircle size={16} />
                        Confirmer
                      </button>
                      <button
                        onClick={() => validerSeance(seance.id, 'contestee')}
                        disabled={actionEnCours === seance.id}
                        className="flex items-center gap-2 px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl transition disabled:opacity-50"
                      >
                        <FiAlertCircle size={16} />
                        Signaler
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations du compte */}
        <div className="card p-6">
          <h2 className="font-poppins font-bold text-lg mb-4">Informations du compte</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">Nom complet</span>
              <span className="font-medium">{utilisateur.prenom} {utilisateur.nom}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">Email</span>
              <span className="font-medium">{utilisateur.email}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">Rôle</span>
              <span className="badge badge-primary">{utilisateur.role}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-neutral-100">
              <span className="text-neutral-500">Ville</span>
              <span className="font-medium">{utilisateur.ville || 'Non renseignée'}</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
