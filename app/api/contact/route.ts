import { NextResponse } from 'next/server';

/**
 * ENDPOINT DO FORMULÁRIO
 * Hoje ele só valida e responde OK (o envio real não está plugado).
 *
 * PARA PLUGAR DE VERDADE, escolha um caminho e substitua o bloco marcado:
 *  a) E-mail transacional (Resend, SendGrid, Postmark...)
 *  b) Webhook (Zapier / Make / n8n)
 *  c) CRM ou planilha
 * Guarde as chaves em variáveis de ambiente (.env.local), nunca no código.
 */

type Payload = {
  nome?: string;
  email?: string;
  telefone?: string;
  assunto?: string;
  mensagem?: string;
  privacidade?: boolean;
};

export async function POST(request: Request) {
  let data: Payload;

  try {
    data = (await request.json()) as Payload;
  } catch {
    return NextResponse.json({ ok: false, error: 'JSON inválido.' }, { status: 400 });
  }

  const nome = data.nome?.trim() ?? '';
  const email = data.email?.trim() ?? '';
  const mensagem = data.mensagem?.trim() ?? '';

  // Validação de servidor (a do navegador pode ser burlada).
  if (nome.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(email) || mensagem.length < 10) {
    return NextResponse.json({ ok: false, error: 'Dados incompletos.' }, { status: 422 });
  }

  if (!data.privacidade) {
    return NextResponse.json(
      { ok: false, error: 'É preciso aceitar a política de privacidade.' },
      { status: 422 },
    );
  }

  // ------------------------------------------------------------------
  // TROQUE ESTE BLOCO PELO ENVIO REAL.
  // Exemplo com Resend:
  //   const resend = new Resend(process.env.RESEND_API_KEY);
  //   await resend.emails.send({ from, to, subject, text });
  // ------------------------------------------------------------------
  console.info('[contato] nova mensagem', {
    nome,
    email,
    assunto: data.assunto,
    telefone: data.telefone,
  });

  return NextResponse.json({ ok: true });
}
