import React from 'react';

// Define the complex CSS for the loader
const loaderStyles = `
  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 50px;
    aspect-ratio: 1;
    display: grid;
    pointer-events: none;
  }

  .loading-spinner::before,
  .loading-spinner::after {
    content:"";
    grid-area: 1/1;
    --c: no-repeat radial-gradient(farthest-side, #25b09b 92%, #0000);
    background:
      var(--c) 50% 0,
      var(--c) 50% 100%,
      var(--c) 100% 50%,
      var(--c) 0 50%;
    background-size: 12px 12px;
    animation: l12 1s infinite;
  }

  .loading-spinner::before {
    margin: 4px;
    filter: hue-rotate(45deg);
    background-size: 8px 8px;
    animation-timing-function: linear;
  }

  @keyframes l12 {
    100% { transform: rotate(.5turn); }
  }
`;
/**
 * A reusable component that displays a CSS-based custom loader animation.
 * * @param {object} props - Component props
 * @param {string} [props.className] - Optional class names to apply to the container.
 * @returns {JSX.Element} The CustomLoader component.
 */
export const LoadingSpinner = ({ className = '' }) => {
  return (
    <>
      {/* Inject the required CSS styles. 
        In a real application, you would put this CSS in a .css or .module.css file 
        and import it, rather than injecting it inline like this.
      */}
      <style>{loaderStyles}</style>
      
      {/* Main loader element */}
      <div className={`loading-spinner ${className}`} role="status" aria-label="Loading">
        {/* The animation is handled purely by the ::before and ::after pseudo-elements */}
      </div>
    </>
  );
};
