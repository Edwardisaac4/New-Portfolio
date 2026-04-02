


const Button = ({className, id, text}) => {
    return (
        <a
            onClick={(e) => {
                e.preventDefault();

                const target = document.getElementById('counter')

                if (target && id) {
                    const offset = window.innerHeight * 0.15;
                    const elementTop = target.getBoundingClientRect().top;
                    const targetPosition = elementTop + offset;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    })
                }
            }}
            
            id={id}
            href="" className={`${className ?? ''} cta-wrapper`}>
            <div className="cta-button group">
                <div className="bg-circle" />
                <p className="text">{text}</p>
                <div className="arrow-wrapper">
                    <img src="/images/arrow-down.svg" alt="arrow" />
                </div>
            </div>
        </a>
    )
}

export default Button