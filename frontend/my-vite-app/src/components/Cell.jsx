import { ItemTypes } from '../Constants';
import { useDrop } from 'react-dnd';
import '../styles/Gate.css';

const Cell = ({ bitmap, id, top_x, top_y, width, height, moveGate, children }) => {

    const [ { isOver } , drop] = useDrop(() => ({
        accept: ItemTypes.GATE,
        canDrop: () => {
            // Iterate over the area in the bitmap for the gate's new position
            for (let j = top_y; j < top_y + height; j++) {
                for (let i = top_x; i < top_x + width; i++) {
                    // Check if the position is valid and not occupied
                    if (j >= bitmap.length || i >= bitmap[0].length || bitmap[j][i] === 1) {
                        return false; // Out of bounds or occupied
                    }
                }
            }
            return true; // Drop allowed if all cells are valid
        },
        drop: (item) => {
            moveGate(item.id, top_x, top_y);
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver()
        })
    }), [top_x, top_y, width, height, bitmap]);

    return (
        <div
            className={`grid-cell ${isOver ? 'hover' : ''}`}
            ref={drop}
            style={{
                gridColumn: `${top_x} / span ${width}`, // Gate spans columns
                gridRow: `${top_y} / span ${height}`,  // Gate spans rows
            }}
        >
            {children}
            {/* {top_x}, {top_y} */}
        </div>
    );
};

export default Cell;
