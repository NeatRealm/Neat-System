import { config } from "dotenv"; config()
import { WebhookClient } from "discord.js"

function getTime() {
  return `[${new Date().toLocaleTimeString()}] `
}

const logWebhook = process.env.LOG_WEBHOOK_URL ?
  new WebhookClient({ url: process.env.LOG_WEBHOOK_URL }) : undefined
const warnWebhook = process.env.WARN_WEBHOOK_URL ?
  new WebhookClient({ url: process.env.WARN_WEBHOOK_URL }) : undefined
const errorWebhook = process.env.ERROR_WEBHOOK_URL ?
  new WebhookClient({ url: process.env.ERROR_WEBHOOK_URL }) : undefined

export function log(message: string) {
  console.log(getTime() + message)
  if (message) logWebhook?.send(getTime() + message)
}
export function warn(message: string) {
  console.warn(getTime() + message);
  if (message) warnWebhook?.send(getTime() + message)
}
export function error(message: string) {
  console.error(getTime() + message);
  if (message) errorWebhook?.send(getTime() + message).catch((r) => console.error(r))
}
