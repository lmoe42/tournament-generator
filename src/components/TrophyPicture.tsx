import React from 'react';
import { ReactSVG } from 'react-svg';

interface TrophyIconProps {
  color: string;
  size: string;
}

const TrophyIcon: React.FC<TrophyIconProps> = ({ color, size }) => {
  return (
    <ReactSVG
      src="./src/assets/trophy.svg"
      beforeInjection={(svg) => {
        svg.setAttribute('fill', color);
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
      }}
      style={{ width: 1000 }}
    />
  );
};

export default TrophyIcon;