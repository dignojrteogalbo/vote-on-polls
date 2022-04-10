declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NEXT_PUBLIC_DISCORD_WEBHOOK: string
            NEXT_PUBLIC_FIREBASE_API_KEY: string
            NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: string
            NEXT_PUBLIC_FIREBASE_DATABASE_URL: string
            NEXT_PUBLIC_FIREBASE_PROJECT_ID: string
            NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: string
            NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: string
            NEXT_PUBLIC_FIREBASE_APP_ID: string
            NEXT_PUBLIC_COLLECTING: string
        }
    }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}