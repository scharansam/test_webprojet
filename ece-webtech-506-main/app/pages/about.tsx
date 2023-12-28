import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFilm, faCamera, faCoffee } from '@fortawesome/free-solid-svg-icons';


const About = () => {
  return (
      <div className="container mx-auto mt-8">
        <div className="flex flex-col items-center">
          <h1 className="text-4xl font-bold mb-4 dark:text-amber-50">À propos</h1>
          <div className="w-20 h-1 bg-indigo-500 mb-8"></div>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mb-8 dark:text-amber-50">
            Bienvenue sur notre blog, venez partager votre passion pour le cinéma.
          </p>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mb-8 dark:text-amber-50">
            Vous êtes libres de discuter sur films de votre choix et partager vos passions avec d'autres passionnés.
            Rejoignez l'univers magique du cinéma, où chaque film raconte une histoire unique.
          </p>
          <div className="flex items-center justify-center mb-8">
            <div className="animate-scroll">
              <FontAwesomeIcon icon={faFilm} className="text-3xl text-indigo-500 mr-2"/>
            </div>
            <span className="text-gray-700 dark:text-amber-50">Passionné de films</span>
          </div>
          <div className="flex items-center justify-center mb-8">
            <div className="animate-flash">
              <FontAwesomeIcon icon={faCamera} className="text-3xl text-indigo-500 mr-2"/>
            </div>
            <span className="text-gray-700 dark:text-amber-50">Amateur de photographie</span>
          </div>
          <div className="flex items-center justify-center mb-8">
            <FontAwesomeIcon icon={faCoffee} className="text-3xl text-indigo-500 mr-2"/>
            <span className="text-gray-700 dark:text-amber-50">Accro au pause café et aux conversations </span>
          </div>
          <p className="text-gray-700 text-lg leading-relaxed max-w-2xl mb-8 dark:text-amber-50">
            Merci de faire partie de cette aventure avec nous. N'hésitez pas à explorer le blog, lire les critiques et
            partager vos propres recommandations. Ensemble, créons une communauté passionnée du septième art.
          </p>
          <br/><br/><br/><br/><br/>


        </div>
      </div>
  );
};

export default About;
