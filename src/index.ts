/**
 *
 * @name Neat-System
 * @author Neat Realm
 * @license MIT
 * @copyright (c) 2023 NeatRealm and contributors
 *
 */

import { config } from "dotenv"; config()
import { Client } from "discord.js";

const client = new Client({ intents: [] });

client.login(process.env.DISCORD_TOKEN)
