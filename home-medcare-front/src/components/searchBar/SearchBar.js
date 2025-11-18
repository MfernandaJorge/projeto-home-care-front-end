import React from "react";

const SearchBar = ({ value, onChange, onSearch }) => {
  return (
    <div className="search-container">
      <input
        className="search-input"
        type="text"
        placeholder="Buscar por nome, documento ou telefone..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
};

export default SearchBar;