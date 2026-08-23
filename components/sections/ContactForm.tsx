'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { gsap } from '@/lib/gsap';
import { useReducedMotion } from '@/lib/hooks';
import { site } from '@/site.config';
import { cn } from '@/lib/utils';

type Fields = {
  nome: string;
  email: string;
  telefone: string;
  assunto: string;
  mensagem: string;
  privacidade: boolean;
};

type Errors = Partial<Record<keyof Fields, string>>;

const INITIAL: Fields = {
  nome: '',
  email: '',
  telefone: '',
  assunto: site.services[0]?.title ?? '',
  mensagem: '',
  privacidade: false,
};

/** Regras de validação — mexa aqui para mudar mensagens ou obrigatoriedade. */
function validate(fields: Fields): Errors {
  const errors: Errors = {};

  if (fields.nome.trim().length < 2) errors.nome = 'Escreve seu nome, por favor.';

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(fields.email.trim()))
    errors.email = 'Esse e-mail parece incompleto.';

  if (fields.telefone.trim() && fields.telefone.replace(/\D/g, '').length < 10)
    errors.telefone = 'Telefone com DDD, por favor.';

  if (fields.mensagem.trim().length < 10)
    errors.mensagem = 'Conta um pouco mais — pelo menos 10 caracteres.';

  if (!fields.privacidade)
    errors.privacidade = 'Precisamos do seu aceite para responder.';

  return errors;
}

/**
 * FORMULÁRIO DE CONTATO
 * - Validação inline (no blur e no envio) com marcador de erro por campo.
 * - Estado de envio e mensagem de sucesso animada.
 * - Checkbox de política de privacidade obrigatório.
 * ONDE PLUGAR O ENVIO DE VERDADE: app/api/contact/route.ts
 */
