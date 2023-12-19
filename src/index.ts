/**
 *
 * @name Neat-System
 * @author Neat Realm
 * @license MIT
 * @copyright (c) 2023 NeatRealm and contributors
 *
 */

import { error } from "./modules/logger.js";
import { config } from "dotenv"; config()
import { Client } from "discord.js";

process.on("unhandledRejection", (reason) => error(String(reason)))
process.on("uncaughtException", (err) => error(String(err)))
process.on("uncaughtExceptionMonitor", (err) => error(String(err)))

const client = new Client({ intents: [] });

client.login(process.env.DISCORD_TOKEN)
