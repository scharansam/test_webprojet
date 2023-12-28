import React, { useState } from 'react';

function Example(): React.JSX.Element {
    // Declare a new state variable, which we'll call "count"
    const [count, setCount] = useState(0);

    return (
        <div>
            <br/>
            <p className="flex justify-center">You clicked {count} times</p>
            <button className="mt-6 flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-600 px-8 py-3 text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2" onClick={() => setCount(count + 1)}>
                Click me
            </button>
        </div>
    );
}

export default Example; // Ajoutez cette ligne pour exporter Example par défaut
