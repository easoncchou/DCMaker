import React, { useState } from 'react';
import { ItemTypes  } from '../Constants';
import { useDrag } from 'react-dnd';
import '../styles/Gate.css';

const Gate = ( {id} ) => {

    const [{ isDragging }, drag] = useDrag(() => ({
        type: ItemTypes.GATE,
        item: { id },
        collect: (monitor) => ({
            isDragging: !!monitor.isDragging()
        })
    }));

    return (
        <div className="gate" ref={drag}>
            gate {id}
        </div>
    );
};

export default Gate;
