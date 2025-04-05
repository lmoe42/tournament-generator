import React from 'react';
import { ReactSVG } from 'react-svg';

interface TrophyIconProps {
  color: string;
  size: string;
}

const TrophyIcon: React.FC<TrophyIconProps> = ({ color, size }) => {
  return (
    <ReactSVG
      key={`${color}-${size}`}
      src="./trophy.svg?v=1"
      beforeInjection={(svg) => {
        svg.setAttribute('fill', color);
        svg.setAttribute('width', size);
        svg.setAttribute('height', size);
      }}
    />
  );
};

export default TrophyIcon;