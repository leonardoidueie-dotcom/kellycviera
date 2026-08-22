import Hero from '@/components/sections/Hero';
import Positioning from '@/components/sections/Positioning';
import Services from '@/components/sections/Services';
import ServiceDetails from '@/components/sections/ServiceDetails';
import Counter from '@/components/sections/Counter';
import Cases from '@/components/sections/Cases';
import Clients from '@/components/sections/Clients';
import ContactCta from '@/components/sections/ContactCta';
import ContactForm from '@/components/sections/ContactForm';
import Footer from '@/components/sections/Footer';
import EasterEgg from '@/components/sections/EasterEgg';

/**
 * ORDEM DA PÁGINA (one-page)
 * Hero → Posicionamento → Serviços → Detalhe dos serviços → Contador →
 * Cases (scroll horizontal) → Clientes → CTA de contato → Formulário →
 * Rodapé → Easter egg
 * Para reordenar seções, basta mexer na ordem abaixo.
 */
export default function HomePage() {
  return (
    <>
      <Hero />
      <Positioning />
      <Services />
      <ServiceDetails />
      <Counter />
      <Cases />
      <Clients />
      <ContactCta />
      <ContactForm />
      <Footer />
      <EasterEgg />
    </>
  );
}
