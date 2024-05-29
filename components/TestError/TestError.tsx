"use client"
import React, { useState, useEffect } from 'react';

export default function TestError() {

    const [testError, setTestError] = useState(false);

    if (testError) throw new Error('test error.tsx');
    
    return (
    <button
        onClick={() => {
            setTestError(true);
        }}
    >
        Error
    </button>
    );
}
