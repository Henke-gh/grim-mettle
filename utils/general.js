//Capitalise first letter in a string.
export const capitalise = (str) => str.charAt(0).toUpperCase() + str.slice(1);

//Get random audience attendance
export function getAudience() {
  const audience = Math.round(Math.random() * 2000 + 500);

  return audience;
}

// Simple async timer
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
