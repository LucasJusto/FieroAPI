import { randomUUID } from "node:crypto";

export default function uuidV4(): string {
  return randomUUID();
}