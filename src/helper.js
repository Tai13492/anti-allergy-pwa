export function beautifyDirtyUrl(str) {
  let words = str.split("-");
  words = words.map(word => capitalizeFirstLetter(word));
  return words.join(" ");
}

export function capitalizeFirstLetter(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
