/**
 * Page de recherche de cours
 * Affiche les résultats filtrés par matière, niveau, ville, etc.
 */
import { useState, useEffect } from 'react';
import Head from 'next/head';
import { useRouter } from 'next/router';
import CourseCard from '../../components/ui/CourseCard';
import api from '../../lib/api';

export default function RechercheCours() {
  const router = useRouter();
  const [cours, setCours] = useState([]);
  const [chargement, setChargement] = useState(true);
  const [filtres, setFiltres] = useState({
    matiere: '',
    niveau: '',
    modalite: '',
    ville: '',
  });

  useEffect(() => {
    chargerCours();
  }, [router.query]);

  async function chargerCours() {
    try {
      setChargement(true);
      const params = { ...router.query };
      const response = await api.get('/courses', { params });
      setCours(response.data.cours || []);
    } catch (error) {
      console.error('Erreur chargement cours:', error);
    } finally {
      setChargement(false);
    }
  }

  const matieres = ['Mathématiques', 'Français', 'Anglais', 'Physique-Chimie', 'SVT', 'Arabe', 'Histoire-Géo', 'Philosophie'];

  return (
    <>
      <Head>
        <title>Rechercher un cours - EduKaay</title>
      </Head>

      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="font-poppins text-2xl font-bold mb-6">Trouver un cours</h1>

        {/* Filtres */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <select
            className="input-field"
            value={filtres.matiere}
            onChange={(e) => setFiltres({ ...filtres, matiere: e.target.value })}
          >
            <option value="">Toutes matières</option>
            {matieres.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          <select
            className="input-field"
            value={filtres.niveau}
            onChange={(e) => setFiltres({ ...filtres, niveau: e.target.value })}
          >
            <option value="">Tous niveaux</option>
            <option value="primaire">Primaire</option>
            <option value="college">Collège</option>
            <option value="lycee">Lycée</option>
            <option value="universite">Université</option>
          </select>

          <select
            className="input-field"
            value={filtres.modalite}
            onChange={(e) => setFiltres({ ...filtres, modalite: e.target.value })}
          >
            <option value="">Toutes modalités</option>
            <option value="en_ligne">En ligne</option>
            <option value="domicile">À domicile</option>
          </select>

          <select
            className="input-field"
            value={filtres.ville}
            onChange={(e) => setFiltres({ ...filtres, ville: e.target.value })}
          >
            <option value="">Toutes villes</option>
            <option value="Dakar">Dakar</option>
            <option value="Thiès">Thiès</option>
            <option value="Saint-Louis">Saint-Louis</option>
            <option value="Ziguinchor">Ziguinchor</option>
          </select>
        </div>

        {/* Résultats */}
        {chargement ? (
          <div className="text-center py-16 text-neutral-500">Chargement des cours...</div>
        ) : cours.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-neutral-500 text-lg">Aucun cours trouvé pour ces critères.</p>
            <p className="text-neutral-700 mt-2">Essayez de modifier vos filtres.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cours.map((c) => (
              <CourseCard key={c.id} cours={c} />
            ))}
          </div>
        )}
      </div>
    </>
  );
}
