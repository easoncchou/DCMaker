import { useState } from 'react'
import { DndProvider } from 'react-dnd'
import { HTML5Backend } from 'react-dnd-html5-backend'
import Header from './components/Header'
import Sidebar from './components/Sidebar'
import Grid from './components/Grid'
// import  from './components/'

function App() {

    const [available_id, set_available_id] = useState(0); 

    const gates_init = [
        // {id: 0, 
        //  top_x: 10, 
        //  top_y: 10,  
        //  width: 2, 
        //  height: 2, 
        //  gateType: "AND", 
        //  numInputs: "2", 
        //  numOutputs: "1", 
        //  inputs: [], 
        //  outputs: []}
    ];

    const [gates, setGates] = useState(gates_init)

    return (
        <DndProvider backend={HTML5Backend}>
        <Header/>
        <Sidebar deleteGate={deleteGate} makeGate={makeGate} moveGate={moveGate}/>
        <Grid gates={gates} moveGate={moveGate}/>
        </DndProvider>
    )

    function moveGate(gate_id, toX, toY) {
        setGates(prevGates => {
            return prevGates.map(gate => gate.id === gate_id ? {...gate, top_x: toX, top_y: toY} : gate);
        })
    } 

    function deleteGate(gate_id) {
        setGates(prevGates => {
            const updatedGates = prevGates.filter(item => item.id !== gate_id);
            console.log(updatedGates);  // Log the new state
            return updatedGates;
        });
    }

    function makeGate(gateType, numInputs, numOutputs) {
        // Capture the current available_id
        const currentId = available_id;
    
        // Create the new gate
        const newGate = {
            id: currentId, // Use the captured ID
            top_x: -1,
            top_y: -1,
            width: 2,
            height: Math.max(numInputs, numOutputs),
            gateType: gateType,
            numInputs: numInputs,
            numOutputs: numOutputs,
            inputs: [],
            outputs: []
        };
    
        // console.log(newGate.id);
    
        // Update state
        set_available_id(prev_available_id => prev_available_id + 1); // Increment ID
        setGates(prevGates => [...prevGates, newGate]); // Add the new gate to state
    
        // Return the captured ID
        return currentId;
    }
}

export default App
