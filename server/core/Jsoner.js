class Jsoner {
    static task(a, i) {
        return {
            id: i,
            title: a.title,
            completed: a.completed
        };
    }

    static conversation(a) {
        return {
            id: a._id,
            name: a.name,
            encryptionEnabled: a.encryptionEnabled, 
            isGroup: a.isGroup,
            participants: a.participants.map(Jsoner.user)
        };
    }

    static user(a) {
        return {
            id: a._id,
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
            conversationId: a.conversation,
            attachmentUrl: a.attachmentUrl,
            isEncrypted: a.isEncrypted,
            user: Jsoner.user(a.user)
        }
    }
}

export default Jsoner;