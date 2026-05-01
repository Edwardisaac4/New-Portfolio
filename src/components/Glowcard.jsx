
/**
 * A card component with a glowing hover effect and 3D tilt.
 * Typically used for testimonials or featured reviews.
 * 
 * @param {Object} props - Component properties.
 * @param {Object} props.card - Data object containing the review text.
 * @param {React.ReactNode} props.children - Child elements to render inside the card (e.g., author info).
 */
const Glowcard = ({ card, children }) => {
    return (
        <div className='card timeline-card rounded-3xl p-10 bg-gradient-to-br from-black-200/60 to-black-300/10 backdrop-blur-2xl shadow-2xl transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_10px_40px_rgba(59,130,246,0.15)] overflow-hidden relative group'>
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 via-blue-500/5 to-purple-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
            <div className='glow' />
            <div className="flex items-center gap-1 mb-5 relative z-10">
                {Array.from({ length: 5 }).map((_, i) => (
                    <img src="/images/star.png" alt="star" key={i} className='w-5 h-5'/>
                ))}
            </div>

            <div className="mb-5 relative z-10">
                <p className='text-white-50 text-lg'>{card.review}</p>
            </div>

            <div className="relative z-10">
                {children}
            </div>
        </div>
        
    )
}

export default Glowcard

