/**
 * Navigation links for the main website header.
 */
const navLinks = [
  {
    name: "Work",
    link: "#work",
  },
  {
    name: "Experience",
    link: "#experience",
  },
  {
    name: "Skills",
    link: "#skills",
  },
];

/**
 * Words and icons used in the Hero section's animated marquee.
 */
const words = [
  { text: "Ideas",       imgPath: "/images/ideas.svg" },
  { text: "Solutions",   imgPath: "/images/concepts.svg" },
  { text: "Products",    imgPath: "/images/designs.svg" },
  { text: "Interfaces",  imgPath: "/images/code.svg" },
  { text: "Experiences", imgPath: "/images/ideas.svg" },
  { text: "Systems",     imgPath: "/images/concepts.svg" },
  { text: "Animations",  imgPath: "/images/designs.svg" },
  { text: "Innovation",  imgPath: "/images/code.svg" },
];

/**
 * Statistics shown in the Hero/About section counters.
 */
const counterItems = [
  { value: 1, suffix: "+", label: "Years of Experience" },
  { value: 10, suffix: "+", label: "Satisfied Clients" },
  { value: 10, suffix: "+", label: "Completed Projects" },
];

/**
 * Key abilities/skills displayed in the "Why Hire Me?" FeatureCards section.
 */
const abilities = [
  {
    imgPath: "/images/seo.png",
    title: "Scalable Architecture",
    desc: "Designing clean, maintainable codebases built to scale and adapt to complex business requirements.",
  },
  {
    imgPath: "/images/chat.png",
    title: "Cross-Functional Collaboration",
    desc: "Bridging the gap between technical and non-technical teams with proactive, clear communication.",
  },
  {
    imgPath: "/images/time.png",
    title: "Performance Optimization",
    desc: "Delivering fully optimized, lightning-fast applications focused on seamless user experiences.",
  },
  {
    imgPath: "/images/puzzle_icon.png",
    title: "Adaptive Problem Solving",
    desc: "Quickly mastering new technologies and navigating complex logic to deliver innovative solutions out of the box.",
  },
  {
    imgPath: "/images/user_interface_icon.png",
    title: "User-Centric Engineering",
    desc: "Prioritizing accessibility, intuitiveness, and seamless end-to-end journeys in every feature built.",
  },
];

/**
 * Technologies and tools shown in the TechStack marquee section.
 */
const techStackIcons = [
  {
    name: "React",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
    color: "#61DAFB",
  },
  {
    name: "TypeScript",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/typescript/typescript-original.svg",
    color: "#3178C6",
  },
  {
    name: "JavaScript",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
    color: "#F7DF1E",
  },
  {
    name: "Tailwind CSS",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tailwindcss/tailwindcss-original.svg",
    color: "#06B6D4",
  },
  {
    name: "HTML5",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
    color: "#E34F26",
  },
  {
    name: "CSS",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
    color: "#1572B6",
  },
  {
    name: "WordPress",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/wordpress/wordpress-plain.svg",
    color: "#21759B",
  },
  {
    name: "Vite",
    iconPath: "https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg",
    color: "#646CFF",
  },
];

/**
 * Work experience entries displayed in the Experience section.
 */
const expCards = [
  {
    review: "Edward consistently delivers high-quality features and brings a proactive approach to frontend development.",
    imgPath: "/images/logos/ean Aviation.png",
    logoPath: "/images/logos/ean Aviation.png",
    title: "Frontend Developer",
    date: "Present",
    responsibilities: [
      "Building and maintaining modern, responsive web applications.",
      "Collaborating with the team to implement new features and improve UI/UX.",
      "Optimizing web applications for maximum speed and scalability.",
      "Sustaining Network Infrastructure.",
      "Installing and Configuring Softwares.",
      "Troubleshooting Hardware and Software Issues.",
      "Data Backup and Recovery.",
      "Network Security Management",
    ],
  },
  {
    review: "During his 7 months at Greenware Tech, Edward was an eager learner and a valuable addition to the development team.",
    imgPath: "/images/logos/GreenWare.png",
    logoPath: "/images/logos/GreenWare.png",
    title: "Junior Web Developer",
    date: "7 Months",
    responsibilities: [
      "Assisted in developing and maintaining web pages using HTML, CSS, and JavaScript.",
      "Worked closely with senior developers to troubleshoot bugs and implement UI improvements.",
      "Gained hands-on experience in modern frontend practices and responsive design concepts.",
      "Helped In Tutoring Other Students In HTML, CSS, JavaScript, And Wordpress"
    ],
  }
];


/**
 * Social media links displayed in the Footer.
 */
const socialImgs = [
  {
    name: "Instagram",
    imgPath: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/instagram.svg",
    url: "https://www.instagram.com/isaacdrumz4",
  },
  {
    name: "WhatsApp",
    imgPath: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg",
    url: "https://wa.me/2347087374423",
  },
  {
    name: "X",
    imgPath: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/x.svg",
    url: "https://x.com/isaacdrumz4",
  },
  {
    name: "LinkedIn",
    imgPath: "https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/linkedin.svg",
    url: "https://www.linkedin.com/in/edward-isaac-5b7544310/",
  },
];

/**
 * Projects displayed in the ShowCase (Work Space) section.
 */
const projects = [
  {
    id: 0,
    title: 'Movie Landing Page',
    desc: 'A responsive website that allows users to browse and search for movies and anime. It features a modern UI with a dark theme and smooth animations. The website is built with Vanilla JS, HTML, CSS and uses the IMDB API to fetch movie and anime data.',
    tech: ['HTML', 'CSS', 'Vanilla JS', 'IMDB API'],
    media: { type: 'video', src: '/images/project3.mp4', poster: '/images/project3.png' },
    link: 'https://github.com/yourusername/project1'
  },
  {
    id: 1,
    title: 'Ean Jets Booking',
    desc: 'A high-end private jet charter booking experience focusing on premium design, fast response times, and ease of use.',
    tech: ['React', 'Tailwind CSS', 'Typescript'],
    media: { type: 'image', src: '/images/ean-jets.png' },
    link: 'https://github.com/yourusername/project2'
  },
  {
    id: 2,
    title: 'Zentry Clone',
    desc: 'A High End Landing Page with Smooth Animations and Responsive Design',
    tech: ['React', 'Tailwind CSS', 'JavaScript'],
    media: { type: 'video', src: '/images/project1.mp4', poster: '/images/project1.png' },
    link: 'https://github.com/Edwardisaac4/new-gaming'
  }
];

/**
 * Footer navigation links.
 */
const menuLinks = [
  { label: "Home", href: "#hero" },
  { label: "About", href: "#about" },
  { label: "Experience", href: "#experience" },
  { label: "Skills", href: "#skills" },
  { label: "Contact", href: "#contact" },
];

export {
  words,
  abilities,
  counterItems,
  expCards,
  socialImgs,
  techStackIcons,
  navLinks,
  projects,
  menuLinks,
};
