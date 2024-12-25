import { useState } from 'react';
import Gate from '../components/Gate';
import Cell from '../components/Cell';
import '../styles/Factory.css';

const Factory = ( { isOpen, makeGate } ) => {

    const [gate, setGate] = useState(null);

    function resetFactory() {
        setGate(null);
    }

    function handleClick(gateType, numInputs, numOutputs) {
        if (gate !== null) {
            return;
        }
        const id = makeGate(gateType, numInputs, numOutputs);
        setGate(<Gate id={id} gateType={gateType} resetFactory={resetFactory}/>);
    }

    return (
        <div className={`factory ${isOpen ? 'open' : 'closed'}`}>
            <div className={`spawnpoint ${isOpen ? 'open' : 'closed'}`}>
                <div className='sub-spawnpoint'>
                    {gate}
                </div>
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
