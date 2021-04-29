import React, { useState } from 'react';
import Example from '../example/Example';
import States from '../states/States';

const STATES = 'State';
const EXAMPLE = 'Example';

function DynamicDisplay() {
    const [view, setView] = useState(EXAMPLE);

    return (
        <div>
            <button id="dynamic-display-btn" onClick={() => setView(view === STATES ? EXAMPLE : STATES)}>
                {`Switch to ${view === STATES ? EXAMPLE : STATES}`}
            </button>
            {view === STATES ? <States /> : <Example />}
        </div>
    );
}

export default DynamicDisplay;