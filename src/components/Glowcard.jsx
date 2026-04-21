
const Glowcard = ({ card, children }) => {
    return (
        <div className='card card-bordr timeline-card rounded-xl p-10'>
            <div className='glow' />
            <div className="flex items-center gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, i) => (
                    <img src="/images/star.png" alt="star" key={i} className='w-5 h-5'/>
                ))}
            </div>

            <div className="mb-5">
                <p className='text-white-50 text-lg'>{card.review}</p>
            </div>

            {children}
        </div>
        
    )
}

export default Glowcard

