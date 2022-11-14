

export class Server {
    static version = '1'
    constructor() {}
    add(a: number, b: number) {
        console.log(`version ${Server.version}`)
        return a + b
    }
}