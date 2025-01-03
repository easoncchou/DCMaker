import { ItemTypes } from '../Constants';
import { useDrop } from 'react-dnd';
import '../styles/Bin.css';

const Bin = ( { isOpen, deleteGate } ) => {

    const [ { isOver } , drop] = useDrop(() => ({
        accept: ItemTypes.GATE,
        drop: (item) => {
            // Accessing the dragged item's id
            deleteGate(item.id);
        },
        collect: monitor => ({
            isOver: !!monitor.isOver()
        })
    }));

    return (
        <div className={`bin ${isOpen ? 'open' : 'closed'} ${isOver ? 'hover' : ''}`} ref={drop}>
            <p>&#128465;</p>
            (backspace / x)
        </div>
    );
};

export default Bin;
