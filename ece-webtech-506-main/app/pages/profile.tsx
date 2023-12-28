import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import supabase from '../supabaseClient';
import md5 from 'md5';
import Link from "next/link";

const Profile = () => {
    const router = useRouter();
    const [articles, setArticles] = useState([]);
    const [userData, setUserData] = useState({ id: '', email: '' });
    const [gravatarUrl, setGravatarUrl] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [pays, setPays] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [email, setEmail] = useState('');
    const [loggedIn, setLoggedIn] = useState(false);

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        const parsedUserData = JSON.parse(storedUserData);

        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            setEmail(parsedUserData.email);

            const emailHash = md5(parsedUserData.email.toLowerCase());
            const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=200&${Date.now()}`;
            setGravatarUrl(gravatarUrl);

            loadAdditionalUserData(parsedUserData.id);
        } else {
            router.push('/login-controle');
        }


        const fetchArticles = async () => {

            if(parsedUserData !=null){
                const userid =  parsedUserData.id;
                const { data, error } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('user', userid);
                if (error) {
                    console.log('error', error);
                } else {
                    setArticles(data);
                }
            }


        }


        fetchArticles();
    }, [router]);

    const loadAdditionalUserData = async (userId) => {
        const { data, error } = await supabase
            .from('infoUsers')
            .select('*')
            .eq('id', parseInt(userId, 10));

        if (error) {
            console.error('Erreur lors du chargement des informations supplémentaires:', error.message);
            return;
        }

        if (data && data.length > 0) {
            const infoUser = data[0];
            setNom(infoUser.nom || '');
            setPrenom(infoUser.prenom || '');
            setPays(infoUser.pays || '');
            setDescription(infoUser.description || '');
        }
    };

    const handleLogout = async () => {
        localStorage.removeItem('userData');
        await supabase.auth.signOut();
        router.push('/login-controle');
    };


    const handleSave = async () => {
        try {
            // Mise à jour de la table Users pour le champ email
            console.log('UserData ID:', userData.id);
            console.log('Email:', email);
            const { data: userDataUpdate, error: userError } = await supabase
                .from('Users')
                .upsert(
                    [
                        {
                            id: parseInt(userData.id, 10),
                            Email: email,
                        },
                    ],
                    { returning: 'minimal' }
                );

            if (userError) {
                console.error('Erreur lors de la mise à jour du champ email dans Users :', userError);
            } else {
                console.log('Mise à jour du champ email dans Users réussie :', userDataUpdate);
            }
            const { data, error } = await supabase
                .from('infoUsers')
                .upsert(
                    [
                        {
                            id: parseInt(userData.id, 10),
                            nom,
                            prenom,
                            pays,
                            description,
                        },
                    ],
                    { returning: 'minimal' }
                );

            if (error) {
                console.error('Erreur lors de la mise à jour des autres champs dans infoUsers :', error);
                if (error.message) {
                    setMessage(`Erreur : ${error.message}`);
                } else {
                    setMessage("Une erreur inattendue s'est produite.");
                }
            } else {
                setMessage('Informations mises à jour avec succès !');
            }

            setIsEditing(false);
        } catch (error) {
            console.error('Erreur complète :', error);
            setMessage("Une erreur inattendue s'est produite.");
        }
    };

    const redirection =  ()=>{router.push('/ajout');};
    return (
        <div className="container mx-auto p-8">
            <header className="text-center mb-4">
                <h1 className="text-2xl font-semibold text-black dark:text-white">Bienvenue {prenom} {nom}, vous êtes sur la page de votre
                    profil</h1>
            </header>

            <div className="flex items-center justify-center">
                <div className="flex-shrink-0 mr-4">
                    {gravatarUrl && <img src={gravatarUrl} alt="Gravatar" className="w-32 h-32 rounded-full"/>}
                </div>

                <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-2 text-black dark:text-white">Données de l'utilisateur :</h3>
                    <p>ID: {userData.id}</p>
                    <p>Email: {userData.email}</p>

                    {isEditing ? (
                        <form className="mt-4">

                            <label className="block mb-2">
                                Email:
                                <input
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="border border-gray-300 px-2 py-1 w-full"
                                />
                            </label>

                            <label className="block mb-2">
                                Nom:
                                <input
                                    type="text"
                                    value={nom}
                                    onChange={(e) => setNom(e.target.value)}
                                    className="border border-gray-300 px-2 py-1 w-full"
                                />
                            </label>

                            <label className="block mb-2">
                                Prénom:
                                <input
                                    type="text"
                                    value={prenom}
                                    onChange={(e) => setPrenom(e.target.value)}
                                    className="border border-gray-300 px-2 py-1 w-full"
                                />
                            </label>

                            <label className="block mb-2">
                                Pays:
                                <input
                                    type="text"
                                    value={pays}
                                    onChange={(e) => setPays(e.target.value)}
                                    className="border border-gray-300 px-2 py-1 w-full"
                                />
                            </label>

                            <label className="block mb-2">
                                Description:
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="border border-gray-300 px-2 py-1 w-full"
                                />
                            </label>


                            <button type="button" onClick={handleSave}
                                    className="bg-blue-500 text-white px-4 py-2 rounded">
                                Enregistrer
                            </button>
                        </form>
                    ) : (
                        <div className="mt-4 dark:text-white">
                            <p>Email: {email}</p>
                            <p>Nom: {nom}</p>
                            <p>Prénom: {prenom}</p>
                            <p>Pays: {pays}</p>
                            <p>Description: {description}</p>

                            <button
                                onClick={() => setIsEditing(true)}
                                className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                            >
                                Modifier
                            </button>

                        </div>
                    )}

                    {message && <p className="text-green-500 mt-4 ">{message}</p>}

                    <button
                        onClick={redirection}
                        className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
                    >
                        Ajouter Article
                    </button>
                </div>
            </div>
            <div className="bg-white py-24 sm:py-32 dark:bg-black ">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">Les films</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600 dark:text-white">Les films proposé par notre communauté</p>
                    </div>


                    <div className="container mx-auto my-8 dark:text-white">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {articles.map((article) => (
                                <li key={article.id} className="mb-8">
                                    <Link href={`/articleUser/${article.id}`}>
                                        <div className="block group">
                                            <h2 className="mt-2 text-xl font-semibold text-gray-800 group-hover:text-blue-500 dark:text-white">
                                                {article.title}
                                            </h2>
                                            <div
                                                className="text-gray-500 text-xs dark:text-white">{new Date(article.created_at).toLocaleDateString()}</div>
                                            <div className="mt-3">{article.description}</div>
                                            <div className="mt-1">Durée : {article.duration} minutes</div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                </div>
            </div>

        </div>
    );
};

export default Profile;
