"use client";
import React, { useRef } from 'react'
import '../css/whyChooseUs.css'
import { motion, useInView } from 'framer-motion'

const features = [
  {
    title: 'Transparent Pricing',
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
        <path d="M26.5991 76.13L3.62914 53.17C1.44914 50.99 1.44914 47.46 3.62914 45.28L32.3991 16.51C33.3391 15.57 34.5991 14.99 35.9291 14.89L60.7491 13.04C64.1491 12.79 66.9791 15.62 66.7291 19.0201L64.8791 43.84C64.7791 45.17 64.2091 46.42 63.2591 47.37L34.4891 76.14C32.3091 78.32 28.7791 78.32 26.5991 76.14V76.13Z" stroke="#3EFCFF" stroke-width="2" stroke-miterlimit="10"/>
        <path d="M46.9996 68.72C60.1992 68.72 70.8996 58.0196 70.8996 44.82C70.8996 31.6204 60.1992 20.92 46.9996 20.92C33.8 20.92 23.0996 31.6204 23.0996 44.82C23.0996 58.0196 33.8 68.72 46.9996 68.72Z" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M66.0995 59.52L77.0795 70.5C78.2995 71.72 78.2995 73.69 77.0795 74.91C75.8595 76.13 73.8895 76.13 72.6695 74.91L61.6895 63.93" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M47.3595 32.63H51.7695L53.3795 30.15H36.7995L35.1895 32.63H37.9895C40.8995 32.63 43.5895 32.85 44.6595 35.32H36.7995L35.1895 37.8H44.9895V37.91C44.9895 39.74 43.4795 42.54 38.5295 42.54H36.0495V44.91L45.7395 57.08H50.1495L40.0295 44.48C44.2295 44.26 48.0995 41.9 48.6395 37.81H51.7595L53.3695 35.33H48.5295C48.4195 34.36 47.9895 33.39 47.3495 32.64L47.3595 32.63Z" fill="#3EFCFF"/>
        <path d="M60.0797 19.68C58.1397 17.84 56.9297 15.23 56.9297 12.35C56.9297 6.76999 61.4597 2.23999 67.0397 2.23999C72.6197 2.23999 77.1497 6.76999 77.1497 12.35C77.1497 17.93 72.6197 22.46 67.0397 22.46" stroke="#3EFCFF" stroke-width="2" stroke-miterlimit="10" stroke-linecap="round"/>
      </svg>
    ),
  },
  {
    title: 'No Hidden Fees',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M42.3408 31.62H45.7108L46.9408 29.73H34.2808L33.0508 31.62H35.1908C37.4108 31.62 39.4608 31.78 40.2908 33.68H34.2908L33.0608 35.57H40.5408V35.65C40.5408 37.05 39.3908 39.18 35.6108 39.18H33.7208V40.99L41.1208 50.28H44.4908L36.7608 40.66C39.9708 40.5 42.9308 38.69 43.3408 35.56H45.7208L46.9508 33.67H43.2508C43.1708 32.93 42.8408 32.19 42.3508 31.61L42.3408 31.62Z" fill="#3EFCFF"/>
            <path d="M40 78C60.9868 78 78 60.9868 78 40C78 19.0132 60.9868 2 40 2C19.0132 2 2 19.0132 2 40C2 60.9868 19.0132 78 40 78Z" stroke="#3EFCFF" stroke-width="2" stroke-miterlimit="10"/>
            <path d="M66.5196 13.48L13.3496 66.65" stroke="#3EFCFF" stroke-width="2" stroke-miterlimit="10"/>
            <path d="M60.6094 43.8601C60.6094 55.0501 51.5394 60.1701 40.3594 60.1701C29.1794 60.1701 20.1094 55.0401 20.1094 43.8601C20.1094 34.9401 25.8694 24.4001 33.8694 20.5101C35.9094 19.5101 38.0894 18.9401 40.3594 18.9401C42.6294 18.9401 44.8294 19.5101 46.8594 20.5101C54.8594 24.4201 60.6094 34.9501 60.6094 43.8601Z" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M51.7797 14.08L47.3997 20.26C47.2897 20.41 47.1197 20.51 46.9297 20.51H46.8697C44.8297 19.51 42.6397 18.94 40.3697 18.94C38.0997 18.94 35.9097 19.51 33.8797 20.51H33.7997C33.6097 20.51 33.4297 20.41 33.3297 20.26L28.9497 14.08C28.6597 13.67 28.9697 13.12 29.4697 13.15L35.0197 13.55L34.4997 12.48C34.3197 12.09 34.5997 11.64 35.0297 11.64H45.7297C46.1597 11.64 46.4397 12.09 46.2597 12.48L45.7397 13.55L51.2897 13.15C51.7897 13.12 52.0997 13.67 51.8097 14.08H51.7797Z" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M45.7196 13.55L44.5996 15.88" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M36.1102 15.88L34.9902 13.55" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
  },
  {
    title: 'Secure Enquiry',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M40 3.04004C18.44 17.93 2 8.50004 2 8.50004C2 60.82 40 76.96 40 76.96C40 76.96 78 60.82 78 8.50004C78 8.50004 61.56 17.93 40 3.04004Z" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M51.5395 38.34V47.01C51.5395 49.88 49.1895 52.23 46.3195 52.23H29.1895L24.1595 57.72V52.23C21.2895 52.23 18.9395 49.88 18.9395 47.01V38.34C18.9395 35.47 21.2895 33.12 24.1595 33.12H46.3195C49.1895 33.12 51.5395 35.47 51.5395 38.34Z" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M65.2308 23.82V34.52C65.2308 38.05 62.3308 40.95 58.8008 40.95V46.09L53.6608 40.95H51.5408V38.35C51.5408 35.48 49.1908 33.13 46.3208 33.13H25.0508V23.83C25.0508 20.3 27.9508 17.4 31.4808 17.4H58.7908C62.3208 17.4 65.2208 20.3 65.2208 23.83L65.2308 23.82Z" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
  },
  {
    title: 'Flexible Charter Options',
    icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" viewBox="0 0 80 80" fill="none">
            <path d="M69.0803 31.1099C68.9803 30.2499 65.2103 26.6499 59.5203 28.5199C55.5703 29.8099 22.4803 44.08 22.4803 44.08C22.4803 44.08 21.7803 44.2899 20.4403 43.4099C19.1003 42.5299 15.1503 38.5799 12.5403 39.7299C12.5403 39.7299 10.7603 40.7899 10.9203 41.2099C11.4903 42.6699 17.2903 50.9699 17.2903 50.9699C17.2903 50.9699 18.2703 52.2799 21.6803 52.1299C23.5003 52.0499 28.0103 52.0899 40.5903 46.2199C40.5903 46.2199 38.1303 61.4199 38.0103 62.3999C37.8003 64.2199 38.9503 64.7699 41.8103 61.9099C44.6703 59.0499 52.0503 41.15 52.0503 41.15C52.0503 41.15 63.8103 35.5299 65.6603 34.2799C67.5103 33.0299 68.9703 31.8499 69.0703 31.0999L69.0803 31.1099Z" stroke="#3EFCFF" stroke-width="2" stroke-miterlimit="10"/>
            <path d="M34.6311 38.8699L24.3111 32.3199C24.3111 32.3199 23.2811 31.7399 23.9511 31.1999C24.6211 30.6599 26.7811 30.2299 28.2011 30.3199C29.6211 30.4099 38.9811 32.8499 44.3211 34.7599" stroke="#3EFCFF" stroke-width="2" stroke-miterlimit="10"/>
            <path d="M13.19 66.93C6.28 60.05 2 50.52 2 40C2 19.01 19.01 2 40 2C48.82 2 56.95 5.01 63.4 10.05" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M55.9707 11.75L63.3907 10.06L62.7507 2.73999" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M66.8096 13.0699C73.7196 19.9499 77.9996 29.4799 77.9996 39.9999C77.9996 60.9899 60.9896 77.9999 39.9996 77.9999C31.1796 77.9999 23.0496 74.9899 16.5996 69.9499" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M24.0294 68.25L16.6094 69.94L17.2494 77.26" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
  },
  {
    title: '24/7 Booking & Support',
    icon: (
        <svg width="80" height="80" viewBox="0 0 80 80" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M33.796 48H28.516V47.1L29.44 46.248C31.276 44.544 32.14 43.608 32.152 42.576C32.152 41.88 31.78 41.268 30.76 41.268C30.064 41.268 29.488 41.616 29.092 41.916L28.66 40.872C29.224 40.416 30.076 40.068 31.06 40.068C32.788 40.068 33.628 41.16 33.628 42.432C33.628 43.8 32.644 44.904 31.276 46.164L30.604 46.752V46.776H33.796V48ZM39.5936 48H38.2016V46.02H34.6616V45.06L37.8536 40.2H39.5936V44.904H40.6016V46.02H39.5936V48ZM36.0776 44.904H38.2016V42.78C38.2016 42.336 38.2256 41.892 38.2496 41.424H38.2016C37.9616 41.916 37.7576 42.312 37.5176 42.744L36.0776 44.88V44.904ZM41.9952 48.468H40.9752L43.8912 39.768H44.9232L41.9952 48.468ZM45.5462 40.2H50.7902V41.148L47.4902 48H45.9422L49.2302 41.448V41.424H45.5462V40.2Z" fill="#3EFCFF"/>
            <path d="M40.0004 67.1C54.9673 67.1 67.1004 54.9669 67.1004 40C67.1004 25.0331 54.9673 12.9 40.0004 12.9C25.0335 12.9 12.9004 25.0331 12.9004 40C12.9004 54.9669 25.0335 67.1 40.0004 67.1Z" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M40 15.15V18.68" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M64.8503 40H61.3203" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M40 64.8499V61.3199" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M15.1504 40H18.6804" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M61.5207 27.58L58.4707 29.34" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M52.4202 61.52L50.6602 58.47" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.4805 52.42L21.5305 50.66" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M27.5801 18.48L29.3401 21.53" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M52.4202 18.48L50.6602 21.53" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M61.5207 52.42L58.4707 50.66" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M27.5801 61.52L29.3401 58.47" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M18.4805 27.58L21.5305 29.34" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M78 40C78 60.99 60.99 78 40 78C19.01 78 2 60.99 2 40C2 19.01 19.01 2 40 2C48.82 2 56.95 5.01 63.4 10.05" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M55.9707 11.75L63.3907 10.06L62.5407 2.91003" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M40 28V36.1" stroke="#3EFCFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        </svg>
    ),
  },
];

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.28,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 80 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const hoverMotion = {
  scale: 1.05,
  y: -12,
  transition: { duration: 0.05, ease: [0.4, 0, 0.2, 1] },
};

function WhyChooseUsClient() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });

  return (
    <section className="why-choose-us" ref={ref}>
      <h2>WHY CHOOSE US?</h2>
      <p className="subtitle">Delivering trust, comfort, and reliability — because your journey deserves nothing less.</p>
      <motion.div
        className="features"
        variants={containerVariants}
        initial="hidden"
        animate={isInView ? "show" : "hidden"}
      >
        {features.map((feature, idx) => (
          <motion.div
            className="feature-card animated-feature-card"
            key={feature.title}
            variants={cardVariants}
            whileHover={hoverMotion}
          >
            <div className="feature-icon">{feature.icon}</div>
            <div className="feature-title">{feature.title}</div>
          </motion.div>
        ))}
      </motion.div>
    </section>
  )
}

export default WhyChooseUsClient
