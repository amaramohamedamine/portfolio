// Removed direct Tilt import; Card handles optional tilt.
/* eslint-disable react/prop-types */
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { styles } from '../styles';
import { github } from '../assets';
import { SectionWrapper } from '../hoc';
import { projects } from '../constants/data';
import { fadeIn, textVariant } from '../utils/motion';
import Card from './Card';

// Gallery Modal Component
function GalleryModal({ project, onClose }) {
  const [currentImage, setCurrentImage] = useState(0);
  const images = project.gallery || [project.image];

  const nextImage = () => {
    setCurrentImage((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm p-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="relative max-w-4xl w-full bg-gradient-to-br from-[#1a1a2e] to-[#0f0f1e] rounded-2xl p-4 shadow-2xl border border-white/10"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center bg-white/10 hover:bg-white/20 rounded-full transition-all duration-200"
          aria-label="Close gallery"
        >
          <span className="text-white text-2xl">×</span>
        </button>

        {/* Project Title */}
        <div className="mb-3">
          <h2 className="text-white font-bold text-2xl">{project.name}</h2>
          <p className="text-secondary text-xs mt-1">{project.description}</p>
        </div>

        {/* Image Gallery */}
        <div className="relative w-full h-[55vh] bg-black/50 rounded-xl overflow-hidden flex items-center justify-center">
          <img
            src={images[currentImage]}
            alt={`${project.name} screenshot ${currentImage + 1}`}
            className="max-w-full max-h-full object-contain"
          />

          {/* Navigation arrows (only show if multiple images) */}
          {images.length > 1 && (
            <>
              <button
                onClick={prevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="Previous image"
              >
                <span className="text-white text-2xl">‹</span>
              </button>
              <button
                onClick={nextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center bg-black/50 hover:bg-black/70 rounded-full transition-all duration-200 backdrop-blur-sm"
                aria-label="Next image"
              >
                <span className="text-white text-2xl">›</span>
              </button>

              {/* Image counter */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-2 bg-black/70 backdrop-blur-sm rounded-full text-white text-sm">
                {currentImage + 1} / {images.length}
              </div>
            </>
          )}
        </div>

        {/* Thumbnail strip (if multiple images) */}
        {images.length > 1 && (
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentImage(idx)}
                className={`flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden border-2 transition-all duration-200 ${
                  idx === currentImage
                    ? 'border-purple-500 ring-2 ring-purple-500/50'
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        )}

        {/* Tags and Links */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag.name}
                className={`px-2 py-1 rounded-full text-xs font-medium ${tag.color} bg-white/5 border border-white/10`}
              >
                #{tag.name}
              </span>
            ))}
          </div>
          {project.source_code_link && (
            <a
              href={project.source_code_link}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-auto flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 rounded-lg text-white text-xs font-semibold transition-all duration-200 hover:scale-105"
            >
              <img src={github} alt="" className="w-4 h-4" />
              View Code
            </a>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

function ProjectCard({ index, project }) {
  const [showGallery, setShowGallery] = useState(false);
  const { name, description, tags, image } = project;

  const handleCardClick = (e) => {
    e.preventDefault();
    setShowGallery(true);
  };

  return (
    <>
      <motion.div variants={fadeIn("up", "spring", index * 0.5, 0.75)}>
        <div onClick={handleCardClick} className="sm:w-[360px] w-full">
          <Card 
            tilt 
            options={{ max: 15, scale: 1.02, speed: 450 }} 
            className="group cursor-pointer"
          >
          <div className='relative w-full h-[230px] overflow-hidden rounded-2xl bg-black/20 flex items-center justify-center'>
            <img 
              src={image} 
              alt={name}
              className='w-full h-full object-contain transition-transform duration-500 group-hover:scale-110' 
            />
            
            {/* Overlay on hover */}
            <div className='absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6'>
              <span className="text-white font-semibold text-lg flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                View Gallery
              </span>
            </div>
          </div>
          
          <div className='mt-5'>
            <h3 className='text-white font-bold text-[24px]'>{name}</h3>
            <p className='mt-2 text-secondary text-[14px] line-clamp-3'>{description}</p>
          </div>
          
          <div className='mt-4 flex flex-wrap gap-2'>
            {tags.map((tag) => (
              <p key={tag.name} className={`text-[14px] ${tag.color}`}>
                #{tag.name}
              </p>
            ))}
          </div>
        </Card>
        </div>
      </motion.div>

      <AnimatePresence>
        {showGallery && (
          <GalleryModal 
            project={project} 
            onClose={() => setShowGallery(false)} 
          />
        )}
      </AnimatePresence>
    </>
  );
}

function Works() {
  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What I have done so far</p>
        <h2 className={styles.sectionHeadText}>Projects.</h2>
      </motion.div>
      
      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className='mt-3 body-text max-w-3xl'
        >
          Following projects showcases my skills and experience through real-world examples of my work. Each project is briefly described with links to code repositories and live demos. Click any project card to view a detailed gallery of screenshots.
        </motion.p>
      </div>
      
      <div className="mt-20 flex flex-wrap gap-7">
        {projects.map((project, index) => (
          <ProjectCard
            key={`project-${index}`}
            index={index}
            project={project}
          />
        ))}
      </div>
    </>
  );
}

const WrappedWorks = SectionWrapper(Works, "work");
export default WrappedWorks;