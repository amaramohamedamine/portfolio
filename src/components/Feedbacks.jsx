/* eslint-disable react/prop-types */
import { motion } from 'framer-motion';
import { SectionWrapper } from '../hoc';
import { fadeIn, textVariant } from '../utils/motion';
import { testimonials } from '../constants/data';
import { styles } from '../styles';

const FeedbackCard = ({ index, testimonial, name, designation, company, image }) => (
  <motion.div variants={fadeIn("", "spring", index * 0.5, 0.75)} className="bg-[#1d1836] p-5 rounded-3xl sm:w-[320px] w-full">
    <p className='text-white font-black text-[48px]'>"</p>

    <div className='mt-1'>
      <p className='text-white tracking-wider text-[18px]'>{testimonial}</p>
      <div className='mt-7 flex justify-between items-center gap-1'>
        <div className='flex-1 flex flex-col'>
          <p className='text-white font-medium text-[16px]'>
            <span className='blue-text-gradient'>@</span>{name}
          </p>
          <p className='mt-1 text-secondary text-[12px]'>
            {designation} {company}
          </p>
        </div>
        <div>
          <img src={image} alt={`feedback-by-${name}`} className='w-10 h-10 rounded-full object-cover' />
        </div>
      </div>
    </div>
  </motion.div>
);

function Feedbacks() {
  return (
    <>
      {/* This div replicates the Works section header */}
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What Others Say</p>
        <h2 className={styles.sectionHeadText}>Testimonials.</h2>
      </motion.div>

      {/* This div replicates the Works section cards container */}
      <div className="mt-20 flex flex-wrap gap-7">
        {testimonials.map((testimonial, index) => (
          <FeedbackCard
            key={`testimonial-${index}`} // Corrected template literal
            index={index}
            {...testimonial}
          />
        ))}
      </div>
    </>
  );
}

const WrappedFeedbacks = SectionWrapper(Feedbacks, "");
export default WrappedFeedbacks;