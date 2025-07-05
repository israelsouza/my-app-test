/**
 * Este é um roteador "catch-all" para a nossa API.
 * Ele captura todas as requisições para /api/*
 *
 * @param {object} context - O contexto da requisição.
 * @returns {Response}
 */
export function onRequest(context) {
  const { request, params } = context;
  const url = new URL(request.url);

  // O `params.path` contém o array de segmentos da URL após /api/
  // Ex: /api/hello -> params.path = ["hello"]
  // Ex: /api/users/123 -> params.path = ["users", "123"]
  const path = params.path.join('/');

  // Lógica de roteamento simples
  if (path === 'hello' && request.method === 'GET') {
    const data = { message: 'Olá da rota /api/hello!' };
    return Response.json(data);
  }

  if (path === 'goodbye' && request.method === 'GET') {
    const data = { message: 'Até mais da rota /api/goodbye!' };
    return Response.json(data);
  }

  // Se nenhuma rota corresponder, retorna 404
  return new Response(`A rota da API '/api/${path}' não foi encontrada.`, { status: 404 });
}