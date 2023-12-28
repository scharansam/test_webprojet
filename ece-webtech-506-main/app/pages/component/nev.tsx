import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from "next/router";
import supabase from "../utils/supabaseClient";
import {useUser} from "./UserContext";
import ArticlesUserAllsansSupp from "../articlesUserAllsansSupp";

export default function Nav() {
    const [darkMode, setDarkMode] = useState(false);
    const [loggedIn, setLoggedIn] = useState(false);
    const { user, logout } = useUser();
    const router = useRouter();

    useEffect(() => {
        // Vérifier l'état de connexion au montage du composant
        const session = supabase.auth.user;
        setLoggedIn(!!session);

        // Écouter les changements d'état de connexion
        const { data: authListener } = supabase.auth.onAuthStateChange((_event, session) => {
            setLoggedIn(!!session);
        });

        // Appliquer le mode sombre si nécessaire
        if (darkMode) {
            document.body.classList.add('dark');
        } else {
            document.body.classList.remove('dark');
        }



        // Nettoyer l'écouteur lors du démontage du composant

    }, [darkMode]);

    const handleLogout = async () => {
        localStorage.removeItem('userData');
        await supabase.auth.signOut();
        router.push('/login-controle');

    };
    const handleLogin = () => {
        // Rediriger vers la page de connexion
        router.push('/login-controle');
    };





    return (
        <nav className=" bg-white w-full z-10 dark:bg-black">
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
                <div className="relative flex h-16 items-center justify-between">
                    <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                        <div className="hidden sm:ml-6 sm:block">
                            <div className="flex space-x-4">
                                <Link href="/"
                                      className=" text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300">Accueil </Link>
                                <Link href="/articles"
                                      className="text-black  hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300">Articles </Link>
                                <Link href="/articlesUserAllsansSupp"
                                      className="text-black  hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300">Articles Commune </Link>
                                <Link href="/contacts"
                                      className="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300">Contacts </Link>
                                <Link href="/about"
                                      className="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300">À
                                    propos </Link>
                            </div>
                        </div>
                    </div>
                    <button className="text-black text-amber-50 dark:text-amber-50"
                            onClick={() => setDarkMode(!darkMode)}>
                        {darkMode ? 'Mode Clair' : 'Mode Sombre'}
                    </button>

                    <div
                        className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">


                        <div
                            className="relative flex rounded-full bg-amber-50 text-sm focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:bg-amber-100 dark:bg-gray-800 ring-offset-gray-800">
                            <button
                                className="text-black hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium dark:text-gray-300"
                                onClick={loggedIn ? handleLogout : handleLogin}>
                                {loggedIn ? 'Logout' : 'Login-C'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}
