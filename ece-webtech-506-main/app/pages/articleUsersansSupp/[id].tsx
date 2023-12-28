import { useRouter } from 'next/router';
import { useSupabaseClient } from '@supabase/auth-helpers-react';
import React, {useEffect, useState} from "react";


const ArticleDetails = () => {
  const supabase = useSupabaseClient();
  const [article, setArticle] = useState(null);
  const router = useRouter();
  const { id } = router.query;
  const [text, setText] = useState('');

  const [todo, setTodo] =useState(false);
  const [isUserAuthorized, setIsUserAuthorized] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [comments, setComments] = useState([]);
  useEffect(() => {

    const storedUserData = localStorage.getItem('userData');
    const parsedUserData = JSON.parse(storedUserData);
    setTodo(parsedUserData && parsedUserData.id !== null);

    const fetchArticle = async () => {
      if (id) { // S'assurer que l'ID est présent
        const { data, error } = await supabase
            .from('articles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
          console.error('error', error);
        } else {
          setArticle(data);

          const storedUserData = localStorage.getItem('userData');
          const parsedUserData = JSON.parse(storedUserData);
          setIsUserAuthorized(parsedUserData && parsedUserData.id === data.user_id); // Remplacez 'user_id' par le nom de votre champ

        }
      }

    };

    //extraction de commentaire
    const fetchCommentaires = async () => {
      if (id) {
        const { data, error } = await supabase
            .from('commentaire')
            .select('*')
            .eq('article', id); // Assurez-vous que 'id_article' est le bon nom de champ

        if (error) {
          console.error('Erreur lors de la récupération des commentaires', error);
        } else {
          setComments(data);
        }
      }
    };

    fetchCommentaires();
    fetchArticle();
  }, [id, supabase]);

  const deleteArticle = async () => {
    const { data, error } = await supabase
        .from('articles')
        .delete()
        .match({ id });

    if (error) {
      console.error('Error deleting article', error);
    } else {
      console.log('Article deleted', data);
      // Rediriger l'utilisateur après la suppression
      router.push('/profile'); // Remplacez par le chemin approprié
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();
    const updatedArticle = {
      // Récupérez les valeurs des champs de formulaire
      title: event.target.title.value,
      genre: event.target.genre.value,
      ratings: event.target.ratings.value,
      duration: event.target.duration.value,
      description: event.target.description.value,
      // ... autres champs si nécessaire
    };

    const { error } = await supabase
        .from('articles')
        .update(updatedArticle)
        .eq('id', id);

    if (error) {
      console.error('Error updating article', error);
    } else {
      alert('Article mis à jour avec succès');
      setArticle({ ...article, ...updatedArticle });
      router.push('/profile');
    }
  };

  if (!article) {
    return <div>Loading...</div>;
  }
  function recommendText(isRecommended) {
    return isRecommended ? "Je vous recommande" : "Je ne vous conseille pas";
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const storedUserData = localStorage.getItem('userData');
    const parsedUserData = JSON.parse(storedUserData);

    const newEntry = {
      user: parsedUserData.id, // Assurez-vous que c'est bien l'ID de l'utilisateur
      article: article.id, // ID de l'article
      txt: text, // Texte du commentaire
      nomuser : parsedUserData.email
    };

    const { data, error } = await supabase
        .from('commentaire') // Assurez-vous que c'est le nom correct de votre table
        .insert([newEntry]);

    setIsSubmitting(false);

    if (error) {
      console.error('Error submitting data', error);
    } else {
      console.log('Data submitted', data);
      setText('');
    }
  };
  return (
      <div className="container mx-auto my-8 ">
        <form onSubmit={handleUpdate}>
          <div className="px-4 sm:px-0">
            <h2 className="text-base font-semibold leading-7 text-gray-900  dark:text-white"> Information sur le
              Film </h2>
            <p className="mt-1 max-w-2xl text-sm leading-6 text-gray-500 dark:text-white">Les informations sont founi
              par l'un des
              utilisateurs de l'application.</p>
          </div>
          <div className="mt-6 border-t border-gray-100">

            <dl className="divide-y divide-gray-100">

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">NOM DU FILM</dt>
                <input
                    className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:bg-black dark:text-white"
                    id="title" name="title"
                    type="text" defaultValue={article.title}/>

              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">GENRE</dt>
                <input
                    className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:bg-black dark:text-white "
                    id="genre" name="genre"
                    type="text" defaultValue={article.genre}/>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">NOTE</dt>
                <input
                    className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:bg-black dark:text-white"
                    id="ratings" name="ratings"
                    type="text" defaultValue={article.ratings}/>
              </div>
              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 justify-self-center sm:justify-self-auto dark:text-white">DURÉE</dt>
                <input
                    className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:bg-black dark:text-white"
                    id="duration" name="duration"
                    type="text" defaultValue={article.duration}/>
              </div>

              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">DESCRIPTIONS</dt>
                <input
                    className="mt-1 text-sm leading-6 text-gray-700 sm:col-span-2 sm:mt-0 dark:bg-black dark:text-white"
                    id="description" name="description"
                    type="text" defaultValue={article.description}/>
              </div>


              <div className="px-4 py-6 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-0">
                <dt className="text-sm font-medium leading-6 text-gray-900 dark:text-white">L'AUTEUR</dt>
                <dd className="mt-2 text-sm text-gray-900 sm:col-span-2 sm:mt-0">
                  <ul role="list" className="divide-y divide-gray-100 rounded-md border border-gray-200">
                    <li className="flex items-center justify-between py-4 pl-4 pr-5 text-sm leading-6">
                      <div className="flex w-0 flex-1 items-center">

                        <div className="ml-4 flex min-w-0  gap-2">
                          <span className="truncate font-medium dark:text-white">Nom du createur a ajouter</span>
                        </div>

                      </div>
                    </li>
                  </ul>
                </dd>
              </div>
            </dl>
          </div>

        </form>


        <div className=" px-6 py-24 sm:py-32 lg:px-8 ">

          <p className="text-slate-500">Commentaire :</p>
          {comments.map((comment) => (
              <div  key={comment.id}>
              <div  className="bubble">
            <div className="bubble-text">
              <h1>{comment.nomuser}</h1>
              <hr/>
              <p>{comment.txt}</p>
            </div>
          </div>
                <br/>
              </div>
          ))}

          {todo && (<form onSubmit={handleSubmit} method="POST" className="mx-auto mt-16 max-w-xl sm:mt-20">
                <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label htmlFor="message" className="block text-sm font-semibold leading-6 text-gray-900">
                      Message
                    </label>
                    <div className="mt-2.5">
                              <textarea
                                  value={text}
                                  onChange={(e) => setText(e.target.value)}
                                  placeholder="Écrivez quelque chose ici..."
                                  disabled={isSubmitting}
                                  className="block w-full rounded-md border-0 px-3.5 py-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                              />
                    </div>
                  </div>
                </div>
                <div className="mt-10">
                  <button
                      type="submit" disabled={isSubmitting}

                      className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                  >
                    Envoyer
                  </button>
                </div>
              </form>
          )}


        </div>


      </div>
  );
};

export default ArticleDetails;
