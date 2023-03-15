import { uuid } from "@cfworker/uuid";
import { Env } from "./types";
import { createErrorResponse, successResponse } from "./util";

interface CreateTodoParams {
  name: string;
  icon: string;
}

const createTodo = async (request: Request, env: Env) => {
  const requestJson = await request.json<CreateTodoParams>();
  if (!requestJson.name || !requestJson.icon) {
    const res = createErrorResponse("P-500", "パラメータが不足");
    return Response.json(res);
  }
  const id = uuid();
  const result = await env.DB.prepare(
    `insert into lists values('${id}', '${requestJson.name}', '${requestJson.icon}', '');`
  ).all();
  const res = result.success
    ? successResponse
    : createErrorResponse("D-500", "エラー");
  return Response.json(res);
};

const getTodos = async (env: Env) => {
  const { results } = await env.DB.prepare(
    "SELECT id, name, icon FROM lists"
  ).all();
  return Response.json(results);
};

const getTodoFromId = async (id: string, env: Env) => {
  const { results } = await env.DB.prepare(
    `select * from lists where id = '${id}'`
  ).all();
  const result = results?.[0] as any;
  if (!result) {
    const res = createErrorResponse("D-404", "データがありません");
    return Response.json(res);
  }
  if (result.contents) {
    result.contents = JSON.parse(result.contents);
  }
  return Response.json(results);
};

const updateTodoContents = async (id: string, contents: object, env: Env) => {
  if (!contents) {
    const res = createErrorResponse("P-500", "パラメータが不足");
    return Response.json(res);
  }
  const stringRequestJson = JSON.stringify(contents);
  const result = await env.DB.prepare(
    `update lists set contents = '${stringRequestJson}' where id = '${id}'`
  ).all();
  const res = result.success
    ? successResponse
    : createErrorResponse("D-500", "エラー");
  return Response.json(res);
};

const deleteTodoFromId = async (id: string, env: Env) => {
  const result = await env.DB.prepare(
    `delete from lists where id = '${id}'`
  ).all();
  const res = result.success
    ? successResponse
    : createErrorResponse("D-500", "エラー");

  return Response.json(res);
};

const deleteAllTodo = async (env: Env) => {
  const result = await env.DB.prepare(`delete from lists`).all();
  const res = result.success
    ? successResponse
    : createErrorResponse("D-500", "エラー");

  return Response.json(res);
};

export {
  createTodo,
  getTodos,
  getTodoFromId,
  updateTodoContents,
  deleteTodoFromId,
  deleteAllTodo,
};
