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
        // example of a gate object:
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

    const bitmap_init = Array.from({ length: 20 }, () => Array(32).fill(0));

    const [bitmap, setBitmap] = useState(bitmap_init)

    return (
        <DndProvider backend={HTML5Backend}>
        <Header/>
        <Sidebar deleteGate={deleteGate} makeGate={makeGate} moveGate={moveGate}/>
        <Grid bitmap={bitmap} gates={gates} moveGate={moveGate}/>
        </DndProvider>
    )

    function moveGate(gate_id, toX, toY) {
        // Update gates first, and use the updated gates state in the bitmap update
        setGates(prevGates => {
            const updatedGates = prevGates.map(gate =>
                gate.id === gate_id ? { ...gate, top_x: toX, top_y: toY } : gate
            );
    
            // Update the bitmap after gates are updated
            setBitmap(prevBitmap => {
                // Make a copy of the previous bitmap to avoid mutating state directly
                const updatedBitmap = prevBitmap.map(row => [...row]);
    
                // Find the gate being moved
                const gate = prevGates.find(gate => gate.id === gate_id);
    
                if (!gate) {
                    console.error(`Gate with id ${gate_id} not found.`);
                    return prevBitmap; // Return unchanged bitmap
                }
    
                // Clear the old position of the gate in the bitmap
                if (gate.top_x !== -1 && gate.top_y !== -1) {
                    for (let i = gate.top_x; i < gate.top_x + gate.width; i++) {
                        for (let j = gate.top_y; j < gate.top_y + gate.height; j++) {
                            updatedBitmap[j][i] = 0; // Set the old position back to 0
                        }
                    }
                }
    
                // Set the new position of the gate in the bitmap
                for (let i = toX; i < toX + gate.width; i++) {
                    for (let j = toY; j < toY + gate.height; j++) {
                        updatedBitmap[j][i] = 1; // Set the new position to 1 (occupied)
                    }
                }
    
                return updatedBitmap;
            });
    
            return updatedGates; // Return the updated gates
        });
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
            height: numInputs,
            gateType: gateType,
            numInputs: numInputs,
            numOutputs: numOutputs,
            inputs: [],
            outputs: []
        };
    
        // Update state
        set_available_id(prev_available_id => prev_available_id + 1); // Increment ID
        setGates(prevGates => [...prevGates, newGate]); // Add the new gate to state
    
        // Return the captured ID
        return currentId;
    }
}

export default App
