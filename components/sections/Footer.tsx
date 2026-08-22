'use client';

import { site } from '@/site.config';
import { useLenis } from '@/components/providers/SmoothScroll';
import Logo from '@/components/ui/Logo';
import LiveClock from '@/components/ui/LiveClock';

/** RODAPÉ — contatos, navegação e a assinatura gigante da marca. */
export default function Footer() {
  const { scrollTo } = useLenis();
  const year = new Date().getFullYear();

  return (
    <footer className="relative border-t border-paper/10 pt-20" aria-labelledby="rodape-titulo">
      <h2 id="rodape-titulo" className="sr-only">
        Rodapé
      </h2>

      <div className="container-page grid gap-12 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo className="h-12 w-auto text-accent" />
          <p className="mt-6 max-w-[34ch] text-sm leading-relaxed text-paper/55">
            {site.brand.tagline} em {site.location.city}/{site.location.state}. {site.legal.credits}
          </p>
          <LiveClock className="mt-6" />
        </div>

        <nav aria-label="Navegação do rodapé">
          <p className="eyebrow mb-5">Navegar</p>
          <ul className="space-y-3">
            {site.menu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault();
                    scrollTo(item.href, -80);
                  }}
                  data-cursor="link"
                  className="link-underline text-sm text-paper/70 hover:text-paper"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <p className="eyebrow mb-5">Contato</p>
          <ul className="space-y-3 text-sm text-paper/70">
            <li>
              <a href={site.contact.phoneHref} className="link-underline" data-cursor="link">
                {site.contact.phoneLabel}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.contact.email}`} className="link-underline" data-cursor="link">
                {site.contact.email}
              </a>
            </li>
            <li>
              <a href={site.contact.instagram} target="_blank" rel="noreferrer" className="link-underline" data-cursor="link">
                {site.contact.instagramLabel}
              </a>
            </li>
            <li>
              <a href={site.location.mapUrl} target="_blank" rel="noreferrer" className="link-underline" data-cursor="link">
                {site.location.street} — {site.location.district}
              </a>
            </li>
          </ul>
        </div>
      </div>

      {/* Assinatura gigante */}
      <div className="container-page mt-20 overflow-hidden">
        <p aria-hidden="true" className="whitespace-nowrap font-display text-mega leading-none text-outline">
          {site.brand.name}
        </p>
      </div>

      <div className="container-page flex flex-wrap items-center justify-between gap-4 border-t border-paper/10 py-8 text-xs text-paper/40">
        <p>
          © {year} {site.legal.companyName} · CNPJ {site.legal.cnpj}
        </p>
        <a href={site.legal.privacyUrl} className="link-underline" data-cursor="link">
          Política de privacidade
        </a>
      </div>
    </footer>
  );
}
