
export enum SupportesMessage1 {
    AddChat = "ADD_CHAT",
    UpdateChat = "UPDATE_CHAT"
}

type MessagePayload = {
    roomId: string,
    message: string,
    name: string,
    upvotes: number,
    chatId: string
}

export type OutgoingMessages = {
    type: SupportesMessage1.AddChat,
    payload: MessagePayload
} | {
    type: SupportesMessage1.UpdateChat,
    payload: Partial<MessagePayload> 
}

