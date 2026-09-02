import './deco-button.css';

export const DecoButton = (props: { type: 'primary' | 'secondary', title: string }) => {
    const { type, title } = props;
    
    return (
        <button className={`deco-button ${type}`}> 
            {title}
        </button>
    )
}