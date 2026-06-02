import { useMemo, useRef, useState } from "react";

function Util() {
    const countRef = useRef(0);
    var a = 0;
    const [count, setCount] = useState(0);

    console.log("render");

    return (
        <div>
            <p>Ref Value: {countRef.current}</p>
            <p>State Value: {count}</p>

            <button
                onClick={() => {
                    countRef.current += 1;
                    console.log(countRef.current);
                }}
            >
                Update Ref
            </button>

            <button onClick={() => setCount(count + 1)}>
                Update State
            </button>
            <div>
                <button
                    onClick={() => {
                        a += 1;
                        console.log("LINE31", a);
                    }}
                >
                    Update var
                </button>
            </div>
        </div>
    );
}

export default Util;