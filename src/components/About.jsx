import { Tilt } from 'react-tilt';
import { motion } from 'framer-motion';

import { styles } from '../styles';
import { imageAmine } from '../assets';
import { fadeIn, textVariant } from '../utils/motion';
import { SectionWrapper } from "../hoc";

 

 
const About = () => {
  return (
    <>
    <motion.div variants={textVariant()}> 
      <p className={styles.sectionSubText}>About</p>
      <h2 className={styles.sectionHeadText}>Overview</h2>
    </motion.div>

    <div className='mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8 xl:gap-12 items-start'>
      {/* Left: intro */}
      <div className="space-y-6">
        <motion.p
          className="text-secondary text-[16px] sm:text-[17px] leading-[28px] sm:leading-[30px] max-w-2xl"
          variants={fadeIn("up", "spring", 0.05, 0.8)}
        >
          I recently graduated with a Bachelor&apos;s degree in Business Intelligence. As a full stack developer and an
          AI &amp; data science enthusiast, I love crafting user‑friendly, accessible interfaces and integrating smart,
          data‑driven features. I&apos;m actively deepening my specialization in data science and AI so I can weave
          predictive and generative capabilities into the products I build—while also refining visual storytelling
          through video and graphic design.
        </motion.p>

        {/* Quick highlights */}
        <motion.ul
          className="grid grid-cols-2 gap-3 sm:gap-4 max-w-xl"
          variants={fadeIn("up", "spring", 0.08, 0.8)}
        >
          <motion.li 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: "rgba(145,94,255,0.5)", backgroundColor: "rgba(145,94,255,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-sm font-semibold text-white">Full Stack</p>
            <p className="text-xs text-secondary mt-1">end‑to‑end builds</p>
          </motion.li>
          <motion.li 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: "rgba(47,128,237,0.5)", backgroundColor: "rgba(47,128,237,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-sm font-semibold text-white">AI &amp; Data</p>
            <p className="text-xs text-secondary mt-1">specializing further</p>
          </motion.li>
          <motion.li 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: "rgba(168,85,247,0.5)", backgroundColor: "rgba(168,85,247,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-sm font-semibold text-white">Design</p>
            <p className="text-xs text-secondary mt-1">video &amp; graphics</p>
          </motion.li>
          <motion.li 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: "rgba(34,197,94,0.5)", backgroundColor: "rgba(34,197,94,0.1)" }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-sm font-semibold text-white">Student</p>
            <p className="text-xs text-secondary mt-1">of the domain</p>
          </motion.li>
        </motion.ul>

        
      </div>

      {/* Right: profile */}
      <div className='space-y-4'>
        <Tilt className='w-full' options={{ max: 15, scale: 1.05, speed: 400 }}>
          <motion.div
            className="w-full p-[1px] rounded-2xl shadow-card transition-all duration-300"
            style={{ background: 'linear-gradient(135deg, rgba(145,94,255,0.5) 0%, rgba(47,128,237,0.4) 100%)' }}
            variants={fadeIn("up", "spring", 0.12, 0.8)}
            whileHover={{ boxShadow: "0 0 30px rgba(145,94,255,0.4)" }}
          >
            <div className="bg-white/5 border border-white/10 backdrop-blur-md rounded-2xl p-5 flex items-center gap-4">
              <motion.img
                src={imageAmine}
                alt="Amin's profile"
                className="w-20 h-20 rounded-xl object-cover ring-2 ring-white/10"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ type: "spring", stiffness: 300 }}
              />
              <div className="min-w-0">
                <p className="text-xs text-secondary">Full Stack Developer</p>
                <h3 className="text-white text-[18px] font-semibold leading-snug truncate">AI &amp; Data Science Enthusiast</h3>
                <ul className="mt-2 flex flex-wrap gap-2">
                  <motion.li 
                    className="text-[11px] text-white/90 rounded-full border border-white/10 bg-white/5 px-2 py-1 cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(145,94,255,0.2)" }}
                  >
                    Business Intelligence Graduate
                  </motion.li>
                  <motion.li 
                    className="text-[11px] text-white/90 rounded-full border border-white/10 bg-white/5 px-2 py-1 cursor-pointer"
                    whileHover={{ scale: 1.1, backgroundColor: "rgba(47,128,237,0.2)" }}
                  >
                    Video &amp; Graphic Design
                  </motion.li>
                </ul>
              </div>
            </div>
          </motion.div>
        </Tilt>

        <motion.div
          className="grid grid-cols-2 gap-3 sm:gap-4"
          variants={fadeIn("up", "spring", 0.16, 0.8)}
        >
          <motion.div 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: "rgba(145,94,255,0.5)", boxShadow: "0 0 20px rgba(145,94,255,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-xs text-secondary">Location</p>
            <p className="text-sm text-white mt-1">Tunisia</p>
          </motion.div>
          <motion.div 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300"
            whileHover={{ scale: 1.05, borderColor: "rgba(34,197,94,0.5)", boxShadow: "0 0 20px rgba(34,197,94,0.3)" }}
            whileTap={{ scale: 0.95 }}
          >
            <p className="text-xs text-secondary">Availability</p>
            <p className="text-sm text-white mt-1">Open to work</p>
          </motion.div>
          <motion.div 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300 col-span-2"
            whileHover={{ scale: 1.02, borderColor: "rgba(47,128,237,0.5)", boxShadow: "0 0 20px rgba(47,128,237,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-xs text-secondary">Email</p>
            <p className="text-sm text-white mt-1 truncate">amaramohamedamine68@gmail.com</p>
          </motion.div>
          <motion.div 
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 cursor-pointer transition-all duration-300 col-span-2"
            whileHover={{ scale: 1.02, borderColor: "rgba(168,85,247,0.5)", boxShadow: "0 0 20px rgba(168,85,247,0.3)" }}
            whileTap={{ scale: 0.98 }}
          >
            <p className="text-xs text-secondary">Focus</p>
            <p className="text-sm text-white mt-1">AI, Data, DevOps</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
    </>
  )
}

const AboutSection = SectionWrapper(About, "about");
export default AboutSection;