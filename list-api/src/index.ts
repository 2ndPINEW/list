import {
  createTodo,
  getTodos,
  getTodoFromId,
  updateTodoContents,
  deleteTodoFromId,
} from "./todo";
import { Env } from "./types";
import { createErrorResponse } from "./util";

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const { pathname } = new URL(request.url);

    if (pathname === "/api/todos/create" && request.method === "POST") {
      return createTodo(request, env);
    }

    if (pathname === "/api/todos") {
      return getTodos(env);
    }

    // /api/todos/{id}
    if (pathname.startsWith("/api/todos/")) {
      const id = pathname.replace("/api/todos/", "");
      if (!id) {
        const res = createErrorResponse("P-500", "IDが指定されていません");
        return Response.json(res);
      }

      if (request.method === "GET") {
        return getTodoFromId(id, env);
      }

      if (request.method === "POST") {
        const requestJson = await request.json<any>();
        return updateTodoContents(id, requestJson, env);
      }

      if (request.method === "DELETE") {
        return deleteTodoFromId(id, env);
      }
    }

    return new Response("Not found", { status: 404 });
  },
};
