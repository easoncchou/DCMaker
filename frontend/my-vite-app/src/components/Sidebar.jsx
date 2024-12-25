import React, { useState } from 'react';
import Bin from '../components/Bin';
import Factory from '../components/Factory';
import '../styles/Sidebar.css';

const Sidebar = ( { deleteGate, makeGate, moveGate } ) => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Close' : '>'}
      </button>
      <div className="menu">
        <a>Help</a>
      </div>
      <Factory isOpen={isOpen} makeGate={makeGate} />
      <Bin isOpen={isOpen} deleteGate={deleteGate}/>
    </div>
  );
};

export default Sidebar;
