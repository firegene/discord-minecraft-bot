/** 15 minutes in milliseconds */
const RESEED_FREQUENCY = 1000 * 60 * 15;

/**
 * @param s A seed for the random generation
 * the same seed will always result in the same numbers
 * @returns {function(): number}
 */
function seededRand(s) {
  /**
   * Returns a random number in the range 0 ... 1
   */
  return function() {
    s = Math.sin(s) * 10000;
    return s - Math.floor(s);
  };
}

/**
 * Offsets the given value by a random offset from the normal distribution
 * The offset changes based on {@link RESEED_FREQUENCY}
 * @param val The value to apply the offset to
 * @param width The strength of the offset
 * @returns {number} The value with a random offset applied
 */
function getApproximate(val, width){
  let seed = Math.floor(new Date().getTime() / RESEED_FREQUENCY);
  let rand = seededRand(seed);
  return val + randomOffset(rand) * width;
}

function randomOffset(randomSource){
  let x1, x2, rad;
  let rand = randomSource;
  do {
    x1 = 2 * rand() - 1;
    x2 = 2 * rand() - 1;
    rad = x1 * x1 + x2 * x2;
  } while(rad >= 1 || rad === 0);

  let c = Math.sqrt(-2 * Math.log(rad) / rad);
  return x1 * c
}

module.exports.getApproximate = getApproximate;
