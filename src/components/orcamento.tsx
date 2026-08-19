"use client";

import { useMemo, useState } from "react";

import { linkWhatsApp, loja, produtos } from "@/lib/loja";

/**
 * Pedido de orçamento sem servidor: o formulário monta a mensagem e abre o
 * WhatsApp da loja já com tudo escrito. Nada é enviado para lugar nenhum —
 * o visitante confere o texto antes de mandar.
 */
export default function Orcamento() {
  const [nome, setNome] = useState("");
  const [peca, setPeca] = useState(produtos[0]?.nome ?? "");
  const [medidas, setMedidas] = useState("");
  const [observacoes, setObservacoes] = useState("");

  const mensagem = useMemo(() => {
    const linhas = [
      `Olá! Gostaria de um orçamento na ${loja.nome}.`,
      "",
      nome && `Nome: ${nome}`,
      `Peça: ${peca}`,
      medidas && `Medidas desejadas: ${medidas}`,
      observacoes && `Observações: ${observacoes}`,
    ].filter(Boolean);
    return linhas.join("\n");
  }, [nome, peca, medidas, observacoes]);

  const campo =
    "w-full rounded-md border border-grafite-borda bg-grafite px-4 py-3 text-sm text-areia placeholder:text-areia/25 focus:border-dourado/60 focus:outline-none";
  const rotulo =
    "mb-2 block text-[10px] uppercase tracking-[0.25em] text-areia/40";

  return (
    <section id="orcamento" className="border-y border-grafite-borda bg-grafite-claro/40">
      <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 md:grid-cols-2 md:py-28">
        <div>
          <p className="text-[10px] uppercase tracking-[0.4em] text-dourado/70">
            Orçamento
          </p>
          <h2 className="mt-3 font-display text-3xl text-areia md:text-5xl">
            Conte o que você precisa
          </h2>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-areia/60">
            Toda peça é feita sob medida, então o preço depende da madeira, do
            tamanho e do acabamento. Preencha ao lado e o WhatsApp abre com a
            mensagem pronta — você confere antes de enviar.
          </p>

          <dl className="mt-10 space-y-5 text-sm">
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-areia/35">
                Prazo de produção
              </dt>
              <dd className="mt-1 text-areia/70">
                Combinado na hora do orçamento, conforme a peça.
              </dd>
            </div>
            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-areia/35">
                Atendimento
              </dt>
              <dd className="mt-1 text-areia/70">{loja.horario}</dd>
            </div>
            {loja.endereco && (
              <div>
                <dt className="text-[10px] uppercase tracking-[0.25em] text-areia/35">
                  Loja
                </dt>
                <dd className="mt-1 text-areia/70">{loja.endereco}</dd>
              </div>
            )}

            <div>
              <dt className="text-[10px] uppercase tracking-[0.25em] text-areia/35">
                WhatsApp
              </dt>
              <dd className="mt-1 text-areia/70">{loja.telefone}</dd>
            </div>
          </dl>
        </div>

        <form
          className="rounded-lg border border-grafite-borda bg-grafite p-6 md:p-8"
          onSubmit={(e) => {
            e.preventDefault();
            window.open(linkWhatsApp(mensagem), "_blank", "noopener");
          }}
        >
          <div className="space-y-5">
            <div>
              <label className={rotulo} htmlFor="nome">
                Seu nome
              </label>
              <input
                id="nome"
                className={campo}
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Como podemos te chamar"
              />
            </div>

            <div>
              <label className={rotulo} htmlFor="peca">
                Peça de interesse
              </label>
              <select
                id="peca"
                className={campo}
                value={peca}
                onChange={(e) => setPeca(e.target.value)}
              >
                {produtos.map((p) => (
                  <option key={p.id} value={p.nome}>
                    {p.nome}
                  </option>
                ))}
                <option value="Outra peça">Outra peça</option>
              </select>
            </div>

            <div>
              <label className={rotulo} htmlFor="medidas">
                Medidas desejadas
              </label>
              <input
                id="medidas"
                className={campo}
                value={medidas}
                onChange={(e) => setMedidas(e.target.value)}
                placeholder="Ex.: 240 × 100 cm"
              />
            </div>

            <div>
              <label className={rotulo} htmlFor="obs">
                Observações
              </label>
              <textarea
                id="obs"
                rows={3}
                className={`${campo} resize-none`}
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Cor, acabamento, prazo, cidade de entrega…"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-7 w-full rounded-full bg-dourado px-6 py-3 text-[11px] uppercase tracking-[0.25em] text-grafite transition hover:bg-dourado-claro"
          >
            Enviar pelo WhatsApp
          </button>

          <p className="mt-3 text-center text-[10px] leading-relaxed text-areia/30">
            Abre o WhatsApp com o texto pronto. Nada é enviado sem você mandar.
          </p>
        </form>
      </div>
    </section>
  );
}
