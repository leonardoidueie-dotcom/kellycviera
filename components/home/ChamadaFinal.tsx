import { IconeWhatsApp } from "@/components/ui/IconeWhatsApp";
import { linkWhatsApp } from "@/lib/site";

/**
 * Fechamento da home. Em claro de propósito: o rodapé que vem logo abaixo é
 * escuro, e o site termina numa passagem clara → escura em vez de dois blocos
 * de chamada iguais empilhados.
 */
export function ChamadaFinal() {
  return (
    <section className="bg-areia-clara">
      <div className="mx-auto w-full max-w-4xl px-5 py-20 text-center md:px-10 md:py-28">
        <p className="text-etiqueta text-nogueira-suave uppercase">
          Orçamento sem compromisso
        </p>
        <h2 className="text-display-lg mt-4 font-display text-nogueira">
          Tem um espaço em mente? Manda a medida.
        </h2>
        <p className="text-corpo-lg mx-auto mt-5 max-w-[48ch] text-grafite/80">
          Uma foto do cômodo e a medida aproximada já bastam para a gente
          começar. Você recebe o desenho da peça antes de fechar qualquer coisa.
        </p>

        <a
          href={linkWhatsApp()}
          target="_blank"
          rel="noopener noreferrer"
          className="text-corpo mt-10 inline-flex h-14 items-center justify-center gap-2 rounded-peca bg-madeira-mel px-8 font-medium text-grafite transition-colors duration-200 ease-suave hover:bg-madeira-mel-claro"
        >
          <IconeWhatsApp className="size-5" />
          Pedir orçamento no WhatsApp
          <span className="sr-only">(abre em nova aba)</span>
        </a>
      </div>
    </section>
  );
}
