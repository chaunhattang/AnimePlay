import { motion, useReducedMotion } from "framer-motion";
import { Movie } from "@/lib/types";
import MovieCard from "@/components/MovieCard";
import { Film } from "lucide-react";

type MovieGridProps = {
  movies: Movie[];
};

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

export default function MovieGrid({ movies }: MovieGridProps) {
  const reduceMotion = useReducedMotion();

  if (!movies.length) {
    if (reduceMotion) {
      return (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-16 shadow-card">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
            <Film className="h-8 w-8 text-gray-600" />
          </div>
          <p className="text-lg font-medium text-gray-400">No movies found</p>
          <p className="mt-1 text-sm text-gray-600">Try adjusting your search or filters</p>
        </div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] py-16 shadow-card">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
          <Film className="h-8 w-8 text-gray-600" />
        </div>
        <p className="text-lg font-medium text-gray-400">No movies found</p>
        <p className="mt-1 text-sm text-gray-600">Try adjusting your search or filters</p>
      </motion.div>
    );
  }

  return (
    <motion.div className="grid grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4" variants={containerVariants} initial={reduceMotion ? "visible" : "hidden"} whileInView={"visible"} viewport={{ once: true, amount: 0.2 }}>
      {movies.map((movie) => (
        <motion.div key={movie.id} variants={itemVariants}>
          <MovieCard movie={movie} />
        </motion.div>
      ))}
    </motion.div>
  );
}
