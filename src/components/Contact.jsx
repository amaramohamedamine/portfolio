import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import emailjs from '@emailjs/browser';
import { styles } from '../styles';
import { EarthCanvas } from './canvas';
import { SectionWrapper } from '../hoc';
import { slideIn } from '../utils/motion';
import useInView from '../hooks/useInView';

// Replace these placeholders with your actual, unique IDs
const SERVICE_ID = 'service_84ukipq';
const PUBLIC_KEY = 'KvyIUSOwnadTuFobG';
const CONTACT_TEMPLATE_ID = 'template_6jywegu'; 
const AUTOREPLY_TEMPLATE_ID = 'template_7xd3plj';

function Contact() {
  const formRef = useRef();
  const [form, setForm] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Validation
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      alert('Please fill in all fields before sending.');
      return;
    }

    setLoading(true);

    // Send using emailjs.sendForm for better compatibility
    emailjs.sendForm(
      SERVICE_ID,
      CONTACT_TEMPLATE_ID,
      formRef.current,
      PUBLIC_KEY
    )
      .then(() => {
        // Now, send the "Auto-Reply" email to the user
        emailjs.send(
          SERVICE_ID,
          AUTOREPLY_TEMPLATE_ID,
          {
            to_name: form.name,
            to_email: form.email,
            from_name: 'Mohamed Amine Amara',
          },
          PUBLIC_KEY
        )
          .then(() => {
            setLoading(false);
            alert('✅ Thank you! Your message has been sent successfully. You should receive a confirmation email shortly.');
            setForm({
              name: '',
              email: '',
              message: '',
            });
          }, (error) => {
            setLoading(false);
            console.error('Auto-reply error:', error);
            // Still show success since main message was sent
            alert('✅ Your message has been sent! (Note: Auto-reply may be delayed)');
            setForm({
              name: '',
              email: '',
              message: '',
            });
          });
      }, (error) => {
        setLoading(false);
        console.error('Email send error:', error);
        console.error('Error status:', error.status);
        console.error('Error details:', error.text || error.message);
        
        let errorMessage = '❌ Oops! Something went wrong. ';
        
        if (error.status === 412) {
          errorMessage += 'Email service authentication issue. Please try again later or contact me directly at amaramohamedamine68@gmail.com';
        } else if (error.status === 400) {
          errorMessage += 'Please check all fields are filled correctly.';
        } else {
          errorMessage += 'Please try again or contact me directly at amaramohamedamine68@gmail.com';
        }
        
        alert(errorMessage);
      });
  };

  const { ref: earthRef, inView } = useInView({ threshold: 0.15 });

  return (
    <div className='xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden'>
      <motion.div 
        variants={slideIn('left', "tween", 0.2, 1)}
        className='flex-[0.75] bg-black-100 p-8 rounded-2xl'
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        <form 
          ref={formRef}
          onSubmit={handleSubmit}
          className='mt-12 flex flex-col gap-8'
        >
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Name</span>
            <input 
              type="text" 
              name='from_name'
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="what's your name?"
              required
              className='bg-tertiary py-4 px-6 placeholder:text-secondary
                         text-white rounded-lg outlined-none
                         border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Email</span>
            <input 
              type="email" 
              name='from_email'
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="what's your email?"
              required
              className='bg-tertiary py-4 px-6 placeholder:text-secondary
                         text-white rounded-lg outlined-none
                         border-none font-medium'
            />
          </label>
          <label className='flex flex-col'>
            <span className='text-white font-medium mb-4'>Your Message</span>
            <textarea
              rows="7"
              name='message'
              value={form.message}
              onChange={(e) => setForm({ ...form, message: e.target.value })}
              placeholder="what do you want to say?"
              required
              className='bg-tertiary py-4 px-6 placeholder:text-secondary
                         text-white rounded-lg outlined-none
                         border-none font-medium'
            />
          </label>

          <button
            type='submit'
            disabled={loading}
            className='bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-600 disabled:to-gray-700 disabled:cursor-not-allowed py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl transition-all duration-200 hover:scale-105 active:scale-95'
          >
            {loading ? '✉️ Sending...' : '📧 Send Message'}
          </button>
        </form>
      </motion.div>

      <motion.div 
        variants={slideIn('right', "tween", 0.2, 1)}
        className='xl:flex-1 xl:h-auto md:h-[550px] h-[350px]'
        ref={earthRef}
      >
        {inView ? <EarthCanvas/> : null}
      </motion.div>
    </div>
  );
}

const WrappedContact = SectionWrapper(Contact, "contact");
export default WrappedContact;