export function hasItsOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}
