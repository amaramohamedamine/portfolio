import React from 'react'
import {motion} from 'framer-motion';
import {styles} from '../styles';
import {staggerContainer} from '../utils/motion';

const SectionWrapper = (Component,idName) => 
function HOC(){
    return (
        <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{once: true, amount:0.25 }}
    className={`${styles.padding} content-container relative z-0 ${idName === 'about' || idName === 'work' ? 'section-alt-a' : 'section-alt-b'}`} 
        >   
        <span className='hash-span' id={idName}>
            &nbsp;
        </span>
            <Component />
            <div className="mt-16 section-separator" />
        </motion.section>
        )
}
  
    
  


export default SectionWrapper
