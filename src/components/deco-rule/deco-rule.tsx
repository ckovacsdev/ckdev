import './deco-rule.css';

export const DecoRule = () => {
  return (
    <div className='deco-rule'>
		<span className='deco-rule-half deco-rule-half--l'>
			<i className='dr-short' />
			<i className='dr-main' />
			<i className='dr-short' />
		</span>
		<span className='deco-rule-half deco-rule-half--r'>
			<i className='dr-short' />
			<i className='dr-main' />
			<i className='dr-short' />
		</span>
    </div>
  );
};