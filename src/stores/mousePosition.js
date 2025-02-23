import { atom } from 'nanostores';

// Load initial position from localStorage or use default
const savedPosition = localStorage.getItem('dotGridMousePosition202502240035');
const initialPosition = savedPosition ? JSON.parse(savedPosition) : { x: -1000, y: -1000 };

// Create a store that will be updated less frequently
export const mousePosition = atom(initialPosition);

// Keep the latest position in memory without triggering updates
let currentPosition = initialPosition;
let rafId = null;

// Update the store using requestAnimationFrame for better performance
function updateStore() {
  mousePosition.set(currentPosition);
  localStorage.setItem('dotGridMousePosition202502240035', JSON.stringify(currentPosition));
  rafId = null;
}

// Expose methods to update the position
export function setMousePosition(x, y) {
  currentPosition = { x, y };
  
  // Only schedule a new update if one isn't already pending
  if (!rafId) {
    rafId = requestAnimationFrame(updateStore);
  }
}

export function resetMousePosition() {
  currentPosition = { x: -1000, y: -1000 };
  if (!rafId) {
    rafId = requestAnimationFrame(updateStore);
  }
}
