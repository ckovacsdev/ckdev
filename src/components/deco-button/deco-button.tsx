import './deco-button.css';

export const DecoButton = (props: { 
    type: 'primary' | 'secondary', 
    title: string 
    href?: string,
    onClick?: () => void;
}) => {
    const { type, title, href, onClick } = props;
    
    if(href){
        const newTab = !href.startsWith('mailto:');
        return(
            <a
                className={`deco-button ${type}`}
                href={href}
                target={newTab ? '_blank' : undefined}
                rel={newTab ? 'noopener noreferrer' : undefined}
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