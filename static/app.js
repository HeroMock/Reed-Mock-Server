setInterval(() => {
    let r = Math.floor(256 * Math.random()),
        g = Math.floor(256 * Math.random()),
        b = Math.floor(256 * Math.random())

    document.body.style.backgroundColor = `rgb(${r},${g},${b})`
}, 1000);