export default function ContactForm() {
  const [fields, setFields] = useState<Fields>(INITIAL);
  const [errors, setErrors] = useState<Errors>({});
  const [touched, setTouched] = useState<Partial<Record<keyof Fields, boolean>>>({});
  const [status, setStatus] = useState<'idle' | 'sending' | 'success' | 'error'>('idle');

  const successRef = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();

  useEffect(() => {
    if (status !== 'success' || !successRef.current) return;
    if (reduced) {
      gsap.set(successRef.current, { autoAlpha: 1, y: 0 });
      return;
    }
    gsap.fromTo(
      successRef.current,
      { autoAlpha: 0, y: 30, scale: 0.98 },
      { autoAlpha: 1, y: 0, scale: 1, duration: 0.8, ease: 'expo.out' },
    );
  }, [status, reduced]);

  const update = (key: keyof Fields, value: string | boolean) => {
    const next = { ...fields, [key]: value } as Fields;
    setFields(next);
    if (touched[key]) setErrors(validate(next));
  };

  const blur = (key: keyof Fields) => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors(validate(fields));
  };

  const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(fields);
    setErrors(found);
    setTouched({
      nome: true,
      email: true,
      telefone: true,
      assunto: true,
      mensagem: true,
      privacidade: true,
    });

    if (Object.keys(found).length > 0) {
      // Leva o foco para o primeiro campo com erro (acessibilidade).
      const first = Object.keys(found)[0];
      document.getElementById(first)?.focus();
      return;
    }

    setStatus('sending');
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(fields),
      });
      if (!response.ok) throw new Error('Falha no envio');
      setStatus('success');
      setFields(INITIAL);
      setTouched({});
    } catch {
      setStatus('error');
    }
  };

  const fieldClass = (key: keyof Fields) =>
    cn(
      'w-full border-b bg-transparent px-0 py-4 font-sans text-base text-paper placeholder:text-paper/30',
      'transition-colors duration-300 focus:outline-none',
      errors[key] && touched[key]
        ? 'border-accent'
        : 'border-paper/20 focus:border-accent',
    );

  const ErrorMark = ({ name }: { name: keyof Fields }) =>
    errors[name] && touched[name] ? (
      <p id={`${name}-erro`} role="alert" className="mt-2 flex items-center gap-2 text-sm text-accent">
        <span aria-hidden="true">▲</span>
        {errors[name]}
      </p>
    ) : null;

  return (
    <section id="formulario" className="border-t border-paper/10 py-24 sm:py-32" aria-labelledby="form-titulo">
      <div className="container-page grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
        <div>
          <h2 id="form-titulo" className="font-display text-huge">
            Conta o<br />
            <span className="text-accent">projeto</span>
          </h2>
          <p className="mt-6 max-w-[38ch] text-base leading-relaxed text-paper/60">
            Preencha aí do lado. Se preferir voz e áudio de 4 minutos, o{' '}
            <a href={site.contact.whatsappHref} target="_blank" rel="noreferrer" className="link-underline text-accent">
              WhatsApp
            </a>{' '}
            também funciona.
          </p>
        </div>

        {status === 'success' ? (
          <div
            ref={successRef}
            role="status"
            className="flex flex-col items-start justify-center rounded-sm border border-accent/40 bg-accent/5 p-10 opacity-0"
          >
            <p className="eyebrow text-accent">Mensagem enviada</p>
            <p className="mt-5 font-display text-big">Recebemos. Já já a gente responde.</p>
            <p className="mt-4 max-w-[42ch] text-paper/60">
              Se for urgente, chama no WhatsApp que a gente adianta.
            </p>
            <button type="button" onClick={() => setStatus('idle')} className="btn mt-8" data-cursor="link">
              Enviar outra mensagem
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} noValidate className="grid gap-8 sm:grid-cols-2">
            <div className="sm:col-span-1">
              <label htmlFor="nome" className="eyebrow mb-2 block">
                Nome *
              </label>
              <input
                id="nome"
                name="nome"
                type="text"
                autoComplete="name"
                value={fields.nome}
                onChange={(e) => update('nome', e.target.value)}
                onBlur={() => blur('nome')}
                aria-invalid={Boolean(errors.nome && touched.nome)}
                aria-describedby={errors.nome && touched.nome ? 'nome-erro' : undefined}
                placeholder="Como te chamam"
                className={fieldClass('nome')}
              />
              <ErrorMark name="nome" />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="email" className="eyebrow mb-2 block">
                E-mail *
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={fields.email}
                onChange={(e) => update('email', e.target.value)}
                onBlur={() => blur('email')}
                aria-invalid={Boolean(errors.email && touched.email)}
                aria-describedby={errors.email && touched.email ? 'email-erro' : undefined}
                placeholder="voce@email.com"
                className={fieldClass('email')}
              />
              <ErrorMark name="email" />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="telefone" className="eyebrow mb-2 block">
                Telefone
              </label>
              <input
                id="telefone"
                name="telefone"
                type="tel"
                autoComplete="tel"
                value={fields.telefone}
                onChange={(e) => update('telefone', e.target.value)}
                onBlur={() => blur('telefone')}
                aria-invalid={Boolean(errors.telefone && touched.telefone)}
                aria-describedby={errors.telefone && touched.telefone ? 'telefone-erro' : undefined}
                placeholder="(00) 90000-0000"
                className={fieldClass('telefone')}
              />
              <ErrorMark name="telefone" />
            </div>

            <div className="sm:col-span-1">
              <label htmlFor="assunto" className="eyebrow mb-2 block">
                Assunto
              </label>
              <div className="relative">
              <select
                id="assunto"
                name="assunto"
                value={fields.assunto}
                onChange={(e) => update('assunto', e.target.value)}
                className={cn(fieldClass('assunto'), 'appearance-none')}
              >
                {site.services.map((service) => (
                  <option key={service.id} value={service.title} className="bg-ink text-paper">
                    {service.title}
                  </option>
                ))}
                <option value="Outro" className="bg-ink text-paper">
                  Outro assunto
                </option>
              </select>
                <span aria-hidden="true" className="pointer-events-none absolute right-1 top-1/2 -translate-y-1/2 text-accent">
                  ▾
                </span>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="mensagem" className="eyebrow mb-2 block">
                Mensagem *
              </label>
              <textarea
                id="mensagem"
                name="mensagem"
                rows={4}
                value={fields.mensagem}
                onChange={(e) => update('mensagem', e.target.value)}
                onBlur={() => blur('mensagem')}
                aria-invalid={Boolean(errors.mensagem && touched.mensagem)}
                aria-describedby={errors.mensagem && touched.mensagem ? 'mensagem-erro' : undefined}
                placeholder="Quantidade, prazo, referência, o que já tem pronto…"
                className={cn(fieldClass('mensagem'), 'resize-none')}
              />
              <ErrorMark name="mensagem" />
            </div>

            <div className="sm:col-span-2">
              <label htmlFor="privacidade" className="flex cursor-pointer items-start gap-4 text-sm text-paper/70">
                <input
                  id="privacidade"
                  name="privacidade"
                  type="checkbox"
                  checked={fields.privacidade}
                  onChange={(e) => update('privacidade', e.target.checked)}
                  onBlur={() => blur('privacidade')}
                  aria-invalid={Boolean(errors.privacidade && touched.privacidade)}
                  aria-describedby={errors.privacidade && touched.privacidade ? 'privacidade-erro' : undefined}
                  className={cn(
                    'checkbox-brand mt-0.5 h-5 w-5 shrink-0 appearance-none border bg-transparent transition-colors duration-200',
                    'checked:border-accent checked:bg-accent',
                    errors.privacidade && touched.privacidade ? 'border-accent' : 'border-paper/30',
                  )}
                />
                <span>
                  Li e aceito a{' '}
                  <a href={site.legal.privacyUrl} className="link-underline text-accent">
                    política de privacidade
                  </a>{' '}
                  e autorizo o contato sobre este pedido. *
                </span>
              </label>
              <ErrorMark name="privacidade" />
            </div>

            <div className="flex flex-wrap items-center gap-6 sm:col-span-2">
              <button
                type="submit"
                disabled={status === 'sending'}
                data-cursor="link"
                className={cn('btn btn-solid', status === 'sending' && 'pointer-events-none opacity-60')}
              >
                {status === 'sending' ? 'Enviando…' : 'Enviar mensagem'}
                <span aria-hidden="true">→</span>
              </button>

              {status === 'error' && (
                <p role="alert" className="text-sm text-accent">
                  Deu ruim no envio. Tenta de novo ou chama no WhatsApp.
                </p>
              )}
              <p className="text-xs text-paper/40">* campos obrigatórios</p>
            </div>
          </form>
        )}
      </div>
    </section>
  );
}
