import { serve } from "https://deno.land/std@0.141.0/http/mod.ts";
import { serveDir } from "https://deno.land/std@0.141.0/http/file_server.ts";

const BASE_PATH = "./src";
const API_BASE = "https://list-api.eito.workers.dev/api/";
const API_PROXY_BASE = "/api/";

const handler = async (request: Request): Promise<Response> => {
  const { pathname } = new URL(request.url);

  // proxyしたいパスならAPIの方叩かせる
  if (pathname.startsWith(API_PROXY_BASE)) {
    const path = pathname.replace(API_PROXY_BASE, "");
    const res = await fetch(`${API_BASE}${path}`);
    return Promise.resolve(Response.json(await res.json()));
  }

  // /で終わる場合は index.htmlを返す
  if (pathname.endsWith("/")) {
    try {
      const html = Deno.readFileSync(`${BASE_PATH}${pathname}index.html`);
      return Promise.resolve(new Response(html));
    } catch {
      return Promise.resolve(new Response("404", { status: 404 }));
    }
  }

  // BASE_PATHにあるファイルを返す
  return serveDir(request, {
    fsRoot: BASE_PATH,
  });
};

await serve(handler, { port: 8600 });
