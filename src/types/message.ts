import User from "./user"

export interface DirectMessage {
    author: string
    collectionId: string
    collectionName: string
    content: string
    created: string
    id: string
    recipient: string
    updated: string
    expand: {
        author: User
        [key: string]: any
    }
}
