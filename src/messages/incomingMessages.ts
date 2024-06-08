import z from "zod"

export enum SupportesMessage {
    JoinRoom = "JOIN_ROOM",
    SendMessage = "SEND_MESSAGE",
    UpvoteMessage = "UPVOTE_MESSAGE"
}

export type IncomingMessages = {
    type: SupportesMessage.JoinRoom,
    payload: initMessageType
} | {
    type: SupportesMessage.SendMessage,
    payload: userMessageType
} | {
    type: SupportesMessage.UpvoteMessage,
    payload: upVoteMessageType
}

const initMessage = z.object({
    name: z.string(),
    userId: z.string(),
    roomId: z.string()
})

export type initMessageType = z.infer<typeof initMessage>;

const UserMessages = z.object({
    userId: z.string(),
    roomId: z.string(),
    message: z.string()
})

export type userMessageType = z.infer<typeof UserMessages>;

const upVoteMessage = z.object({
    userId: z.string(),
    roomId: z.string(),
    chatId: z.string()
})

export type upVoteMessageType = z.infer<typeof upVoteMessage>; 