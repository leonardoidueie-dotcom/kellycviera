import type { Metadata } from 'next';
import Link from 'next/link';
import { site } from '@/site.config';

export const metadata: Metadata = {
  title: 'Política de privacidade',
  description: `Como a ${site.brand.name} trata os dados enviados pelo formulário do site.`,
  robots: { index: false, follow: true },
};

/**
 * PÁGINA DE POLÍTICA DE PRIVACIDADE (rascunho)
 * Texto-base para o formulário não apontar para lugar nenhum.
 * SUBSTITUA pelo texto revisado por quem cuida do jurídico da marca.
 */
export default function PrivacyPage() {
  return (
    <article className="container-page py-32">
      <p className="eyebrow mb-6 text-accent">Documento</p>
      <h1 className="max-w-[16ch] font-display text-huge">Política de privacidade</h1>

      <div className="mt-12 max-w-[62ch] space-y-6 text-base leading-relaxed text-paper/70">
        <p className="rounded-sm border border-accent/40 bg-accent/5 p-5 text-sm text-paper/80">
          <strong>Rascunho.</strong> Este texto é um ponto de partida e precisa ser revisado
          por um profissional antes de ir ao ar. Edite em{' '}
          <code>app/politica-de-privacidade/page.tsx</code>.
        </p>

        <h2 className="font-display text-2xl text-paper">Quais dados coletamos</h2>
        <p>
          Coletamos apenas o que você digita no formulário de contato: nome, e-mail,
          telefone (opcional), assunto e mensagem. Não usamos esses dados para nenhuma
          finalidade além de responder ao seu contato.
        </p>

        <h2 className="font-display text-2xl text-paper">Por quanto tempo guardamos</h2>
        <p>
          Mantemos as mensagens pelo tempo necessário para atender ao pedido e cumprir
          obrigações legais. Depois disso, os dados são apagados.
        </p>

        <h2 className="font-display text-2xl text-paper">Compartilhamento</h2>
        <p>
          Não vendemos nem cedemos seus dados. Eles podem passar por serviços de e-mail e
          hospedagem usados para operar o site, sempre limitados a essa finalidade.
        </p>

        <h2 className="font-display text-2xl text-paper">Seus direitos (LGPD)</h2>
        <p>
          Você pode pedir acesso, correção ou exclusão dos seus dados a qualquer momento
          pelo e-mail{' '}
          <a href={`mailto:${site.contact.email}`} className="link-underline text-accent">
            {site.contact.email}
          </a>
          .
        </p>

        <h2 className="font-display text-2xl text-paper">Responsável</h2>
        <p>
          {site.legal.companyName} — CNPJ {site.legal.cnpj} — {site.location.street},{' '}
          {site.location.district}, {site.location.city}/{site.location.state}.
        </p>
      </div>

      <Link href="/" className="btn mt-14 inline-flex" data-cursor="link">
        ← Voltar para o site
      </Link>
    </article>
  );
}
