"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bot_1 = __importDefault(require("./bot"));
bot_1.default.on("message", (message) => {
    const userId = message.chat.id;
    bot_1.default.sendMessage(userId, "Hello");
});
