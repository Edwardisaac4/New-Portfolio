/**
 * A reusable section header component.
 * Displays a small sub-heading badge above a larger main title.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.title - The main heading text.
 * @param {string} props.sub - The sub-heading text displayed in a badge.
 */
const TitleHeader = ({ title, sub }) => {
    return (
        <div className='flex flex-col items-center gap-5'>
            <div className="hero-bagde">
                <p>{sub}</p>
            </div>

            <div className="font-semibold md:text-5xl text-3xl">{title}</div>
        </div>
    )
}

export default TitleHeader