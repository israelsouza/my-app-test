import { Router } from 'itty-router';
import { getAssetFromKV } from '@cloudflare/kv-asset-handler';

// Em um projeto Worker, o manifest de assets é importado assim.
import manifestJSON from '__STATIC_CONTENT_MANIFEST';
const assetManifest = JSON.parse(manifestJSON);

// Cria uma nova instância do roteador
const router = Router();

// =================================================================
//  ROTAS DA SUA API
//  Toda a sua lógica de backend viverá aqui.
// =================================================================

router.get('/api/hello', () => {
	const data = {
		message: 'Olá do seu novo Cloudflare Worker!',
		timestamp: new Date().toISOString(),
	};
	return new Response(JSON.stringify(data), {
		headers: { 'Content-Type': 'application/json' },
	});
});

// =================================================================
//  MANIPULADOR DE ARQUIVOS ESTÁTICOS (SEU APP REACT)
//  Esta parte é responsável por servir o frontend.
// =================================================================

async function handleAsset(event) {
	// A opção mapRequestToAsset é crucial para SPAs (Single Page Applications).
	// Se uma rota como /profile não for encontrada como um arquivo,
	// ela servirá o index.html para que o roteador do React possa assumir.
	const options = {
		mapRequestToAsset: (req) => {
			const url = new URL(req.url);
			// Se o caminho não tiver uma extensão de arquivo, sirva o index.html
			if (!url.pathname.split('/').pop().includes('.')) {
				return new Request(`${url.origin}/index.html`, req);
			}
			return req;
		},
	};

	return await getAssetFromKV(event, {
		ASSET_NAMESPACE: __STATIC_CONTENT, // Note que o binding é o mesmo do wrangler.jsonc
		ASSET_MANIFEST: assetManifest,
		...options,
	});
}

// O ponto de entrada do Worker. Ele tenta corresponder a uma rota da API primeiro,
// e se não encontrar, tenta servir um arquivo estático.
export default {
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		if (url.pathname.startsWith('/api/')) {
			return router.handle(request, env, ctx);
		}
		return handleAsset({ request, waitUntil: ctx.waitUntil.bind(ctx) });
	},
};
