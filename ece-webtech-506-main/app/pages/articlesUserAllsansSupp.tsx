import React, {useEffect, useState} from 'react';
import supabase from "../supabaseClient";
import Link from "next/link";

function ArticlesUserAllsansSupp(): React.JSX.Element {
    const [articles, setArticles] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredArticles, setFilteredArticles] = useState([]);

    useEffect(() => {

        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*');

            if (error) {
                console.log('error', error);
            } else {
                setArticles(data);
                setFilteredArticles(data);
            }
        };
        fetchArticles();
    }, []);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            const filtered = articles.filter(article =>
                article.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            setFilteredArticles(filtered);
        }, 500); 

        return () => clearTimeout(timeoutId); 
    }, [searchTerm, articles]);


    return (

            <div className="bg-white py-24 sm:py-32 dark:bg-black ">
                           <div className="mx-auto max-w-7xl px-6 lg:px-8">
                <div className="flex justify-between items-center">
                    <div className="max-w-2xl">
                        {/* ... titre et sous-titre ... */}
                    </div>
                    {/* Ajouté : barre de recherche */}
                    <div>
                        <input
                            type="text"
                            placeholder="Rechercher un film..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="  p-2 border   rounded-md dark:bg-gray-900 dark:text-white"
                        />
                    </div>
                </div>
            </div>
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Les filmes</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-white">Les filmes proposé par notre communoté</p>
                    </div>

                    <div className="container mx-auto my-8">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                        {filteredArticles.map((article) => (
                                <li key={article.id} className="mb-8">
                                    <Link href={`/articleUsersansSupp/${article.id}`}>
                                        <div className="block group">
                                            <h2 className="mt-2 text-xl font-semibold text-gray-800 group-hover:text-blue-500 dark:text-white">
                                                {article.title}
                                            </h2>
                                            <div
                                                className="text-gray-500 text-xs dark:text-white">{new Date(article.created_at).toLocaleDateString()}</div>
                                            <div className="mt-3 dark:text-white">{article.description}</div>
                                            <div className="mt-1 dark:text-white">Durée : {article.duration} minutes</div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

    );
}

export default ArticlesUserAllsansSupp; 