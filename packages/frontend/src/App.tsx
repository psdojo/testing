editing

import { useState, useEffect } from "react";

//import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card.js";
//import "./../dist/script.js"
import "./tracing.js"
//import "./index.css"

// Supabase constants
const SUPABASE_URL = 'https://etqipujwfnsodacgmqua.supabase.co';
const SUPABASE_API_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV0cWlwdWp3Zm5zb2RhY2dtcXVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDExMzQzNzksImV4cCI6MjA1NjcxMDM3OX0.B32FmMwgeRxkGVBd5bvlTEKzKtIn-5CXQ5mwETVegEg';
const TABLE_NAME = 'inp_events';

export default function InpTestComponent() {
  const [showElement, setShowElement] = useState(false);
  const [duration, setDuration] = useState(100); // default 100ms "work"
  const [latestINP, setLatestINP] = useState(null);

  const handleClick = () => {
    setShowElement(false); // reset
    const start = performance.now();
    while (performance.now() - start < duration) {
      // Simulate blocking render
    }
    setShowElement(true);
  };

  // Fetch latest INP value from Supabase
  useEffect(() => {

    async function fetchINP() {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${TABLE_NAME}?select=inp_value&order=created_at.desc&limit=1`, {
        headers: {
          apikey: SUPABASE_API_KEY,
          Authorization: `Bearer ${SUPABASE_API_KEY}`,

        },
      });

      const data = await res.json();
      if (data && data.length > 0) {
        setLatestINP(data[0].inp_value.toFixed(2)); // 2 decimal precision
      }
    }

    fetchINP();
    const interval = setInterval(fetchINP, 5000); // Poll every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <Card className="w-full">
        <CardHeader>
          <CardTitle>INP Value Aggregated</CardTitle>
        </CardHeader>
        <CardContent>
          {latestINP !== null ? (
            <p className="text-2xl font-semibold text-green-600">{latestINP} ms</p>
          ) : (
            <p className="text-gray-500">Loading...</p>
          )}
        </CardContent>
      </Card>

      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <h2>INP Test</h2>

        <label>
          Delay before render (ms):&nbsp;
          <input
            type="number"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min="0"
          />
        </label>

        <br /><br />

        <button onClick={handleClick}>
          Show Element After Delay
        </button>

        <div style={{ marginTop: '20px' }}>
          {showElement && (
            <div
              style={{
                padding: '10px',
                background: '#d3f9d8',
                border: '1px solid #8cd790',
              }}
            >
              🎉 Element Rendered!
            </div>
          )}
        </div>
      </div>
    </>
  );
}
