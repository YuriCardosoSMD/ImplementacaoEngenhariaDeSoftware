import { useEffect, useState } from 'react';

export type Rota = 'painel' | 'participantes';

/** Endereços usados nos links (<a href>) da aplicação. */
export const ROTAS = {
  painel: '#/',
  participantes: '#/participantes',
} as const;

function lerRota(): Rota {
  const caminho = window.location.hash.replace(/^#\/?/, '').split('?')[0];
  return caminho === 'participantes' ? 'participantes' : 'painel';
}

/**
 * Roteamento simples baseado no hash da URL (#/participantes).
 * Não exige dependências extras nem configuração no servidor,
 * funcionando em hospedagens estáticas (GitHub Pages, Netlify etc.).
 */
export function useHashRoute(): Rota {
  const [rota, setRota] = useState<Rota>(lerRota);

  useEffect(() => {
    const aoMudarHash = () => {
      setRota(lerRota());
      window.scrollTo(0, 0);
    };
    window.addEventListener('hashchange', aoMudarHash);
    return () => window.removeEventListener('hashchange', aoMudarHash);
  }, []);

  return rota;
}
