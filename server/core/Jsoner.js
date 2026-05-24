class Jsoner {

    static conversation(a) {
        return {
            name: a.name,
            id: a.id,
            participants: a.participants.map(Jsoner.user)
        };
    }

    static user(a) {
        return {
            username: a.username,
            email: a.email,
            photoId: a.photoId,
            bannerId: a.bannerId,
            inventory: [1, 2].concat(a.inventory),
            status: a.status,
            points: a.points
        }
    }

    static message(a) {
        return {
            content: a.content,
            attachmentUrl: a.attachmentUrl,
            isEncrypted: a.isEncrypted,
            user: Jsoner.user(a.user)
        }
    }
}

export default Jsoner;