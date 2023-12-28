import React from 'react';
import Link from "next/link";

function Header() {
    return (
        <header>
            <div className="bg-gray-800  w-full z-10 tailleHeader">
                <div className="flex-container ">
                    <div className="flex-slide home">
                        <Link href="/">
                            <h3 className="flex-title flex-title-home">Accueil</h3>
                        </Link>
                    </div>
                    <div className="flex-slide about">
                        <Link href="/articles">
                            <h3 className="flex-title">Articles</h3>
                        </Link>
                    </div>
                    <div className="flex-slide work">
                        <Link href="/contacts">
                            <h3 className="flex-title">Contacts</h3>
                        </Link>
                    </div>
                    <div className="flex-slide contact">
                        <Link href="/about">
                            <h3 className="flex-title">Contact</h3>
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    );
}

export default Header;
