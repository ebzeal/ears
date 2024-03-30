import 'dotenv/config';

/**
 * @class UtilHelp
 */
class UtilHelp {
  /**
   * @static
   * @description a function for sanitising an array of input strings
   * @param {object} textObj
   * @returns {object} sanitised text
   */
  static cleanInput(textObj) {
    const newObj = {};
    const entries = Object.entries(textObj);
    // eslint-disable-next-line no-restricted-syntax
    for (const [key, value] of entries) {
      const newVal = value.trim().toLowerCase();
      newObj[key] = newVal;
    }
    return newObj;
  }
}

export default UtilHelp;
