import { ItemTypes } from '../Constants';
import { useDrop } from 'react-dnd';
import '../styles/Gate.css';

const Cell = ({ id, top_x, top_y, width, height, moveGate, children }) => {

    const [, drop] = useDrop(() => ({
        accept: ItemTypes.GATE,
        canDrop: () => (children === null),
        drop: (item) => {
            // Accessing the dragged item's id
            moveGate(item.id, top_x, top_y);
        },
    }), [children, top_x, top_y]);

    return (
        <div
            className="grid-cell"
            ref={drop}
            style={{
                gridColumn: `${top_x} / span ${width}`, // Gate spans columns
                gridRow: `${top_y} / span ${height}`,  // Gate spans rows
            }}
        >
            {children}
            
        </div>
    );
};

export default Cell;
