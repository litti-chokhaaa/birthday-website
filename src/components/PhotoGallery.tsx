import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, X, Heart, MapPin, Sparkles } from 'lucide-react';
import { THEME } from '../config/theme';
import { PhotoItem } from '../types';

export const PhotoGallery: React.FC = () => {
  const [photosList] = useState<PhotoItem[]>(THEME.photos);
  const [selectedTag, setSelectedTag] = useState<string>('All');
  const [activePhoto, setActivePhoto] = useState<PhotoItem | null>(null);

  const tags = ['All', ...Array.from(new Set(photosList.map((p) => p.tag || 'Memory')))];

  const filteredPhotos = selectedTag === 'All'
    ? photosList
    : photosList.filter((p) => p.tag === selectedTag);

  const formatUrl = (url: string) => {
  if (!url) return '';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:')) {
    return url;
  }
  return `${import.meta.env.BASE_URL}${url}`;
};

  return (
    <section id="gallery" className="py-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto relative">
      {/* Section Heading */}
      <div className="text-center max-w-2xl mx-auto mb-12">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-100/80 text-amber-900 text-xs font-semibold mb-3">
          <Camera className="w-3.5 h-3.5 text-amber-600" />
          <span>Captured Moments</span>
        </div>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif font-bold text-[#3d3228] tracking-tight mb-4">
          Picture Perfect Moments
        </h2>
        <p className="text-sm sm:text-base text-[#786b5f]">
          Every photo tells a story filled with happiness, kindness, and unforgettable memories.
        </p>

        {/* Filter Tags */}
        <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
          {tags.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(tag)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedTag === tag
                  ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                  : 'glass-card text-[#6e6052] hover:bg-white/80'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      {/* Gallery Grid - Polaroid Layout */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredPhotos.map((photo, index) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.6, delay: index * 0.05 }}
            whileHover={{ y: -8, rotate: index % 2 === 0 ? 1.5 : -1.5 }}
            onClick={() => setActivePhoto(photo)}
            className="cursor-pointer group relative bg-white p-4 pt-6 rounded-2xl shadow-md border border-stone-200/80 transition-all duration-300 hover:shadow-xl"
          >
            {/* Polaroid Pin */}
            <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-6 h-6 rounded-full bg-rose-400/80 border-2 border-white shadow-sm z-10 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>

            {/* Photo Container */}
            <div className="relative aspect-[4/5] rounded-xl overflow-hidden bg-stone-100 mb-4">
              <img
                src={formatUrl(photo.url)}
                alt={photo.caption}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-xs font-medium flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-400 fill-rose-400" /> View memory
                </span>
              </div>
            </div>

            {/* Polaroid Caption */}
            <div className="px-1">
              <p className="font-serif text-[#3d3228] font-medium text-sm sm:text-base leading-snug line-clamp-2">
                "{photo.caption}"
              </p>
              <div className="flex items-center justify-between text-[11px] text-[#8c7b6c] font-medium mt-2 pt-2 border-t border-stone-100">
                <span>
                  {photo.date}
                </span>
                {photo.location && (
                  <span className="flex items-center gap-1 text-amber-700">
                    <MapPin className="w-3 h-3" /> {photo.location}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {activePhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setActivePhoto(null)}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 sm:p-6"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-3xl w-full bg-white rounded-3xl p-4 sm:p-6 shadow-2xl overflow-hidden"
            >
              <button
                onClick={() => setActivePhoto(null)}
                className="absolute top-4 right-4 z-10 w-9 h-9 rounded-full bg-stone-900/60 text-white hover:bg-stone-900/80 flex items-center justify-center transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="relative aspect-[4/3] sm:aspect-[16/10] rounded-2xl overflow-hidden bg-stone-900 mb-4">
                <img
                  src={formatUrl(activePhoto.url)}
                  alt={activePhoto.caption}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>

              <div className="px-2 text-center">
                <p className="font-serif text-lg sm:text-xl font-medium text-[#3d3228] mb-2">
                  "{activePhoto.caption}"
                </p>
                <div className="flex items-center justify-center gap-4 text-xs font-semibold text-[#786b5f]">
                  <span>
                    {activePhoto.date}
                  </span>
                  {activePhoto.location && (
                    <span className="flex items-center gap-1 text-rose-500">
                      <MapPin className="w-3.5 h-3.5" /> {activePhoto.location}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
