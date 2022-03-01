import { ChevronDownIcon } from '@heroicons/react/outline';
import React, { createRef, useState, useEffect } from 'react'

const Dropdown = ({ children, dropdownText }) => {
  const wrapperRef = createRef(null);
  const tipRef = createRef(null);
  const [open, setOpen] = useState(false)

  const toggleOpen = () => {
    if (open) {
      closeDropdown();
    } else {
      openDropdown();
    }
  }

  const handleClickOutside = e => {
    if (wrapperRef.current.contains(e.target)) {
      return;
    }
    closeDropdown();
  }

  const closeDropdown = async () => {
    tipRef.current.style.visibility = "hidden";
    tipRef.current.style.opacity = 0;
    tipRef.current.style.marginTop = "10px";
    setOpen(false);
  }

  const openDropdown = () => {
      tipRef.current.style.visibility = "visible";
      tipRef.current.style.opacity = 1;
      tipRef.current.style.marginTop = "20px";
      setOpen(true);
  }

  useEffect(() => {
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div
      ref={wrapperRef}
      className="relative flex items-center"
      onClick={toggleOpen}>
      <div
        className="absolute shadow-md 
        bg-white py-2 rounded flex items-center 
        ease-linear transition-all duration-200 z-50"
        style={{ top: "100%", right: -10, opacity: 0, minWidth: "150px", visibility: "hidden" }}
        ref={tipRef}>
        <div
          className="bg-white h-3 w-3 absolute"
          style={{ top: "-6px", right: 16, transform: "rotate(45deg)" }}
        />
        {children}
      </div>
      <div className="flex items-center cursor-pointer">
        {dropdownText}
        <ChevronDownIcon className="h-4 w-4 ml-2"/>
      </div>
    </div>
  );
}

export default Dropdown