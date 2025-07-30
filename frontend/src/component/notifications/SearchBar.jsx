// src/component/notifications/SearchBar.jsx
import React from 'react'
import pencilIcon from '../../assets/icons/pencil.svg'
import searchIcon from '../../assets/icons/search.svg'  // ← 이렇게

export default function SearchBar() {
  return (
    <div className="search-bar">
      <input 
        type="text"
        className="search-input" 
        placeholder="공지 검색..." 
        />
      <img 
        src={searchIcon} 
        alt="검색" 
        className="search-icon" 
        />
    </div>
  )
}