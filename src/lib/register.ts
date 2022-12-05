import { pb_client } from "../clients/pocketbase"

// Cette fonction est utilisé pour ajouter un utilisateur à la base de donnée la première fois qu'il se connecte sur l'application
export const isUserRegistered = async (userId: Number) => {
    try {
        const record = await pb_client.collection("users").getFirstListItem("telegramId=" + userId)
        if (record) {
            return true
        }
        else
            return false
    } catch {
        return false
    }
}

export const register = async (userId: Number) => {
    const data = {
        "telegramId": userId,
    };

    try {
        await pb_client.collection('users').create(data);
        return true
    } catch {
        return false
    }
}