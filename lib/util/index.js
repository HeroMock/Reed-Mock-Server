const path = require('path')

Object.prototype.isEmpty = function () {
    return Object.getOwnPropertyNames(this).length == 0
}

Object.prototype.isArray = function () {
    return Array.isArray(this)
}

Array.prototype.removeAt = function (index) {
    if (index < 0 || index >= this.length) return false

    this.splice(index, 1)
    return true
}

/**
     * Remove first element in the array where predicate, return true if success
     * @param predicate (value: T, index: number, obj: T[]) => boolean
     * @param thisArg If provided, it will be used as the this value for each invocation of
     * predicate. If it is not provided, undefined is used instead.
     * @returns {boolean}
     */
Array.prototype.removeFirst = function (predicate, thisArg) {
    const index = this.findIndex(predicate, thisArg)
    return this.removeAt(index)
}


// flat / flatMap requires node version >= 11.0.0

Array.prototype.flatMap = Array.prototype.flatMap || function (depth) {
    let flattend = [];
    (function flat(array, depth) {
        for (let el of array) {
            if (Array.isArray(el) && depth > 0) {
                flat(el, depth - 1)
            } else {
                flattend.push(el)
            }
        }
    })(this, Math.floor(depth) || 1)
    return flattend
}

Array.prototype.flatMap = Array.prototype.flatMap || function () {
    return Array.prototype.map.apply(this, arguments).flat(1)
}

exports.normalizePrefix = prefix => path.join('/', prefix || '', '/').replace(/\/$/, '')