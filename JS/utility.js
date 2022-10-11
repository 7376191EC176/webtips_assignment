/**
 * To update the HTML values or the images with the id, attribute, and the value to be updated.
 * @param {id} UIElementID the elementID in which the inner HTML has to be changed
 * @param {attribute} UIAttribute attributes(src,innerHTML) denotes whether html content or image is to be updated.
 * @param {string} valueToUpdate value which is to be displayed based on the elementID
 * @return {void} nothing
 */
function updateUIElementAttributeWithGivenValue(
  UIElementID,
  UIAttribute,
  valueToUpdate
) {
  if (UIAttribute == "src") {
    document.getElementById(UIElementID).src = valueToUpdate;
  } else if (UIAttribute == "innerHTML") {
    document.getElementById(UIElementID).innerHTML = valueToUpdate;
  }
}

/**
 * To display the number in 2 digit
 * @param {integer} number display to be in 2 digit
 * @return {string} number with 2 digit display
 */
 function appendZero(number) {
  return number < 10 ? "0" + number : number;
}

export { updateUIElementAttributeWithGivenValue , appendZero};
