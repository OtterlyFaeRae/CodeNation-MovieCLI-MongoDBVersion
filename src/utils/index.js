class Movie {
    constructor(title, actor = 'Actor not specified.', director = 'Director not specified.'){
        this.title = title,
        this.actor = actor
        this.director = director
    }
    async add(collection){
        // Awaits connection to collection then adds self to it.
        try {
            await collection.insertOne(this)
        } catch (error) {
            console.log(`Collection add failure at ${this.title}: ${error}`)
        }
    }
}

module.exports = Movie;