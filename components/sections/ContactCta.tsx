'use client';

import WordReveal from '@/components/ui/WordReveal';
import { site } from '@/site.config';

/** CTA DE CONTATO — telefone, WhatsApp e e-mail em destaque, antes do formulário. */
export default function ContactCta() {
  return (
    <section id="contato" className="py-24 sm:py-32" aria-labelledby="contato-titulo">
      <div className="container-page">
        <p className="eyebrow mb-8">(04) Bora fazer</p>

        <WordReveal
          as="h2"
          text="Tem um drop na cabeça? Traz que a gente costura."
          stagger={0.05}
          className="max-w-[16ch] font-display text-mega"
        />
        <h2 id="contato-titulo" className="sr-only">
          Contato
        </h2>

        <div className="mt-14 grid gap-10 border-t border-paper/10 pt-10 md:grid-cols-3">
          <div>
            <p className="eyebrow mb-3">Telefone</p>
            <a href={site.contact.phoneHref} className="link-underline font-display text-2xl" data-cursor="link">
              {site.contact.phoneLabel}
            </a>
            <p className="mt-3 text-sm text-paper/50">{site.contact.openingHours}</p>
          </div>

          <div>
            <p className="eyebrow mb-3">WhatsApp</p>
            <a
              href={site.contact.whatsappHref}
              target="_blank"
              rel="noreferrer"
              className="link-underline font-display text-2xl text-accent"
              data-cursor="link"
            >
              Chamar no WhatsApp ↗
            </a>
            <p className="mt-3 text-sm text-paper/50">Resposta no mesmo dia útil.</p>
          </div>

          <div>
            <p className="eyebrow mb-3">E-mail</p>
            <a href={`mailto:${site.contact.email}`} className="link-underline font-display text-2xl" data-cursor="link">
              {site.contact.email}
            </a>
            <p className="mt-3 text-sm text-paper/50">
              {site.location.street} — {site.location.district}, {site.location.city}/{site.location.state}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
