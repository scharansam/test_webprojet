import React from 'react';
import { useRouter } from 'next/router';
import Nev from '../../component/nev';
import Head from '../../component/Header';
import Footer from '../../component/Footer';


export default function RootLayout({ children}) {
    const router = useRouter();
    return (
        <div className="bg-white dark:bg-black">
            <Nev />
            {router.pathname === '/' && <Head />}
            <div>{children}</div>
            <Footer companyName="VotreNom" year={2023} />
        </div>
    );
}