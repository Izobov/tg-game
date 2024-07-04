import axios from "axios";
import { parse } from "json-bigint";

export const a = axios.create({
  baseURL: "http://localhost:3000",
  transformResponse: (res) => parse(res),
});

export async function post(path, data, conf = {}) {
  return a.post(path, data, {
    headers: {
      "Content-Type": "application/json",
    },
    ...conf,
  });
}

export async function get(path) {
  return a.get(path);
}
