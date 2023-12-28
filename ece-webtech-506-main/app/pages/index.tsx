import React from 'react';
import Link from 'next/link';
import axios from 'axios';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

interface Movie {
  id: number;
  title: string;
  overview: string;
  posterPath: string | null;
}

interface ArticlesProps {
  movies: Movie[];
}

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

const NextArrow: React.FC<any> = (props) => {
  const { className, onClick } = props;
  return (
      <div className={className} onClick={onClick}>

      </div>
  );
};

const PrevArrow: React.FC<any> = (props) => {
  const { className, onClick } = props;
  return (
      <div className={className} onClick={onClick}>
      </div>

  );
};


const Articles: React.FC<ArticlesProps> = ({ movies }) => {
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    nextArrow: <NextArrow />,
    prevArrow: <PrevArrow />,
  };

  return (
      <div>
        <div className="bg-amber-50 dark:bg-black">
          <div className="container mx-auto my-8 ">
            <h1 className="text-3xl   text-center dark:text-amber-50">Liste des films</h1>
            <Slider {...settings}>
              {movies.map( (movie) => (
                  <div key={movie.id} className="mb-8">
                    <Link href={`/articles/${movie.id}`}>
                      <div className="block group text-center">
                        {movie.posterPath && (
                            <img
                                src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
                                alt={`${movie.title} Poster`}
                                className="w-1/4 h-1/2 object-cover mx-auto my-auto rounded-md"
                            />
                        )}
                        <h2 className="mt-2 text-xl font-semibold text-amber-50 text-gray-800 dark:text-amber-50">
                          {movie.title}
                        </h2>
                      </div>
                    </Link>
                  </div>
              ))}
            </Slider>
          </div>
        </div>
      </div>
  );
};

export default Articles;
