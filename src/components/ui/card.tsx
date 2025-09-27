"use client";

interface CardProps {
  title?: string;
  children?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ title, children }) => {
  return (
    <div className="p-4 border rounded-lg shadow-sx bg-white">
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <div>{children}</div>
    </div>
  );
};

export default Card;
