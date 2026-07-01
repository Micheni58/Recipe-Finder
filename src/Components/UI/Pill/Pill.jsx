import React from 'react'

const Pill = ({ children, className = '' }) => {
  return (
    <span className={`pill ${className}`}>
      {children}
    </span>
  )
}

export default Pill
