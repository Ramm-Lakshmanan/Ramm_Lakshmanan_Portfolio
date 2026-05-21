// Ripple effect utility (JavaScript)
// Attach to any element with class 'ripple-btn'
function createRipple(event) {
  const button = event.currentTarget;
  const ripple = document.createElement('span');
  const diameter = Math.max(button.clientWidth, button.clientHeight);
  const radius = diameter / 2;

  ripple.style.width = ripple.style.height = `${diameter}px`;
  ripple.style.left = `${event.clientX - button.getBoundingClientRect().left - radius}px`;
  ripple.style.top = `${event.clientY - button.getBoundingClientRect().top - radius}px`;
  ripple.classList.add('ripple');

  const existingRipple = button.getElementsByClassName('ripple')[0];
  if (existingRipple) {
    existingRipple.remove();
  }
  button.appendChild(ripple);

  // Remove after animation (600ms)
  setTimeout(() => {
    ripple.remove();
  }, 600);
}

// Export for optional module use (if using ES modules)
if (typeof module !== 'undefined') {
  module.exports = { createRipple };
}
