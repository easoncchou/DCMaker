import { useState } from 'react';
import Gate from './Gate';
import Switch from '../components/Switch';
import Led from '../components/Led';
import '../styles/Factory.css';

const Factory = ({ isOpen, makeGate }) => {

    const [gate, setGate] = useState(null);

    function resetFactory() {
        setGate(null);
    }

    function handleClick(gateType, numInputs, numOutputs, width, height) {
        if (gate !== null) {
            return;
        }
        var id;
        switch (gateType) {
            case 'LED':
                id = makeGate(gateType, numInputs, numOutputs, width, height, -1, -1);
                setGate(<Led id={id} isOn={false} resetFactory={resetFactory} />);
                break;
            case 'SWITCH':
                id = makeGate(gateType, numInputs, numOutputs, width, height, -1, -1);
                setGate(<Switch id={id} resetFactory={resetFactory} />);
                break;
            default:
                id = makeGate(gateType, numInputs, numOutputs, width, height, -1, -1);
                setGate(<Gate id={id} gateType={gateType} resetFactory={resetFactory} />);
                break;
        }
    }

    return (
        <div className={`factory ${isOpen ? 'open' : 'closed'}`}>
            <div className={`spawnpoint ${isOpen ? 'open' : 'closed'}`}>
                <div className='sub-spawnpoint'>
                    {gate}
                </div>
            </div>
            <div className={`factory button-grid ${isOpen ? 'open' : 'closed'}`}>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('AND', 2, 1, 3, 3)}>
                    AND
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('OR', 2, 1, 3, 3)}>
                    OR
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('NOT', 1, 1, 1, 1)}>
                    NOT
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('WIRE-TOPLEFT', 1, 1, 1, 1)}>
                    ┐ (q)
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('WIRE-VERTICAL', 1, 1, 1, 1)}>
                    &#8597; (w)
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('WIRE-TOPRIGHT', 1, 1, 1, 1)}>
                    ┌ (e)
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('WIRE-BOTLEFT', 1, 1, 1, 1)}>
                    ┘ (a)
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('WIRE-HORIZONTAL', 1, 1, 1, 1)}>
                    &#8596; (s)
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('WIRE-BOTRIGHT', 1, 1, 1, 1)}>
                    └ (d)
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('SWITCH', 0, 1, 1, 1)}>
                    SWITCH
                </button>
                <button className={`factory-button ${isOpen ? 'open' : 'closed'}`} onClick={() => handleClick('LED', 1, 0, 1, 1)}>
                    LED
                </button>
            </div>
        </div>
    );
};

export default Factory;
