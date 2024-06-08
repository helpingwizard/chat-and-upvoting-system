import { Chat, Store, userId } from "./store/Store";
let globalChatId = 0;
export interface Room {
    roomId: string;
    chats: Chat[];
}

export class InMemoryStore implements Store{
    private store: Map<string, Room>;
    constructor() {
        this.store = new Map<string, Room> (); 
    }
 
    initRoom(roomId: string) {
        this.store.set(roomId, {
            roomId,
            chats: []
        });
    }
    
    // last fifty chats => limit = 50; offset = 0
    getChats(roomId: string, limit: number, offset: number) {
        const room = this.store.get(roomId);
        if (!room) {
            return [];
        }
        return room.chats.reverse().slice(0, offset).slice(-1*limit);
    }
    
    addChat(roomId: string, userId: userId, name: string , message: string) {
        const room = this.store.get(roomId);
        if (!room) {
            return;
        }
        const chat = {
            id: (globalChatId++).toString(),
            userId,
            name,
            message,
            upvotes: []
        }
        room.chats.push(chat)
        return chat;
    }

    upVote(userId: userId, roomId: string, chatId: string) {
        const room = this.store.get(roomId);
        if (!room) {
            return;
        }
        const chat = room.chats.find(({id}) => id === chatId);
        if (chat) {
            chat.upvotes.push(userId);
        }
        return chat;
    }

}