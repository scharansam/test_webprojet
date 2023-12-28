import React from 'react';
import { useUser } from '../../UserContext';

interface FooterProps {
  companyName: string;
  year: number;
}

const Footer: React.FC<FooterProps> = ({ companyName, year }) => {
  return (
      <footer className="bg-black text-white py-8">
        <div className="container mx-auto flex justify-between">
          <div className="max-w-xs">
            <p className="text-lg">&copy; {year} {companyName}</p>
            <p>Contactez-nous : contact@notreblog.com</p>
          </div>
          <div className="max-w-xs">
            <p>Adresse : 3 Rue du blog, Ville</p>
            <p>Téléphone : 01 23 35 48 96</p>
          </div>
        </div>
      </footer>
  );
}

export default Footer;
