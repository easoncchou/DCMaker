import React, { useState } from 'react';
import Gate from '../components/Gate'
import Cell from '../components/Cell'
import '../styles/Grid.css';

const Grid = ({ bitmap, gates, moveGate }) => {

    function renderGrid(i, gates) {
        const x = i % 32;
        const y = Math.floor(i / 32);
        const isGateHere = gates.find((element) => x === element.top_x && y === element.top_y);
        const gate = isGateHere ? <Gate id={isGateHere?.id} gateType={isGateHere?.gateType}/> : null;
        return (
            <Cell key={i} bitmap={bitmap} id={i} top_x={x} top_y={y} width={gate ? isGateHere.width : 1} height={gate ? isGateHere.width : 1} moveGate={moveGate}>
                {gate}
                {/* {bitmap[y][x]} */}
            </Cell>
        )
    }

    const cells = [];

    for (let i = 0; i < 640; i++) {
        cells.push(renderGrid(i, gates));
    }

    return (
        <div className="grid">
            {cells}
        </div>
    );
};

export default Grid;
