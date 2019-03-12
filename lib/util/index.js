
Object.prototype.isEmpty = function () {
    return Object.getOwnPropertyNames(this).length == 0
}

Object.prototype.isArray = function () {
    return Array.isArray(this)
}

