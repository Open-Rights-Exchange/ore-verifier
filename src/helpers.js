/* helper functions 
 */
const hash = require("hash.js")

function encrypt(param) {
    let encryptedParam
    encryptedParam = hash.sha256().update(param).digest('hex')
    return encryptedParam
}

module.exports = {
    encrypt
}