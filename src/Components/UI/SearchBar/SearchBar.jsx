import React from 'react'
import Input from '../Input/Input'
import { Search } from 'lucide-react'

const SearchBar = ({ value, onChange, placeholder = 'Search recipes...' }) => {
  return (
    <div style={{width: '100%'}}>
      <Input
        icon={Search}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </div>
  )
}

export default SearchBar
