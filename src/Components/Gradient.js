import React, { useEffect, useRef } from 'react';
import { Gradient as GradientClass } from './GradientClass.js'; // Adjust the path as necessary

const Gradient = () => {
    const canvasRef = useRef(null); // Reference to the canvas element
    const gradientInstance = useRef(null); // Reference to the Gradient instance

    useEffect(() => {
        // Initialize the Gradient animation
        gradientInstance.current = new GradientClass();
        gradientInstance.current.initGradient(canvasRef.current);

        // Handle cleanup on component unmount
        return () => {
            if (gradientInstance.current) {
                gradientInstance.current.pause(); // Pause the animation
            }
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            id="gradient-canvas"
            style={{
                width: '100%',
                height: '100vh',
                display: 'block',
            }}
        />
    );
};

export default Gradient;
