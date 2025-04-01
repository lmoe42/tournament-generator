import React from "react";

interface SVGProps {
  color: string;
  svg: string;
  width?: string;
}

const TrophyPicture: React.FC<SVGProps> = ({ color, svg, width = "300px" }) => {

const decodedSvg = decodeURIComponent(svg);  

  const modifiedSvg = decodedSvg.replace(/fill="#[0-9A-Fa-f]{3,6}"/g, `fill="${color}"`);

  return <div style={{ width, height: "auto" }} dangerouslySetInnerHTML={{ __html: modifiedSvg }} />;
};

export default TrophyPicture;