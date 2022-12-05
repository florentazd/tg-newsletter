// ce fichier permet d'utiliser le résultat des callabacks sur le bot telegram

import bot from "../bot";
import { pb_client } from "../clients/pocketbase";

bot.on("callback_query", async callbackQuery => {
    const data = JSON.parse(callbackQuery.data!)
    const userId = callbackQuery.from.id

    if (data.action === "sub") {
        // Abonnement
        let result = null
        try {
            result = await pb_client.collection("feeds").getFirstListItem(`id='${data.feedId}' && subscribers ~ '${userId}' `)

            // ESt abonné alors un retourne une erreur au client.
        } catch (error: any) {
            if (error!.status! == 404) {
                // n'est pas aboné ! Alors on l'ajoute
                await pb_client.collection("feeds").update()
            }
        }

        let inline_keyboard = callbackQuery.message?.reply_markup?.inline_keyboard || []
        inline_keyboard = inline_keyboard!.map((item) => {
            const itemData = JSON.parse(item[0].callback_data!)
            if (itemData.feedId === data.feedId) {
                item[0].text = "Vous êtes abonné ✅"
                item[0].callback_data = JSON.stringify({
                    feedId: itemData.feedId,
                    action: "none"
                })
            }
            return item
        })

        // TODO: Insert this part into a function
        bot.editMessageText("<b>Liste de vos abonnement RSS📻 </b>\n\n Pour se désabonner d'un flux, cliquer sur le nom du flux 👇", {
            chat_id: callbackQuery.message?.chat.id,
            message_id: callbackQuery.message?.message_id,
            parse_mode: "HTML",
            reply_markup: {
                inline_keyboard: inline_keyboard || []
            }
        })
    }


    if (data.action === "unsub") {
        // Désabonnement
    }

})