import { linkWhatsApp, loja, menu } from "@/lib/loja";
import Logo from "./logo";

export default function SiteFooter() {
  return (
    <footer className="border-t border-grafite-borda">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-16 md:grid-cols-3">
        <div>
          <div className="flex items-center gap-3">
            <Logo className="h-12 w-12" />
            <div>
              <p className="font-display text-xl text-areia">{loja.nome}</p>
              <p className="text-[10px] uppercase tracking-[0.2em] text-areia/35">
                {loja.chamada}
              </p>
            </div>
          </div>

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-areia/50">
            Madeira maciça e de demolição, trabalhada à mão. Peças únicas,
            feitas sob medida.
          </p>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-dourado/70">
            Navegar
          </p>
          <ul className="mt-4 space-y-2">
            {menu.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-areia/60 transition hover:text-dourado"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-[10px] uppercase tracking-[0.25em] text-dourado/70">
            Contato
          </p>
          <ul className="mt-4 space-y-3 text-sm text-areia/60">
            <li>
              <a
                href={linkWhatsApp(`Olá! Vim pelo site da ${loja.nome}.`)}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-dourado"
              >
                {loja.telefone}
              </a>
            </li>
            <li>
              <a
                href={`https://instagram.com/${loja.instagram}`}
                target="_blank"
                rel="noopener noreferrer"
                className="transition hover:text-dourado"
              >
                @{loja.instagram}
              </a>
            </li>
            {loja.email && (
              <li>
                <a
                  href={`mailto:${loja.email}`}
                  className="transition hover:text-dourado"
                >
                  {loja.email}
                </a>
              </li>
            )}
            <li className="pt-2 leading-relaxed text-areia/45">
              {loja.endereco && (
                <>
                  {loja.endereco}
                  <br />
                </>
              )}
              {loja.horario}
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-grafite-borda">
        <p className="mx-auto max-w-6xl px-6 py-6 text-[10px] uppercase tracking-[0.2em] text-areia/25">
          © {new Date().getFullYear()} {loja.nome}
        </p>
      </div>
    </footer>
  );
}
