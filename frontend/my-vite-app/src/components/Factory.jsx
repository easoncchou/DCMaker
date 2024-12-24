import { useState } from 'react';
import Gate from '../components/Gate';
import '../styles/Factory.css';

const Factory = ( { isOpen, makeGate } ) => {

    const [gate, setGate] = useState(null)

    function handleClick(gateType, numInputs, numOutputs) {
        const id = makeGate(gateType, numInputs, numOutputs);
        setGate(<Gate id={id}/>);
    }

    return (
        <div className={`factory ${isOpen ? 'open' : 'closed'}`}>
            <div className={`spawnpoint ${isOpen ? 'open' : 'closed'}`}>
                {gate}
            </div>
            <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('AND', 2, 1)}> 
                AND 
            </button>
            <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('OR', 2, 1)}> 
                OR 
            </button>
            <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('NOT', 1, 1)}>
                NOT
            </button>
        </div>
    );
};

export default Factory;
