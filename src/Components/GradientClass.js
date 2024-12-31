// GradientClass.js
export class Gradient {
    constructor() {
        this.animationFrameId = null;
        this.colors = ['#a2d4f7', '#5aaee1', '#d9c9ff', '#9da4f0']; // Default colors
        this.canvas = null;
        this.ctx = null;
        this.speed = 0.00; // Adjust this value to increase/decrease animation speed
        this.offset = 0; // To create the animation effect
    }

    initGradient(canvas) {
        this.canvas = canvas;
        this.ctx = this.canvas.getContext('2d');
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Start the animation
        this.animate();
    }

    setColors(colors) {
        if (Array.isArray(colors) && colors.length > 0) {
            this.colors = colors;
        }
    }

    animate() {
        this.clearCanvas();
        this.createGradient();
        this.offset += this.speed; // Increment offset to animate
        if (this.offset > 1) this.offset = 0; // Loop the offset if it exceeds 1

        this.animationFrameId = requestAnimationFrame(() => this.animate());
    }

    createGradient() {
        if (!this.ctx || !this.canvas) return;

        // Create a linear gradient
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);

        // Add color stops to the gradient with an offset for animation
        this.colors.forEach((color, index) => {
            const position = (index / (this.colors.length - 1)) + this.offset;
            gradient.addColorStop(position % 1, color); // Ensure the position stays within [0, 1]
        });

        // Set the gradient as the fill style and draw a rectangle covering the canvas
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    clearCanvas() {
        if (this.ctx) {
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    pause() {
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }
    }

    resize() {
        if (this.canvas) {
            this.canvas.width = window.innerWidth;
            this.canvas.height = window.innerHeight;
            this.clearCanvas(); // Clear canvas after resizing
            this.createGradient(); // Recreate the gradient after resizing
        }
    }
}
