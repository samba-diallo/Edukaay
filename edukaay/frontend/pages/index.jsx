import React, { useEffect, useRef } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { FiSearch, FiVideo, FiShield, FiDollarSign, FiArrowRight, FiCheckCircle } from 'react-icons/fi';
import MagneticWrapper from '../components/ui/MagneticWrapper';

// On enregistre ScrollTrigger pour GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function Accueil() {
  const heroRef = useRef(null);
  const heroTextRef = useRef(null);
  const philosophyRef = useRef(null);
  const featuresRef = useRef(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      // 1. Animation Hero (Stagger)
      const heroElements = heroTextRef.current.children;
      gsap.from(heroElements, {
        y: 50,
        opacity: 0,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        delay: 0.2
      });

      // Parallaxe très subtil sur le fond du hero
      gsap.to('.hero-bg', {
        yPercent: 20,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      // 2. Animation Philosophie (Manifeste)
      const philoLines = gsap.utils.toArray('.philo-line');
      philoLines.forEach((line) => {
        gsap.from(line, {
          scrollTrigger: {
            trigger: line,
            start: 'top 85%',
          },
          y: 40,
          opacity: 0,
          duration: 1,
          ease: 'power3.out'
        });
      });

      // 3. Animation Cartes Features
      const cards = gsap.utils.toArray('.feature-card-anim');
      gsap.from(cards, {
        scrollTrigger: {
          trigger: featuresRef.current,
          start: 'top 75%',
        },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: 'back.out(1.2)'
      });

    }, [heroRef, philosophyRef, featuresRef]); // Scope pour le nettoyage

    return () => ctx.revert(); // Nettoyage lors du démontage
  }, []);

  return (
    <div className="bg-neutral-50 overflow-hidden">
      <Head>
        <title>EduKaay | L'Élite du Tutorat en Afrique de l'Ouest</title>
        <meta name="description" content="Trouvez le meilleur tuteur en 2 minutes. Réservation instantanée et paiement via Wave/Orange Money." />
      </Head>

      {/* SECTION HERO - Cinématique (100vh) */}
      <section ref={heroRef} className="relative h-[100svh] w-full flex flex-col justify-end pb-24 md:pb-32 px-6 lg:px-12">
        {/* Background Image avec gradient superposé pour lisibilité */}
        <div 
          className="hero-bg absolute inset-0 z-0 bg-cover bg-center"
          style={{ backgroundImage: "url('https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=2071&auto=format&fit=crop')" }}
        >
          {/* Gradient overlay lourd primaire-vers-noir */}
          <div className="absolute inset-0 bg-gradient-to-t from-primary-900 via-primary-900/80 to-primary-900/40 mix-blend-multiply"></div>
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Contenu Hero */}
        <div ref={heroTextRef} className="relative z-10 max-w-4xl">
          <div className="inline-block overflow-hidden mb-4">
            <span className="block text-accent-400 font-inter tracking-widest uppercase text-sm font-semibold">
              La Nouvelle Norme de l'Éducation
            </span>
          </div>
          
          <h1 className="text-white text-5xl md:text-7xl lg:text-8xl font-poppins leading-[1.1] tracking-tight mb-6">
            <span className="font-medium">L'Excellence est</span><br />
            <span className="font-bold italic text-accent-300">À portée de main.</span>
          </h1>
          
          <p className="text-white/80 text-lg md:text-xl font-inter max-w-2xl mb-10 leading-relaxed">
            Trouvez un tuteur d'élite vérifié. Réservez votre cours. Payez via Mobile Money en moins de 2 minutes. Bienvenue dans la nouvelle ère du tutorat au Sénégal.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <MagneticWrapper>
              <Link href="/tuteurs" className="group flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-400 text-neutral-900 px-8 py-4 rounded-full font-semibold transition-all duration-300">
                Trouver un Tuteur
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
            </MagneticWrapper>
            
            <MagneticWrapper>
              <Link href="/devenir-tuteur" className="group flex items-center justify-center gap-2 border border-white/30 hover:border-white/80 hover:bg-white/10 text-white px-8 py-4 rounded-full font-semibold transition-all duration-300 backdrop-blur-sm">
                Devenir Tuteur
              </Link>
            </MagneticWrapper>
          </div>
        </div>
      </section>

      {/* SECTION PHILOSOPHIE (Le Manifeste contre Jangalma) */}
      <section ref={philosophyRef} className="py-32 px-6 lg:px-12 bg-primary-900 text-white relative">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-poppins mb-16">
            <div className="philo-line mb-4 text-white/50 font-medium">La plupart des agences vous font attendre.</div>
            <div className="philo-line font-bold italic text-accent-400 text-5xl md:text-7xl">Nous vous connectons en 2 minutes.</div>
          </h2>
          
          <div className="grid md:grid-cols-2 gap-12 mt-20">
            <div className="philo-line">
              <h3 className="text-2xl font-semibold mb-4 text-white">Adieu les formulaires opaques.</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Fini les agences où vous devez remplir un formulaire et attendre qu'on vous rappelle. Sur EduKaay, vous parcourez les profils transparents de nos tuteurs, lisez de vrais avis, et choisissez vous-même qui vous accompagnera.
              </p>
            </div>
            <div className="philo-line">
              <h3 className="text-2xl font-semibold mb-4 text-white">Intégration Mobile Money native.</h3>
              <p className="text-white/70 leading-relaxed text-lg">
                Pas besoin de virement bancaire complexe. Payez vos cours instantanément et en toute sécurité via Wave, Orange Money ou MTN MoMo directement depuis l'application.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION FONCTIONNALITÉS (Cartes Interactives) */}
      <section ref={featuresRef} className="py-32 px-6 lg:px-12 bg-neutral-50 relative">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-20">
            <span className="text-primary-600 font-semibold tracking-widest uppercase text-sm">Fonctionnalités</span>
            <h2 className="text-4xl md:text-5xl font-poppins font-bold mt-2 text-neutral-900">Un instrument de réussite.</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Carte 1 */}
            <div className="feature-card-anim bg-white p-10 rounded-[2.5rem] shadow-xl border border-neutral-100 hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary-100 text-primary-600 rounded-2xl flex items-center justify-center mb-8">
                  <FiSearch size={28} />
                </div>
                <h3 className="text-2xl font-bold font-poppins mb-4">Recherche chirurgicale</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Filtrez les tuteurs par matière, niveau, ville et tarif. Trouvez la perle rare parmi des profils certifiés.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-neutral-700"><FiCheckCircle className="text-accent-500" /> Profils vidéos</li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700"><FiCheckCircle className="text-accent-500" /> Diplômes vérifiés</li>
                </ul>
              </div>
            </div>

            {/* Carte 2 */}
            <div className="feature-card-anim bg-white p-10 rounded-[2.5rem] shadow-xl border border-neutral-100 hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden group mt-0 md:mt-12">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent-50 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-accent-100 text-accent-600 rounded-2xl flex items-center justify-center mb-8">
                  <FiDollarSign size={28} />
                </div>
                <h3 className="text-2xl font-bold font-poppins mb-4">Paiement sans friction</h3>
                <p className="text-neutral-600 leading-relaxed mb-6">
                  Intégration Fintech avancée. L'argent est bloqué sécuritairement jusqu'à ce que le cours soit validé.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-neutral-700"><FiCheckCircle className="text-accent-500" /> Wave & Orange Money</li>
                  <li className="flex items-center gap-2 text-sm text-neutral-700"><FiCheckCircle className="text-accent-500" /> Paiement garanti</li>
                </ul>
              </div>
            </div>

            {/* Carte 3 */}
            <div className="feature-card-anim bg-primary-600 p-10 rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-shadow duration-500 relative overflow-hidden group mt-0 md:mt-24 text-white">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500 rounded-bl-[100px] -z-0 transition-transform group-hover:scale-110"></div>
              <div className="relative z-10">
                <div className="w-16 h-16 bg-primary-500 text-white rounded-2xl flex items-center justify-center mb-8">
                  <FiShield size={28} />
                </div>
                <h3 className="text-2xl font-bold font-poppins mb-4">Espace sécurisé</h3>
                <p className="text-white/80 leading-relaxed mb-6">
                  Un tableau de bord complet pour gérer le calendrier, les devoirs, et communiquer avec le tuteur.
                </p>
                <ul className="space-y-3">
                  <li className="flex items-center gap-2 text-sm text-white"><FiCheckCircle className="text-accent-400" /> Messagerie en direct</li>
                  <li className="flex items-center gap-2 text-sm text-white"><FiCheckCircle className="text-accent-400" /> Suivi pédagogique</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
      
    </div>
  );
}
