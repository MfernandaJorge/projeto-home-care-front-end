import { useState, useRef, useEffect } from "react";
import ReactDOM from "react-dom";

const SelectSearch = ({ id, name, value, options = [], placeholder, onChange }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [selectedLabel, setSelectedLabel] = useState("");
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Filtra opções com base no search
  const filteredOptions = options.filter((opt) =>
    opt.label.toLowerCase().includes(search.toLowerCase())
  );

  // Atualiza label selecionada quando value externo muda
  useEffect(() => {
    const selected = options.find((o) => o.value === value)?.label;
    if (selected !== undefined) setSelectedLabel(selected);
  }, [value, options]);

  // Fecha dropdown ao clicar fora
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target)
      ) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const openDropdown = () => {
    if (!inputRef.current) return;
    const rect = inputRef.current.getBoundingClientRect();
    setDropdownPosition({
      top: rect.bottom + window.scrollY,
      left: rect.left + window.scrollX,
      width: rect.width
    });
    setOpen(true);
  };

  const handleSelect = (option) => {
    setSelectedLabel(option.label);
    setSearch(option.label);
    setOpen(false);

    // Envia o valor correto (id/value) para o pai
    onChange({ target: { name, value: option.value } });
  };

  return (
    <div className="select-search" ref={containerRef}>
      <input
        ref={inputRef}
        id={id}
        name={name}
        type="text"
        placeholder={placeholder}
        value={open ? search : selectedLabel || ""}
        onFocus={openDropdown}
        onChange={(e) => {
          setSearch(e.target.value);
          openDropdown();
        }}
        className="select-search-input"
        autoComplete="off"
      />

      {open &&
        ReactDOM.createPortal(
          <div
            ref={dropdownRef}
            className="selectsearch-dropdown"
            style={{
              position: "absolute",
              top: dropdownPosition.top,
              left: dropdownPosition.left,
              width: dropdownPosition.width,
              zIndex: 99999
            }}
          >
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <div
                  key={`${option.value}-${index}`} // ✅ Correção: key única
                  className="selectsearch-option"
                  onMouseDown={(e) => e.preventDefault()} // evita blur antes do click
                  onClick={() => handleSelect(option)}
                >
                  {option.label}
                </div>
              ))
            ) : (
              <div className="selectsearch-option empty">Nenhuma opção</div>
            )}
          </div>,
          document.body
        )}
    </div>
  );
};

export default SelectSearch;
