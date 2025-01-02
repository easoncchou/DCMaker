import { useState, useEffect } from 'react'
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

    const [gates, setGates] = useState(gates_init);

    const bitmap_init = Array.from({ length: 20 }, () => Array(32).fill(0));

    const [bitmap, setBitmap] = useState(bitmap_init);

    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        // Track mouse movement
        const handleMouseMove = (event) => {
            setMousePosition({
                x: Math.floor(event.clientX / 50),
                y: Math.floor((event.clientY - 14 ) / 50), // offset for header
            });
        };

        // Listen for specific key presses
        const handleKeyDown = (event) => {
            switch(event.key) {
                case 'w':
                    makeWire('WIRE-VERTICAL', mousePosition.x, mousePosition.y);
                    break;
                case 'q':
                    makeWire('WIRE-TOPLEFT', mousePosition.x, mousePosition.y);
                    break;
                case 'e':
                    makeWire('WIRE-TOPRIGHT', mousePosition.x, mousePosition.y);
                    break;
                case 'a':
                    makeWire('WIRE-BOTLEFT', mousePosition.x, mousePosition.y);
                    break;
                case 's':
                    makeWire('WIRE-HORIZONTAL', mousePosition.x, mousePosition.y);
                    break;
                case 'd':
                    makeWire('WIRE-BOTRIGHT', mousePosition.x, mousePosition.y);
                    break;
                case 'Backspace':
                    for (let i = 0; i < gates.length; i++) {
                        if (gates[i].top_x ===  mousePosition.x &&
                            gates[i].top_y === mousePosition.y) 
                        {   
                            console.log(gates[i]?.id);
                            deleteGate(gates[i]?.id);
                        }
                    }
                    break;
            }
        };

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('keydown', handleKeyDown);

        // Cleanup event listeners on unmount
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [mousePosition, gates]); // Rerun the effect when mouse position changes

    return (
        <DndProvider backend={HTML5Backend}>
        <Header/>
        <Sidebar deleteGate={deleteGate} makeGate={makeGate} moveGate={moveGate}/>
        <Grid bitmap={bitmap} gates={gates} moveGate={moveGate}/>
        </DndProvider>
    );

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
    };

    function deleteGate(gate_id) {
        setGates(prevGates => {
            const gateToDelete = prevGates.find(gate => gate.id === gate_id);

            if (!gateToDelete) {
                console.error(`Gate with id ${gate_id} not found.`);
                return prevGates;
            }

            // Update the bitmap to clear the gate's position
            setBitmap(prevBitmap => {
                const updatedBitmap = prevBitmap.map(row => [...row]);

                for (let i = gateToDelete.top_x; i < gateToDelete.top_x + gateToDelete.width; i++) {
                    for (let j = gateToDelete.top_y; j < gateToDelete.top_y + gateToDelete.height; j++) {
                        if (i !== -1 && j !== -1) {
                            updatedBitmap[j][i] = 0; // Clear the bitmap position
                        }
                    }
                }

                return updatedBitmap;
            });

            const updatedGates = prevGates.filter(item => item.id !== gate_id);
            console.log(updatedGates);  // Log the new state
            return updatedGates;
        });
    };

    function makeGate(gateType, numInputs, numOutputs, width, height, x, y) {
        // Capture the current available_id
        const currentId = available_id;
    
        // Create the new gate
        const newGate = {
            id: currentId, // Use the captured ID
            top_x: x,
            top_y: y,
            width: width,
            height: height,
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
    };

    function makeWire(wireType, x, y) {
        // Check if the bitmap position is empty (0)
        if (bitmap[y][x] === 0) {
            
            // Create a copy of the current bitmap to update it immutably
            const updatedBitmap = [...bitmap];
    
            updatedBitmap[y][x] = 1; // Set the position to 1 (occupied)
    
            // Now update the bitmap state with the updated copy
            setBitmap(updatedBitmap);
    
            // Call makeGate with wireType to create a new gate at the position
            makeGate(wireType, 1, 1, 1, 1, x, y);
            console.log(`makeGate at ${x}, ${y}`);
        }
    }
    

    function updateConnections() {
        
    }
}

export default App
