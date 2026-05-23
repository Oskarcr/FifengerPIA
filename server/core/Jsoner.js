class JsonParser {
    conversation(a) {
        return {
            name: a.name,
            id: a.id,
            participantsIds: a.participants
        };
    }
}

const Jsoner = new JsonParser();

Object.freeze(Jsoner);

export default Jsoner;