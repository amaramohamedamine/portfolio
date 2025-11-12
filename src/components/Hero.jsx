import { useState } from 'react';
import { motion } from 'framer-motion';
import { styles } from '../styles';
import { ComputersCanvas } from './canvas';
import { profile } from '../assets';

const Hero = () => {
  const [lampOn, setLampOn] = useState(false);
  
  return (
    <section className='relative w-full min-h-screen mx-auto flex pt-24 pb-10 lg:pt-32'>
      <div className={`content-container w-full grid grid-cols-1 xl:grid-cols-[0.9fr_1.1fr] 2xl:grid-cols-[0.85fr_1.15fr] gap-10 xl:gap-14`}> 
        {/* Text / Intro */}
        <div className='flex flex-col gap-6 justify-start order-2 xl:order-1'>
          <div className='flex items-center gap-4'>
            <span className='avatar-gradient'>
              <img src={profile} alt='Amin profile' className='w-20 h-20 object-cover'/>
            </span>
            <div>
              <h1 className={`${styles.heroHeadText} text-white leading-tight`}>
                Hi, I&apos;m <span className='text-accent'>Amin</span>
              </h1>
              <p className='text-secondary text-sm'>• Data Science Student • Humble Learner • </p>
            </div>
            {/* Lamp toggle button */}
            <button
              type='button'
              aria-label={lampOn ? 'Turn off room light' : 'Turn on room light'}
              aria-pressed={lampOn}
              onClick={() => setLampOn(v => !v)}
              className={`ml-auto inline-flex items-center justify-center w-11 h-11 rounded-full border transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 ${
                lampOn ? 'bg-accent/20 border-accent/50' : 'bg-white/5 border-white/15 hover:bg-white/10'
              }`}
              title={lampOn ? 'Room Light: on' : 'Room Light: off'}
            >
              {/* Updated light bulb icon for room light */}
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M9 18h6M10 21h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                <path d="M12 3a7 7 0 0 0-4 12c.6.5 1 1.2 1 2v0h6v0c0-.8.4-1.5 1-2A7 7 0 0 0 12 3Z" stroke={lampOn ? '#ffffa8' : 'currentColor'} strokeWidth="1.5" fill={lampOn ? '#ffffa833' : 'none'} />
                {/* Additional light rays for room light */}
                {lampOn && (
                  <>
                    <path d="M5 12h1M18 12h1M12 5v1M12 18v1M7.5 7.5l.7.7M15.8 15.8l.7.7M7.5 16.5l.7-.7M15.8 8.2l.7-.7" stroke="#ffffa8" strokeWidth="1"/>
                  </>
                )}
              </svg>
            </button>
          </div>
          <div className='hero-text-backdrop max-w-xl'>
            <p className={`${styles.heroSubText} text-white-100`}>
              Driven by a passion for creating delightful user experiences, I blend design and code to bring ideas to life. My current focus is expanding my technical repertoire through data science and machine learning.
            </p>
          </div>
          <div className='flex flex-wrap items-center gap-3'>
            <a href='#work' className='bg-accent text-white px-5 py-3 rounded-full font-semibold shadow-card hover:bg-accent/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent/60 transition'>View Projects</a>
            <a href='#contact' className='px-5 py-3 rounded-full font-semibold border border-white/15 text-white hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/40 transition'>Contact Me</a>
          </div>
          
        </div>
        {/* 3D Canvas */}
        <div className="hero-3d-container relative order-1 xl:order-2 xl:-mr-10 2xl:-mr-16">
          <div className="hero-3d-overlay" />
          <ComputersCanvas highlightOn={lampOn} />
        </div>
      </div>
      {/* Scroll indicator (single, clear, accessible) */}
      <div className='absolute bottom-6 w-full flex justify-center items-center z-20'>
        <a href="#about" aria-label='Scroll to About section' className='group'>
          <div className='flex items-center gap-2 rounded-full px-4 py-2 border border-white/20 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition'>
            <motion.svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              className='w-4 h-4 text-white/80'
              animate={{ y: [0, 4, 0] }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'loop', ease: 'easeInOut' }}
            >
              <path d="M6 9l6 6 6-6" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </motion.svg>
            <span className='text-xs font-medium text-white/80'>Scroll</span>
          </div>
        </a>
      </div>
    </section>
  );
};

export default Hero;