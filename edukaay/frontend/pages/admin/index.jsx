/**
 * Page Admin — Tableau de bord EduKaay
 * Accessible uniquement aux administrateurs
 */
import { useEffect, useState, useCallback } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import Link from 'next/link';
import {
  FiUsers, FiBook, FiCalendar, FiDollarSign,
  FiAlertTriangle, FiUserCheck, FiLogOut, FiRefreshCw,
} from 'react-icons/fi';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const SERVER_URL = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:5000';

function StatCard({ icone, label, valeur, couleur = 'primary', sous }) {
  const couleurs = {
    primary: 'bg-primary-50 text-primary-600',
    accent: 'bg-accent-50 text-accent-600',
    green: 'bg-green-50 text-green-600',
    red: 'bg-red-50 text-red-600',
    purple: 'bg-purple-50 text-purple-600',
  };
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 flex items-start gap-4 shadow-sm">
      <div className={`p-3 rounded-xl flex-shrink-0 ${couleurs[couleur]}`}>
        {icone}
      </div>
      <div>
        <p className="text-2xl font-poppins font-bold">{valeur ?? '—'}</p>
        <p className="text-sm font-medium text-neutral-600 mt-0.5">{label}</p>
        {sous && <p className="text-xs text-neutral-400 mt-1">{sous}</p>}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState(null);
  const [litiges, setLitiges] = useState([]);
  const [candidatures, setCandidatures] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [onglet, setOnglet] = useState('stats');
  const [actionEnCours, setActionEnCours] = useState(null);

  const getToken = () => localStorage.getItem('edukaay_token');

  const chargerDonnees = useCallback(async () => {
    const token = getToken();
    if (!token) return router.push('/connexion');

    const user = JSON.parse(localStorage.getItem('edukaay_user') || '{}');
    if (user.role !== 'admin') return router.push('/tableau-de-bord');

    setChargement(true);
    try {
      const [statsRes, litigesRes, candidaturesRes] = await Promise.all([
        fetch(`${API_URL}/admin/stats`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/admin/litiges`, { headers: { Authorization: `Bearer ${token}` } }),
        fetch(`${API_URL}/recruitment/candidatures?statut=en_attente`, { headers: { Authorization: `Bearer ${token}` } }),
      ]);

      if (statsRes.ok) setStats((await statsRes.json()).stats);
      if (litigesRes.ok) setLitiges((await litigesRes.json()).litiges || []);
      if (candidaturesRes.ok) setCandidatures((await candidaturesRes.json()).candidatures || []);
    } catch {
      // Silencieux
    } finally {
      setChargement(false);
    }
  }, [router]);

  useEffect(() => { chargerDonnees(); }, [chargerDonnees]);

  const traiterCandidature = async (id, statut) => {
    setActionEnCours(id);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/recruitment/candidatures/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ statut }),
      });
      if (res.ok) setCandidatures(prev => prev.filter(c => c.id !== id));
    } finally {
      setActionEnCours(null);
    }
  };

  const resoudreLitige = async (id, resolution) => {
    setActionEnCours(id);
    const token = getToken();
    try {
      const res = await fetch(`${API_URL}/admin/litiges/${id}/resoudre`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ resolution }),
      });
      if (res.ok) setLitiges(prev => prev.filter(l => l.id !== id));
    } finally {
      setActionEnCours(null);
    }
  };

  const handleDeconnexion = () => {
    localStorage.removeItem('edukaay_token');
    localStorage.removeItem('edukaay_user');
    router.push('/');
  };

  const ONGLETS = [
    { id: 'stats', label: 'Vue d\'ensemble' },
    { id: 'candidatures', label: `Candidatures${candidatures.length ? ` (${candidatures.length})` : ''}` },
    { id: 'litiges', label: `Litiges${litiges.length ? ` (${litiges.length})` : ''}` },
  ];

  return (
    <>
      <Head>
        <title>Admin — EduKaay</title>
      </Head>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
          <div>
            <h1 className="font-poppins text-2xl md:text-3xl font-bold">
              Tableau de bord <span className="text-primary-600">Admin</span>
            </h1>
            <p className="text-neutral-500 text-sm mt-1">EduKaay — Gestion de la plateforme</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={chargerDonnees}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition"
            >
              <FiRefreshCw size={15} />
              Actualiser
            </button>
            <button
              onClick={handleDeconnexion}
              className="flex items-center gap-2 px-4 py-2 border border-neutral-300 rounded-lg text-sm text-neutral-600 hover:bg-neutral-50 transition"
            >
              <FiLogOut size={15} />
              Déconnexion
            </button>
          </div>
        </div>

        {/* Onglets */}
        <div className="flex gap-1 bg-neutral-100 p-1 rounded-xl mb-8 w-fit">
          {ONGLETS.map(o => (
            <button
              key={o.id}
              onClick={() => setOnglet(o.id)}
              className={`px-5 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                onglet === o.id ? 'bg-white shadow text-primary-700 font-semibold' : 'text-neutral-600 hover:text-neutral-800'
              }`}
            >
              {o.label}
            </button>
          ))}
        </div>

        {chargement ? (
          <div className="text-center py-20 text-neutral-400">Chargement...</div>
        ) : (
          <>
            {/* Onglet Stats */}
            {onglet === 'stats' && stats && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <StatCard
                  icone={<FiUsers size={22} />}
                  label="Étudiants actifs"
                  valeur={stats.etudiants}
                  couleur="primary"
                />
                <StatCard
                  icone={<FiUserCheck size={22} />}
                  label="Tuteurs actifs"
                  valeur={stats.tuteurs}
                  couleur="green"
                />
                <StatCard
                  icone={<FiBook size={22} />}
                  label="Cours publiés"
                  valeur={stats.cours}
                  couleur="purple"
                />
                <StatCard
                  icone={<FiCalendar size={22} />}
                  label="Réservations totales"
                  valeur={stats.reservations}
                  couleur="accent"
                />
                <StatCard
                  icone={<FiDollarSign size={22} />}
                  label="Revenus totaux"
                  valeur={`${Number(stats.revenusTotal || 0).toLocaleString('fr-SN')} FCFA`}
                  sous={`Commission EduKaay : ${Number(stats.commissionPlateforme || 0).toLocaleString('fr-SN')} FCFA`}
                  couleur="green"
                />
                <StatCard
                  icone={<FiAlertTriangle size={22} />}
                  label="Litiges en cours"
                  valeur={stats.seancesContestees}
                  sous={`${stats.candidaturesEnAttente} candidature(s) en attente`}
                  couleur="red"
                />
              </div>
            )}

            {/* Onglet Candidatures */}
            {onglet === 'candidatures' && (
              <div>
                <h2 className="font-poppins font-bold text-lg mb-5">
                  Candidatures tuteurs en attente
                </h2>
                {candidatures.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 bg-neutral-50 rounded-2xl">
                    Aucune candidature en attente.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {candidatures.map((c) => (
                      <div key={c.id} className="bg-white border border-neutral-200 rounded-2xl p-5 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <p className="font-poppins font-bold">
                              {c.prenom} {c.nom}
                            </p>
                            <p className="text-sm text-neutral-500 mt-1">
                              {c.email} · {c.telephone}
                            </p>
                            <p className="text-sm text-neutral-600 mt-1">
                              <span className="font-medium">Niveau :</span> {c.niveauEtude} ·{' '}
                              <span className="font-medium">Matières :</span> {c.matieres}
                            </p>
                            {c.message && (
                              <p className="text-xs text-neutral-500 mt-2 bg-neutral-50 px-3 py-2 rounded-lg">
                                {c.message}
                              </p>
                            )}
                            {c.documentUrl && (
                              <a
                                href={`${SERVER_URL}${c.documentUrl}`}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-primary-600 hover:underline mt-1 block"
                              >
                                Voir le document PDF
                              </a>
                            )}
                          </div>
                          <div className="flex gap-3 flex-shrink-0">
                            <button
                              onClick={() => traiterCandidature(c.id, 'approuvee')}
                              disabled={actionEnCours === c.id}
                              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
                            >
                              Approuver
                            </button>
                            <button
                              onClick={() => traiterCandidature(c.id, 'rejetee')}
                              disabled={actionEnCours === c.id}
                              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl transition disabled:opacity-50"
                            >
                              Rejeter
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Onglet Litiges */}
            {onglet === 'litiges' && (
              <div>
                <h2 className="font-poppins font-bold text-lg mb-5">Litiges à résoudre</h2>
                {litiges.length === 0 ? (
                  <div className="text-center py-16 text-neutral-400 bg-neutral-50 rounded-2xl">
                    Aucun litige en cours.
                  </div>
                ) : (
                  <div className="space-y-4">
                    {litiges.map((l) => (
                      <div key={l.id} className="bg-white border border-red-200 border-l-4 border-l-red-500 rounded-2xl p-5 shadow-sm">
                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                          <div>
                            <p className="font-poppins font-bold">{l.cours?.titre}</p>
                            <p className="text-sm text-neutral-600 mt-1">
                              <span className="font-medium">Étudiant :</span>{' '}
                              {l.etudiant?.prenom} {l.etudiant?.nom} ({l.etudiant?.telephone})
                            </p>
                            <p className="text-sm text-neutral-600">
                              <span className="font-medium">Tuteur :</span>{' '}
                              {l.tuteur?.prenom} {l.tuteur?.nom} ({l.tuteur?.telephone})
                            </p>
                            <p className="text-sm font-semibold mt-1">
                              Montant : {Number(l.montantTotal || 0).toLocaleString('fr-SN')} FCFA
                            </p>
                            {l.familyValidationNote && (
                              <p className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg mt-2">
                                {l.familyValidationNote}
                              </p>
                            )}
                          </div>
                          <div className="flex gap-3 flex-shrink-0">
                            <button
                              onClick={() => resoudreLitige(l.id, 'confirmee')}
                              disabled={actionEnCours === l.id}
                              className="px-4 py-2 bg-green-600 hover:bg-green-500 text-white text-sm font-semibold rounded-xl transition disabled:opacity-50"
                            >
                              Valider la séance
                            </button>
                            <button
                              onClick={() => resoudreLitige(l.id, 'annulee')}
                              disabled={actionEnCours === l.id}
                              className="px-4 py-2 bg-red-100 hover:bg-red-200 text-red-700 text-sm font-semibold rounded-xl transition disabled:opacity-50"
                            >
                              Annuler la séance
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}
