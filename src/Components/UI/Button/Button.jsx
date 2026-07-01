import React from 'react'

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const base = 'btn'
  const variants = {
    primary: 'btn-primary',
    ghost: 'btn-ghost',
  }
  const cls = `${base} ${variants[variant] || ''} ${className}`.trim()
  return (
    <button className={cls} {...props}>
      {children}
    </button>
  )
}

export default Button
