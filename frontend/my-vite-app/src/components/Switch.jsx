import { useState } from 'react';
import { ItemTypes  } from '../Constants';
import { useDrag } from 'react-dnd';
import '../styles/Switch.css';

const Switch = ( {id, resetFactory = null} ) => {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.GATE,
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        end: (item, monitor) => {
            if (monitor.didDrop() && resetFactory !== null) {
                resetFactory();
            }
        }
    }));

    const [switchHigh, setSwitchHigh] = useState(false);

    function handleToggle() {
        setSwitchHigh((prevSwitchHigh) => !prevSwitchHigh);
    } 
    
    return (
        <div 
            className={`switch ${switchHigh ? 'high' : 'low'}`}
            ref={drag}
            onClick={handleToggle}
        >
            {/* switch {id} */}
            <div className={`switch-knob ${switchHigh ? 'high' : 'low'}`}>
                {switchHigh ? 1 : 0}
            </div>
        </div>
    );
};

export default Switch;
