import type { AppProps } from 'next/app';
import RootLayout from './Layout/layout';
import "../styles/styles.css"
import {UserProvider} from "../UserContext";
import "../styles/globals.css"
import "../styles/styleHeader.css";
import { createClient } from '@supabase/supabase-js'
import React, {useState} from "react";
import {SessionContextProvider} from "@supabase/auth-helpers-react";
import {createPagesBrowserClient} from "@supabase/auth-helpers-nextjs";



const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
)
export default function App({ Component, pageProps }: AppProps) {
    const [supabaseClient] = useState(() => createPagesBrowserClient())

    return (
        <SessionContextProvider
            supabaseClient={supabaseClient}
            initialSession={pageProps.initialSession}
        >
        <UserProvider>
            <RootLayout>
                <Component {...pageProps} />
            </RootLayout>
        </UserProvider>
        </SessionContextProvider>
    );
}
