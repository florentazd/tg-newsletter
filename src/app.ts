import bot from "./bot"
import { pb_client } from "./clients/pocketbase";
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

bot.onText(/^S'abonner à un flux existant 🔔$/, async message => {
    // On recherche tous les flux depuis la base de données et on les envoie dans un inline keyboard
    // Au click sur l'inline keyboard, on actualise la liste avec le statut: Se désaboner/s'abonner
    let feeds = null

    // 1 - rechercher l'utilisateur dans la bd
    let user = null
    try {
        user = await pb_client.collection("users").getFirstListItem("telegramId=" + message!.from!.id)
    } catch {
        //  Revoie une erreur si l'utilisateur n'est pas trouver
        bot.sendMessage(message!.from!.id, "<b>Erreur !!</b>\n\nVous devez vous inscrire avant de pouvoir utiliser cette commande ! Veuillez entrer la commande /start pour vous inscrire")
    }
    if (!user) return

    // 2 - Récupérer son id si trouver dans la variable telegramId

    try {
        feeds = await pb_client.collection('feeds').getFullList(200, {
            sort: "created",
            filter: "subscribers !~ '" + user!.id + "'"
        })
    } catch (e) {
        bot.sendMessage(message!.from!.id, "Une erreur internet est survenue ! Veuillez rééssayer plus tard!")
        return
    }

    if (feeds.length) {
        // Si la liste contient au moins un élément
        let inline_keyboard: Array<any> = []

        feeds.forEach((item: any,) => {
            inline_keyboard.push(
                [{
                    text: item.title, callback_data: JSON.stringify({
                        action: "sub"
                    })
                }]
            )
        })

        bot.sendMessage(message!.from!.id, "<b>Liste des flux RSS 📻 </b>\n\n Pour vous s'abonner à un flux, cliquer sur le nom du flux 👇", {
            reply_markup: {
                inline_keyboard: inline_keyboard
            },
            parse_mode: "HTML",
        })
    } else {
        bot.sendMessage(message!.from!.id, "Aucun nouveau flux auquel s'abonner pour le moment.")
    }
})

bot.onText(/Mes flux d'actualités 👁️/, async message => {
    // On recherche tous les flux auxquels l'utilisateur s'est abonné et on lui renvoie les flux en inline keyboard
    // On lui donne la possibilité de se désabonner du flux

    let feeds = null

    // 1 - rechercher l'utilisateur dans la bd
    let user = null
    try {
        user = await pb_client.collection("users").getFirstListItem("telegramId=" + message!.from!.id)
    } catch {
        //  Revoie une erreur si l'utilisateur n'est pas trouver
        bot.sendMessage(message!.from!.id, "<b>Erreur !!</b>\n\nVous devez vous inscrire avant de pouvoir utiliser cette commande ! Veuillez entrer la commande /start pour vous inscrire")
    }
    if (!user) return

    // 2 - Récupérer son id si trouver dans la variable telegramId

    try {
        feeds = await pb_client.collection('feeds').getFullList(200, {
            sort: "created",
            filter: "subscribers ~ '" + user!.id + "'"
        })
    } catch (e) {
        bot.sendMessage(message!.from!.id, "Une erreur internet est survenue ! Veuillez rééssayer plus tard!")
        return
    }

    if (feeds.length) {
        // Si la liste contient au moins un élément
        let inline_keyboard: Array<any> = []

        feeds.forEach((item: any,) => {
            inline_keyboard.push(
                [{
                    text: item.title, callback_data: JSON.stringify({
                        action: "unsub"
                    })
                }]
            )
        })

        bot.sendMessage(message!.from!.id, "<b>Liste de vos abonnement RSS📻 </b>\n\n Pour se désabonner d'un flux, cliquer sur le nom du flux 👇", {
            reply_markup: {
                inline_keyboard: inline_keyboard
            },
            parse_mode: "HTML",
        })
    } else {
        bot.sendMessage(message!.from!.id, "Votre liste d'abonnement est vide pour le moment.")
    }
})

const startReply = (bot: any, chatId: any) => {
    const reply = {
        keyboard: [
            [{ text: "S'abonner à un flux existant 🔔" }],
            [{ text: "Voir mes flux d'actualités 👁️" }],
        ],
        force_reply: true,
        resize_keyboard: true
    }

    bot.sendMessage(chatId, "Bonjour 👋\nJe suis un lecteur de flux RSS 🤖 ! \n\nAbonnez-vous à l'un des flux de la liste ou envoyer moi l'URL d'un flux RSS et je vous enverrai des notifications dès que possible.\n\nVeuillez-choisir une option 👇.", {
        reply_markup: JSON.parse(JSON.stringify(reply)),
        parse_mode: "HTML",
    })
}