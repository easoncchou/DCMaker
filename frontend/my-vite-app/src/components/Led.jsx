import { ItemTypes  } from '../Constants';
import { useDrag } from 'react-dnd';
import '../styles/Led.css';

const Led = ( {isOn, id, resetFactory = null} ) => {

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
    
    return (
        <div className={`led-${isOn ? 'on' : 'off'}`} ref={drag}>
            led {id}
        </div>
    );
};

export default Led;
