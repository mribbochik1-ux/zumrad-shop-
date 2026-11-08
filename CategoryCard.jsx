import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCard = ({ category }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  return (
    <Link
      to={`/katalog?kategoriya=${encodeURIComponent(category.name)}`}
      className="group relative flex flex-col overflow-hidden rounded-2xl bg-zinc-50 border border-zinc-100 hover:border-zinc-300 transition-all duration-300 hover:shadow-xl"
    >
      {/* Large Image with subtle hover zoom */}
      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-200">
        {!isLoaded && <div className="absolute inset-0 skeleton" />}
        <img
          src={category.image}
          alt={category.name}
          loading="lazy"
          onLoad={() => setIsLoaded(true)}
          className={`h-full w-full object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108 ${
            isLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
        {/* Subtle gradient vignette */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

        {/* Hover Arrow Icon */}
        <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 backdrop-blur-sm text-zinc-950 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shadow-md">
          <ArrowUpRight className="w-4 h-4 text-[#FF8A00]" />
        </div>
      </div>

      {/* Label Below */}
      <div className="p-3.5 bg-white flex items-center justify-between">
        <div>
          <h3 className="font-heading font-black text-sm sm:text-base text-zinc-950 uppercase tracking-tight group-hover:text-[#FF8A00] transition-colors">
            {category.name}
          </h3>
          {category.description && (
            <p className="text-[11px] text-zinc-600 line-clamp-1 mt-0.5">
              {category.description}
            </p>
          )}
        </div>
      </div>
    </Link>
  );
};
