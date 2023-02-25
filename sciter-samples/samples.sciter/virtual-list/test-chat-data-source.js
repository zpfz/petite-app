import * as Sciter from "@sciter";

const avatars = [
    "avatars/a.png",
    "avatars/b.png",
    "avatars/c.png",
];

let messages = [];

export function messageCount() {
    return messages.length;
}

export function messageAt(index) {
    return messages[index];
}

export function messageNew() {
    const index = messages.length;
    const message = {
        id: Sciter.uuid(),
        html: "<div.text>New Message " + (index + 1) + "</div>",
        avatar: avatars[index % avatars.length],
        mine: index != 0 && ((index + 1) % 3) == 0,
    };
    messages.push(message);
    return [message, index];
}

export function messageDelete(messageId) {
    const idx = messages.findIndex(message => message.id == messageId);
    messages.splice(idx, 1);
}

export function reset(n = 500) {
    messages = [];
    for (let index = 0; index < n; ++index) {
        const uid = Sciter.uuid();
        messages.push({
            id: uid,
            html: `<div.text>Test Message ${index} id: ${uid} <p>dsa d asd d sadas as sa dsad 🥰 ds sdasd sad sd sadsadd</p>
            <p> sddsaddsa sdad sadsadsdsadadsadsadsaddssdsdadadd dsad sad sadad sadasdsa dsa das sad sadsa sdasd sad sd sadsadd sddsaddsa sdad sadsadsdsadadsadsadsaddssdsdadadd</p>
            <p>dsad sad sadad sadasdsa dsa das sad sadsa</p>
            <p>USDdsa DADA RFDGDGFDGGFLSAD SADLKDSA</p></div>`,
            avatar: avatars[index % avatars.length],
            mine: index != 0 && ((index + 1) % 3) == 0,
        });
    }
}

reset();
