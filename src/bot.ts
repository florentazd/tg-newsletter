import * as dotenv from "dotenv"
dotenv.config()

import TelegramBot from "node-telegram-bot-api";

const bot = new TelegramBot(process.env.bot_token!, { polling: true })

export default bot