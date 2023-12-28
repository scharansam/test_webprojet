import { useRouter } from 'next/router';
import axios from 'axios';
import React, {useEffect, useState} from "react";
import supabase from "../../supabaseClient";

interface Movie {
  id: string;
  title: string;
  overview: string;
  posterPath: string | null;
  ratings: number;
  actors: string[];
  director: string;
  duration: number;
}

interface MoviePageProps {
  movie: Movie;
}

const MoviePage: React.FC<MoviePageProps> = ({ movie }) => {
  const router = useRouter();
  const [comments, setComments] = useState([]);
  const { ida } = router.query;
  const [todo, setTodo] =useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [text, setText] = useState('');
  const [article, setArticle] = useState(null);


  useEffect(() => {
    const storedUserData = localStorage.getItem('userData');
    const parsedUserData = JSON.parse(storedUserData);
    setTodo(parsedUserData && parsedUserData.id !== null);

    const fetchCommentaires = async () => {
      if (ida) {
        const { data, error } = await supabase
            .from('commentaire')
            .select('*')
            .eq('article', ida);

        if (error) {
          console.error('Erreur lors de la récupération des commentaires', error);
        } else {
          setComments(data);
        }
      }
    };

    fetchCommentaires();


  }, []);


  if (router.isFallback) {
    return <div className="text-center mt-8">Loading...</div>;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);

    const storedUserData = localStorage.getItem('userData');
    const parsedUserData = JSON.parse(storedUserData);

    const newEntry = {
      user: parsedUserData.id, // Assurez-vous que c'est bien l'ID de l'utilisateur
      article: 1, // ID de l'article
      txt: "text", // Texte du commentaire
      nomuser : "lh"
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
      <div className="max-w-2xl mx-auto p-4">
        <h1 className="text-3xl font-bold mb-4">{movie.title}</h1>
        {movie.posterPath && (
            <img
                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                alt={`${movie.title} Poster`}
                className="w-full h-auto mb-4"
            />
        )}
        <p className="text-gray-700 mb-4">{movie.overview}</p>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-gray-800 mb-2">Ratings:</p>
            <p className="text-xl font-semibold text-gray-800">{movie.ratings}</p>
          </div>
          <div>
            <p className="text-gray-800 mb-2">Duration:</p>
            <p className="text-xl font-semibold text-gray-800">{movie.duration} minutes</p>
          </div>
        </div>
        <div>
          <p className="text-gray-800 mt-4 mb-2">Actors:</p>
          <ul className="list-disc pl-6">
            {movie.actors.map((actor, index) => (
                <li key={index} className="text-gray-800">{actor}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-gray-800 mt-4 mb-2">Director:</p>
          <p className="text-xl font-semibold text-gray-800">{movie.director}</p>
        </div>


        <div className=" px-6 py-24 sm:py-32 lg:px-8 ">

          <p className="text-slate-500">Commentaire :</p>
          {comments.map((comment) => (
              <div key={comment.id}>
                <div className="bubble">
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


export const getStaticPaths = async () => {
  const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28&with_watch_monetization_types=flatrate`;

  try {
    const response = await axios.get(apiUrl);
    const movies: { id: string }[] = response.data.results.map((movie) => ({
      id: movie.id.toString(),
    }));

    const paths = movies.map((movie) => ({
      params: {id: movie.id},
    }));

    return {paths, fallback: false};
  } catch (error) {
    console.error('Error fetching movie list:', error);
    return {paths: [], fallback: false};
  }
};

export const getStaticProps = async ({params}) => {
  const id = params.id;
  const tmdbApiKey = process.env.NEXT_PUBLIC_TMDB_API_KEY;
  const movieUrl = `https://api.themoviedb.org/3/movie/${id}?api_key=${tmdbApiKey}&language=en-US`;
  const creditsUrl = `https://api.themoviedb.org/3/movie/${id}/credits?api_key=${tmdbApiKey}`;

  try {
    const [movieResponse, creditsResponse] = await Promise.all([
      axios.get(movieUrl),
      axios.get(creditsUrl),
    ]);

    const movie: Movie = {
      id: movieResponse.data.id.toString(),
      title: movieResponse.data.title,
      overview: movieResponse.data.overview,
      posterPath: movieResponse.data.poster_path || null,
      ratings: movieResponse.data.vote_average,
      actors: creditsResponse.data.cast
          .slice(0, 5)
          .map((actor) => actor.name),
      director: creditsResponse.data.crew.find(
          (crew) => crew.job === 'Director'
      )?.name || 'N/A',
      duration: movieResponse.data.runtime,
    };

    return {
      props: {
        movie,
      },
    };
  } catch (error) {
    console.error('Error fetching movie data for ID:', id, error);
    return {
      notFound: true,
    };
  }
};

export default MoviePage;
