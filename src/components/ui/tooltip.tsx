
import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';

const Tooltip = React.memo(({ text, position, children }) => {
  const [isVisible, setIsVisible] = useState(false)

  // Handle mouse enter and leave events
  const handleMouseEnter = useCallback(() => {
    setIsVisible(true)
  }, [])

  const handleMouseLeave = useCallback(() => {
    setIsVisible(false)
  }, [])

  const tooltipStyle = {
    position: 'absolute',
    backgroundColor: 'black',
    color: 'white',
    padding: '8px',
    borderRadius: '4px',
    whiteSpace: 'nowrap',
    zIndex: 1000,
    ...(position === 'bottom' && { top: '75%', left: '50%', transform: 'translateX(-50%)', marginTop: '8px' }),
    ...(position === 'top' && { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: '8px' }),
    ...(position === 'left' && { right: '100%', top: '50%', transform: 'translateY(-50%)', marginRight: '8px' }),
    ...(position === 'right' && { left: '100%', top: '50%', transform: 'translateY(-50%)', marginLeft: '8px' })
  }

  const arrowStyle = {
    position: 'absolute',
    width: '0',
    height: '0',
    borderStyle: 'solid',
    ...(position === 'bottom' && { bottom: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: '0 6px 6px 6px', borderColor: 'transparent transparent black transparent' }),
    ...(position === 'top' && { top: '100%', left: '50%', transform: 'translateX(-50%)', borderWidth: '6px 6px 0 6px', borderColor: 'black transparent transparent transparent' }),
    ...(position === 'left' && { left: '100%', top: '50%', transform: 'translateY(-50%)', borderWidth: '6px 0 6px 6px', borderColor: 'transparent transparent transparent black' }),
    ...(position === 'right' && { right: '100%', top: '50%', transform: 'translateY(-50%)', borderWidth: '6px 6px 6px 0', borderColor: 'transparent black transparent transparent' })
  }

  return (
    <div
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      {isVisible && (
        <div className='zoom-tooltip-text' style={tooltipStyle}>
          {text}
          <div style={arrowStyle} />
        </div>
      )}
    </div>
  )
})

Tooltip.propTypes = {
  children: PropTypes.node,
  text: PropTypes.string,
  position: PropTypes.string
}

Tooltip.displayName = 'Tooltip'

export { Tooltip };
