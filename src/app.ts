import bot from "./bot"
import { register, isUserRegistered } from "./lib/register"

bot.onText(/\/start/, async message => {
    const chatId = message.chat.id;
    const userId = message.from?.id

    const status = await isUserRegistered(userId!)
    //La premiere fois que l'utilisateur evnoie une requête au bot, on verifie si il est enréfister
    if (!status) {
        if (await register(userId!)) {
            await bot.sendMessage(chatId, "Inscription éffectuée avec succès 🟩")
            startReply(bot, chatId)
        }
    } else {
        startReply(bot, chatId)
    }
})

bot.onText(/^S'abonner à un flux existant 🔔$/, message => {
    // On recherche tous les flux depuis la base de données et on les envoie dans un inline keyboard
    // Au click sur l'inline keyboard, on actualise la liste avec le statut: Se désaboner/s'abonner
})

bot.onText(/Mes flux d'actualités 👁️/, message => {
    // On recherche tous les flux auxquels l'utilisateur c'est abonné et on lui renvoie les flux en inline keyboard
    // On lui donne la possibilité de se désabonner du flux
})

const startReply = (bot: any, chatId: any) => {
    const reply = {
        keyboard: [
            [{ text: "S'abonner à un flux existant 🔔" }],
            [{ text: "Mes flux d'actualités 👁️" }],
        ],
        force_reply: true,
        resize_keyboard: true
    }

    bot.sendMessage(chatId, "Bonjour 👋\nJe suis un lecteur de flux RSS 🤖 ! \n\nAbonnez-vous à l'un des flux de la liste ou envoyer moi l'URL d'un flux RSS et je vous enverrai des notifications dès que possible.\n\nVeuillez-choisir une option 👇.", {
        reply_markup: JSON.parse(JSON.stringify(reply)),
        parse_mode: "HTML",
    })
}