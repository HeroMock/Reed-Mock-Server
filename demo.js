const path = require('path')

console.log(path.join('/', '', '/'))
console.log(path.resolve('/a/', '/a/'))

function samePath(left, right) {
    return path.resolve(left) === path.resolve(right)
}
