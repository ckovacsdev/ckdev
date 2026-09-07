import './deco-button.css';

export const DecoButton = (props: { 
    type: 'primary' | 'secondary', 
    title: string 
    href?: string,
    onClick?: () => void;
}) => {
    const { type, title, href, onClick } = props;
    
    if(href){
        return(
            <a
                className={`deco-button ${type}`} 
                href={href}
                target='_blank'
                rel='noopener noreferrer'
            >
                {title}
            </a>
        )
    }

    return (
        <button
            className={`deco-button ${type}`} 
            onClick={onClick}
        > 
            {title}
        </button>
    )
}