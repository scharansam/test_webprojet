import Link from 'next/link';
import axios from 'axios';
import React, { useState, useEffect } from 'react';
import supabase from '../supabaseClient';

interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
}

interface ArticlesProps {
  movies: Movie[];
}

const insertMoviesIntoDatabase = async (movies: Movie[]) => {
  try {
    const moviesToInsert = movies.map((movie) => ({
      id: movie.id,
      name: movie.title,
      description: movie.overview,
      director: '',
    }));

    const { data, error } = await supabase.from('articlesAPI').upsert(moviesToInsert);

    if (error) {
      throw error;
    }

    console.log('Données insérées avec succès:', data);
  } catch (error) {
    console.error('Erreur lors de l\'insertion des données:', error);
  }
};

export async function getStaticProps() {
  const tmdbApiKey = process.env.TMDB_API_KEY;
  const apiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${tmdbApiKey}&language=en-US&sort_by=popularity.desc&include_adult=false&include_video=false&page=1&with_genres=28&with_watch_monetization_types=flatrate`;

  try {
    const response = await axios.get(apiUrl);
    const movies: Movie[] = response.data.results.map((movie) => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      posterPath: movie.poster_path,
    }));

    await insertMoviesIntoDatabase(movies);

    return {
      props: {
        movies,
      },
    };
  } catch (error) {
    console.error('Error fetching movie data:', error);
    return {
      props: {
        movies: [],
      },
    };
  }
}

const Articles: React.FC<ArticlesProps> = ({ movies }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);


  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        

        let query = supabase.from('articlesAPI').select('*');
        
        if (searchTerm) {
          query = query.ilike('name', `%${searchTerm}%`);
        }
        
        const { data, error } = await query;
        
        if (error) {
          throw error;
        }
        
        console.log('Noms des films récupérés:', data);
        const movieDataPromises = data.map(async (article) => {
          const response = await axios.get(`https://api.themoviedb.org/3/search/movie`, {
            params: {
              api_key: process.env.NEXT_PUBLIC_TMDB_API_KEY,
              query: article.name
            }
          });
          const movie = response.data.results[0];
          console.log('Réponse de l\'API pour', article.name, movie);
          console.log('Movie ID:', movie.id);

  return {
    ...movie,
    id: movie.id,
    title: movie.title,
    poster_path: movie.poster_path
  };
});
          
   
        
        const moviesData = await Promise.all(movieDataPromises);
        console.log('Données des films à définir dans l\'état:', moviesData);
        
        setArticles(moviesData);
        setLoading(false);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles :', error);
        setLoading(false);
      }
    };
  
    const timeoutId = setTimeout(() => {
      fetchArticles();
    }, 200);
  
    return () => clearTimeout(timeoutId);
  }, [searchTerm]);
  
  



  return (
      <div className="container mx-auto my-8">
        <div className="flex ">
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4 dark:text-white">Liste des films</h1>
          </div>

          <div className="flex-2">
            <input
                type="text"
                placeholder="Rechercher des films"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="  p-2 border   rounded-md dark:bg-gray-900 dark:text-white"
            />
          </div>

        </div>

        <br/><br/>
        <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        {articles.map((article) => (
              <li key={article.id} className="mb-8">
                <Link href={`/articles/${article.id}`}>
                  <div className="block group" role="link" tabIndex={0}>
                    {article.poster_path && (
                        <img
                            src={`https://image.tmdb.org/t/p/w500${article.poster_path}`}
                            alt={`${article.title} Poster`}
                            className="w-full h-full object-cover rounded-md transition duration-300 transform group-hover:scale-105 dark:text-white"
                        />
                    )}
                    <h2 className="mt-2 text-xl font-semibold text-gray-800 group-hover:text-blue-500 dark:text-white">
                      {article.title}
                    </h2>
                  </div>
                </Link>
              </li>
          ))}
        </ul>

      </div>
  );
};

export default Articles;