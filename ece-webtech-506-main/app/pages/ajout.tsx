import {useSupabaseClient} from "@supabase/auth-helpers-react";
import React, {useEffect, useState} from "react";
import Link from "next/link";
import md5 from 'md5';
import supabase from "./utils/supabaseClient";
import {useRouter} from "next/router";
import { useUser } from '@supabase/auth-helpers-react';



export default function Ajout(){

    const [articles, setArticles] = useState([]);
    const router = useRouter();
    const [userData, setUserData] = useState({ id: '', email: '' });
    const [gravatarUrl, setGravatarUrl] = useState('');
    const [nom, setNom] = useState('');
    const [prenom, setPrenom] = useState('');
    const [pays, setPays] = useState('');
    const [description, setDescription] = useState('');
    const [message, setMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [email, setEmail] = useState('');

    useEffect(() => {
        const storedUserData = localStorage.getItem('userData');
        if (storedUserData) {
            const parsedUserData = JSON.parse(storedUserData);
            setUserData(parsedUserData);
            setEmail(parsedUserData.email);

            const emailHash = md5(parsedUserData.email.toLowerCase());
            const gravatarUrl = `https://www.gravatar.com/avatar/${emailHash}?s=200&${Date.now()}`;
            setGravatarUrl(gravatarUrl);


        } else {
            router.push('/login-controle');
        }
        const fetchArticles = async () => {
            const { data, error } = await supabase
                .from('articles')
                .select('*');

            if (error) {
                console.log('error', error);
            } else {
                setArticles(data);
            }
        };
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
        /*const fetchImages = async () => {
            const { data, error } = await supabase
                .storage
                .from('images')
                .list('toto'); // Assurez-vous que le chemin correspond à vos fichiers

            if (error) {
                console.log('Erreur lors de la récupération des images', error);
            } else {
                const urls = data.map((file) => {
                    const response = supabase
                        .storage
                        .from('images')
                        .getPublicUrl(file.name);
                    if(response.error) {
                        console.error('Erreur lors de la récupération de l\'URL publique', response.error);
                        return null;
                    }
                    return response.publicURL; // Utilisez directement response.publicURL ici
                });
                // Filtrer pour éliminer les valeurs nulles
                setImages(urls.filter(url => url !== null));
            }
        };

        fetchImages();*/
        fetchArticles();
    }, [supabase]);

    const handleSubmit = async (event) => {
        event.preventDefault();

        const storedUserData = localStorage.getItem('userData');
        const parsedUserData = JSON.parse(storedUserData);
        const userUID = parsedUserData.id;
        console.log("User ID: " + userUID);

        const form = event.target;
        const formData = new FormData(form);
        const formProps = Object.fromEntries(formData.entries());

        const insertDataWithUID = {
            ...formProps,
            user: userUID
        };

        const { data: insertData, error: insertError } = await supabase
            .from('articles')
            .insert([insertDataWithUID]);

        if (insertError) {
            console.error('Error', insertError);
        } else {
            console.log('Inserted Data', insertData);
            form.reset();
            router.push('/profile');
        }
    };



    const [file, setFile] = useState(null);

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const uploadImage = async () => {
        if (!file) {
            alert('No file selected');
            return;
        }

        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `images/toto/${fileName}`;

        let { error } = await supabase.storage
            .from('images')
            .upload(filePath, file);

        if (error) {
            console.error('Error uploading the file', error);
            return;
        }

        alert('File uploaded successfully!');
    };

    return (
        <div>
            <form onSubmit={handleSubmit} method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                    <div>
                        <label htmlFor="ratings" className="block text-sm font-semibold leading-6 text-gray-900">
                            rating
                        </label>
                        <div className="mt-2.5">
                            <input id="tt"
                                   type="number" name="ratings" placeholder="rating" required
                                   className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div>
                        <label htmlFor="duration" className="block text-sm font-semibold leading-6 text-gray-900">
                            duration
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="number" name="duration" placeholder="duration" required
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="director" className="block text-sm font-semibold leading-6 text-gray-900">
                            Director
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text" name="director" placeholder="director" required
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                        <div className="mt-2.5">
                            <label htmlFor="genre" className="block text-sm font-semibold leading-6 text-gray-900">
                                Titre
                            </label>
                            <input
                                type="text" name="title" placeholder="title" required
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>
                    </div>
                    <div className="sm:col-span-2">
                        <label htmlFor="genre" className="block text-sm font-semibold leading-6 text-gray-900">
                            Genre
                        </label>
                        <div className="mt-2.5">
                            <input
                                type="text" name="genre" placeholder="genre" required
                                className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                            />
                        </div>


                    </div>

                    <div className="sm:col-span-2">
                        <label htmlFor="description" className="block text-sm font-semibold leading-6 text-gray-900">
                            Description
                        </label>
                        <div className="mt-2.5">
              <textarea
                  name="description" placeholder="La descriptions" required
                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  defaultValue={''}
              />
                        </div>
                    </div>
                </div>
                <div className="mt-10">
                    <button
                        type="submit"

                        className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                        Envoyer
                    </button>
                </div>
            </form>


            <div className="bg-white py-24 sm:py-32">
                <div className="mx-auto max-w-7xl px-6 lg:px-8">
                    <div className="mx-auto max-w-2xl lg:mx-0">
                        <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Les filmes</h2>
                        <p className="mt-2 text-lg leading-8 text-gray-600">Les filmes proposé par notre communoté</p>
                    </div>


                    <div className="container mx-auto my-8">
                        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                            {articles.map((article) => (
                                <li key={article.id} className="mb-8">
                                    <Link href={`/articleUser/${article.id}`}>
                                        <div className="block group">
                                            <h2 className="mt-2 text-xl font-semibold text-gray-800 group-hover:text-blue-500">
                                                {article.title}
                                            </h2>
                                            <div
                                                className="text-gray-500 text-xs">{new Date(article.created_at).toLocaleDateString()}</div>
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

            {/*
            <div>
                <input type="file" onChange={handleFileChange} accept="image/*"/>
                <button onClick={uploadImage}>Upload to Supabase</button>
            </div>
*/}

        </div>


    )

}
