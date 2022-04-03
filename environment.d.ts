declare global {
    namespace NodeJS {
        interface ProcessEnv {
            DISCORD_WEBHOOK: string
            NEXT_PUBLIC_FIREBASE_DATABASE_URL: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}