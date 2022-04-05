export type Poll = {
    title: string,
    author?: string,
    question?: string,
    firstOption: {
        description: string,
        emoji: string,
        votes: number
    },
    secondOption: {
        description: string,
        emoji: string,
        votes: number
    }
}