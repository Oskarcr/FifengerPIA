class JsonParser {

    conversation(a) {
        return {
            name: a.name,
            id: a.id,
            participants: a.participants.map(a => this.user(a))
        };
    }

    user(a) {
        return {
            username: a.username,
            email: a.email,
            photoId: a.photoId,
            bannerId: a.bannerId,
            inventory: [1, 2].concat(a.inventory),
            status: a.status
        }
    }
}

const Jsoner = new JsonParser();

Object.freeze(Jsoner);

export default Jsoner;