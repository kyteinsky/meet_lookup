
module.exports = {
    log(data) {
        if (process?.env?.ENVDEV == '1')
            console.log(data)
    },
    browserConsole() {
        console.log('Hey fellow developer!')
    }
}
