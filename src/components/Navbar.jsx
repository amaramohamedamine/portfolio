import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { navLinks } from '../constants/data';
import { logo, menu, close } from '../assets';
import '../index.css';

const Navbar = () => {
  const [active, setActive] = useState('');
  const [toggle, setToggle] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Scroll spy to update active link based on section in view
  useEffect(() => {
    const handler = () => {
      const offset = 120; // match navbar height
      for (const link of navLinks) {
        const el = document.getElementById(link.id);
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const topVisible = rect.top <= offset;
        const bottomPast = rect.bottom < offset;
        if (topVisible && !bottomPast) {
          setActive(link.title);
          break;
        }
      }
    };
    window.addEventListener('scroll', handler, { passive: true });
    handler();
    return () => window.removeEventListener('scroll', handler);
  }, []);

  // Lock body scroll when mobile menu is open
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = toggle ? 'hidden' : prev || '';
    return () => {
      document.body.style.overflow = prev;
    };
  }, [toggle]);

  return (
    <nav className={`w-full fixed top-0 left-0 z-30 px-4 py-3 transition backdrop-blur-md ${scrolled ? 'bg-primary/80 shadow-lg border-b border-white/5' : 'bg-transparent'} `} aria-label="Main Navigation">
      <div className="w-full content-container flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}>
          <img src={logo} alt="logo" className="w-9 h-9 object-contain"/>
          <p className="text-white text-[18px] font-bold cursor-pointer flex">Amin &nbsp;
          <span className="sm:block hidden">| Portfolio</span>
          </p>
        </Link>
        <ul className="list-none hidden md:flex flex-row gap-6">
            {navLinks.map((link) => (
              <li key={link.id}
                className={`${
                  active === link.title 
                  ? 'text-white' 
                  : 'text-gray-400'
                } hover:text-white text-[15px] font-medium cursor-pointer relative group`}
                onClick={() => {
                  setActive(link.title)
              
                }}
              >
                <a href={`#${link.id}`} aria-current={active === link.title ? 'page' : undefined} className='inline-block py-2 px-1'>
                  {link.title}
                  <span className={`absolute left-0 -bottom-1 h-[2px] w-full scale-x-0 group-hover:scale-x-100 transition origin-left bg-accent ${active === link.title ? 'scale-x-100' : ''}`}></span>
                </a>
              </li>
            ))}
          </ul>
        <div className='hidden md:flex items-center'>
          <a href='#contact' className='inline-flex items-center bg-accent/90 hover:bg-accent text-white text-sm font-semibold px-4 py-2 rounded-full shadow-card transition'>Contact</a>
        </div>
        <div className='md:hidden flex flex-1 justify-end items-center'>
          <button
            type="button"
            aria-label={toggle ? 'Close menu' : 'Open menu'}
            aria-expanded={toggle}
            aria-controls="mobile-menu"
            className='p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-secondary'
            onClick={() => setToggle(!toggle)}
          >
            <img 
              src={toggle ? close :  menu} 
              alt=""
              className='w-[28px] h-[28px] object-contain'
            />
          </button>
        </div>
      </div>
        {toggle && (
          <div className="fixed inset-0 z-40 bg-black/70" onClick={() => setToggle(false)}>
            <div
              id="mobile-menu"
              className="absolute top-0 right-0 h-full w-3/4 max-w-xs p-6 bg-primary/95 backdrop-blur-md border-l border-white/10 flex flex-col gap-6"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between">
                <Link to="/" className="flex items-center gap-2" onClick={() => { setActive(''); setToggle(false); }}>
                  <img src={logo} alt="logo" className="w-8 h-8 object-contain"/>
                  <span className="text-white font-semibold">Amin</span>
                </Link>
                <button aria-label="Close menu" className="p-2" onClick={() => setToggle(false)}>
                  <img src={close} alt="" className="w-6 h-6"/>
                </button>
              </div>
              <ul className="list-none flex flex-col gap-4 mt-2">
                {navLinks.map((link) => (
                  <li key={link.id}>
                    <a
                      href={`#${link.id}`}
                      className={`block text-[16px] ${active === link.title ? 'text-white' : 'text-gray-300'} hover:text-white`}
                      onClick={() => { setActive(link.title); setToggle(false); }}
                    >
                      {link.title}
                    </a>
                  </li>
                ))}
              </ul>
              <a href="#contact" className="mt-auto inline-flex items-center justify-center bg-accent/90 hover:bg-accent text-white text-sm font-semibold px-4 py-3 rounded-full shadow-card transition" onClick={() => setToggle(false)}>
                Contact
              </a>
            </div>
          </div>
        )}
      
    </nav>
  );
};

export default Navbar;
