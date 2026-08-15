import Link from "next/link";
import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { abas } from "@/lib/navegacao";
import { linkWhatsApp, site } from "@/lib/site";

const atendimento = [
  { rotulo: "Segunda a sexta", valor: "8h às 18h" },
  { rotulo: "Sábado", valor: "8h às 12h" },
  { rotulo: "Domingo", valor: "Fechado" },
];

export function Footer() {
  return (
    <footer className="mt-24 bg-grafite text-fundo-cal">
      {/* Chamada final — a última chance de puxar a conversa. */}
      <section className="border-b border-fundo-cal/12">
        <div className="mx-auto grid w-full max-w-7xl gap-8 px-5 py-14 md:grid-cols-[1fr_auto] md:items-center md:px-10 md:py-20">
          <div>
            <p className="text-etiqueta text-madeira-mel uppercase">
              Fabricamos sob medida
            </p>
            <h2 className="text-display-md mt-3 max-w-[18ch] font-display text-fundo-cal">
              Envie a medida do seu espaço.
            </h2>
            <p className="text-corpo mt-4 max-w-[46ch] text-fundo-cal/75">
              Manda a foto e a medida no WhatsApp. A gente desenha a peça, fecha
              madeira e acabamento, e diz o preço.
            </p>
          </div>

          <a
            href={linkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            className="text-corpo inline-flex h-14 items-center justify-center gap-2 rounded-peca bg-madeira-mel px-8 font-medium text-grafite transition-colors duration-200 ease-suave hover:bg-madeira-mel-claro"
          >
            <IconeWhatsApp className="size-5" />
            Pedir orçamento
            <span className="sr-only">no WhatsApp (abre em nova aba)</span>
          </a>
        </div>
      </section>

      {/* Colunas de informação */}
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-5 py-14 md:grid-cols-4 md:px-10">
        <div>
          <p className="font-display text-display-sm text-fundo-cal">
            {site.nome}
          </p>
          <p className="text-etiqueta mt-2 text-fundo-cal/70 uppercase">
            Marcenaria e móveis sob medida
          </p>
          <p className="text-corpo-sm mt-4 max-w-[28ch] text-fundo-cal/70">
            {site.frase}
          </p>
        </div>

        <nav aria-label="Rodapé">
          <h2 className="text-etiqueta text-madeira-mel uppercase">Navegar</h2>
          <ul className="mt-4 space-y-2.5">
            {abas.map((aba) => (
              <li key={aba.href}>
                <Link
                  href={aba.href}
                  className="text-corpo-sm text-fundo-cal/75 underline decoration-fundo-cal/25 underline-offset-[6px] transition-colors duration-200 ease-suave hover:text-fundo-cal hover:decoration-madeira-mel"
                >
                  {aba.rotulo}
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        <div>
          <h2 className="text-etiqueta text-madeira-mel uppercase">Contato</h2>
          <ul className="mt-4 space-y-2.5">
            <li>
              <a
                href={linkWhatsApp()}
                target="_blank"
                rel="noopener noreferrer"
                className="text-corpo-sm inline-flex items-center gap-2 text-fundo-cal/75 underline decoration-fundo-cal/25 underline-offset-[6px] transition-colors duration-200 ease-suave hover:text-fundo-cal hover:decoration-madeira-mel"
              >
                <IconeWhatsApp className="size-4" />
                Orçamento no WhatsApp
              </a>
            </li>
            <li>
              <a
                href={site.instagram.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-corpo-sm text-fundo-cal/75 underline decoration-fundo-cal/25 underline-offset-[6px] transition-colors duration-200 ease-suave hover:text-fundo-cal hover:decoration-madeira-mel"
              >
                Instagram {site.instagram.usuario}
              </a>
            </li>
          </ul>

          <h2 className="text-etiqueta mt-7 text-madeira-mel uppercase">
            Atendimento
          </h2>
          <p className="text-corpo-sm mt-4 text-fundo-cal/75">
            {site.regiao}
            <br />
            Entrega e instalação na região.
          </p>
        </div>

        <div>
          <h2 className="text-etiqueta text-madeira-mel uppercase">Horário</h2>
          <ul className="mt-4 space-y-2.5">
            {atendimento.map((linha) => (
              <li
                key={linha.rotulo}
                className="text-corpo-sm flex justify-between gap-4 text-fundo-cal/75"
              >
                <span>{linha.rotulo}</span>
                <span className="text-fundo-cal">{linha.valor}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="border-t border-fundo-cal/12">
        <div className="mx-auto flex w-full max-w-7xl flex-col gap-2 px-5 py-6 text-fundo-cal/55 md:flex-row md:items-center md:justify-between md:px-10">
          <p className="text-corpo-sm">
            © {new Date().getFullYear()} {site.nome}. Todos os direitos
            reservados.
          </p>
          <p className="text-corpo-sm">Móveis feitos na nossa oficina.</p>
        </div>
      </div>
    </footer>
  );
}
