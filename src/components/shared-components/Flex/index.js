import React from 'react'
import PropTypes from 'prop-types'

const Flex = props => {
	const { children, className, alignItems, justifyContent, mobileFlex, flexDirection, gap, name } = props
	const getFlexResponsive = () => mobileFlex ? 'd-flex' : 'd-md-flex';
	const getGap = () => gap ? {gap: gap + 'px'} : {};
	return (
		<div className={`${getFlexResponsive()} ${className} ${flexDirection?('flex-' + flexDirection): ''} ${alignItems?('align-items-' + alignItems):''} ${justifyContent?('justify-content-' + justifyContent):''}` } style={getGap()} name={name}>
			{children}
		</div>
	)
}

Flex.propTypes = {
	className: PropTypes.string,
	alignItems: PropTypes.string,
	flexDirection: PropTypes.string,
	justifyContent: PropTypes.string,
	mobileFlex: PropTypes.bool,
	gap: PropTypes.string,
	name: PropTypes.string,
}

Flex.defaultProps = {
	mobileFlex: true,
	flexDirection: 'row',
	className: ''
};


export default Flex
