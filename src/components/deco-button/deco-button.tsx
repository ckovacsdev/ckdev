import './deco-button.css';

export const DecoButton = (props: { 
    type: 'primary' | 'secondary', 
    title: string 
    onClick: () => void;
}) => {
    const { type, title, onClick } = props;
    
    return (
        <button 
            className={`deco-button ${type}`} 
            onClick={() => onClick()}
        > 
            {title}
        </button>
    )
}