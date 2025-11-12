/* eslint-disable react/prop-types */
import { VerticalTimeline, VerticalTimelineElement } from 'react-vertical-timeline-component';
import {motion} from 'framer-motion';
import 'react-vertical-timeline-component/style.min.css';
import { styles } from '../styles';
import { experiences } from '../constants/data';
import { SectionWrapper } from '../hoc';
import { textVariant, fadeIn } from '../utils/motion';

function ExperienceCard({ experience, index }) {
  return (
  <VerticalTimelineElement
  contentStyle={{
    background: 'transparent',
    color: '#fff',
    boxShadow: 'none',
    padding: 0,
  }}
  contentArrowStyle={{ borderRight: '0' }}
date={experience.date}
  iconStyle={{
    background: experience.iconBg,
    boxShadow: '0 0 0 3px rgba(255,255,255,0.08), 0 10px 25px rgba(0,0,0,0.35)',
  }}
icon={
  <div className='flex justify-center items-center w-full h-full'>
    <img src={experience.icon}
     alt={experience.company_name}
     className='w-[60%] object-contain' />
  </div>
}
>
  <motion.div
    variants={fadeIn('up', 'spring', index * 0.15, 0.75)}
    initial='hidden'
    whileInView='show'
    viewport={{ once: true, amount: 0.2 }}
    aria-label={`${experience.title} at ${experience.company_name}`}
  >
    <article className='timeline-card focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60'>
      <header className='mb-3'>
        <h3 id={`exp-title-${index}`} className='text-white text-[20px] sm:text-[22px] md:text-[24px] font-bold'>
          {experience.title}
        </h3>
        <p className='text-secondary text-[14px] sm:text-[15px] md:text-[16px] font-semibold m-0'>
          {experience.company_name}
        </p>
      </header>
      <ul className='mt-4 list-disc ml-5 space-y-2'>
        {experience.points.map((point, pIdx) => (
          <li key={`experience-point-${index}-${pIdx}`} className='text-white-100 text-[13px] sm:text-[14px] pl-1 tracking-wider'>
            {point}
          </li>
        ))}
      </ul>
    </article>
  </motion.div>
  </VerticalTimelineElement>
  )
}

function Experience() {
  return (
   <>
   <motion.div variants={textVariant()}>
   <p className={styles.sectionSubText}>What I have done so far</p>
      <h2 className={styles.sectionHeadText}>Work Experience.</h2>
   </motion.div>
   
   <div className='mt-10 flex flex-col'>
    <VerticalTimeline>
      {experiences.map((experience, index) => (
        <ExperienceCard key={index} index={index} experience={experience} />
      ))}
    </VerticalTimeline>
   </div>
    <div className="mt-16 section-separator" />
    </>
  )
}
const WrappedExperience = SectionWrapper(Experience, "experience");
export default WrappedExperience