import React, { useState } from 'react';
import { ItemTypes  } from '../Constants';
import { useDrag } from 'react-dnd';
import '../styles/Gate.css';

const Gate = ( {gateType, id, resetFactory = null} ) => {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.GATE,
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        }),
        end: (item, monitor) => {
            if (monitor.didDrop()) {
                resetFactory();
            }
        }
    }));
    

    return (
        <div className={`gate ${gateType}`} ref={drag}>
            {gateType} {id}
        </div>
    );
};

export default Gate;
