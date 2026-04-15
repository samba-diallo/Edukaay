/**
 * Point d'entrée de l'application Next.js
 * Charge les styles globaux et le layout principal
 */
import '../styles/globals.css';
import Layout from '../components/layout/Layout';
import ChatbotWidget from '../components/ui/ChatbotWidget';

export default function EduKaayApp({ Component, pageProps }) {
  return (
    <Layout>
      <Component {...pageProps} />
      <ChatbotWidget />
    </Layout>
  );
}
