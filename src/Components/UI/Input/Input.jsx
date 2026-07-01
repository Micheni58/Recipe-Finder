import React from 'react'

const Input = ({ icon: Icon, type = 'text', className = '', ...props }) => {
  return (
    <div style={{position: 'relative'}}>
      {Icon && (
        <div style={{position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-secondary)'}}>
          <Icon size={18} />
        </div>
      )}
      <input
        className={`input ${className}`}
        style={{ paddingLeft: Icon ? 44 : undefined }}
        type={type}
        {...props}
      />
    </div>
  )
}

export default Input
