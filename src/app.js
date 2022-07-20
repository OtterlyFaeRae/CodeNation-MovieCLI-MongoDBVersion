const yargs = require('yargs');
const { client, connection } = require('./db/connection');
const Movie = require('./utils')

const app = async (yargsObj) =>{
    // Defines the collection we'll be working with. 
    const collection = await connection();
    // Creates new entry in collection.
    if(yargsObj.create){
        if(yargsObj.title){
            // Checks for duplicates.
            const checkForDupe = await collection.find({title: yargsObj.title}).toArray()
            // If no duplicates, creates new movie and adds to collection.
            if (checkForDupe.length === 0){
                const newMovie = new Movie(yargsObj.title, yargsObj.actor ? yargsObj.actor : undefined, yargsObj.director ? yargsObj.director : undefined)
                await newMovie.add(collection)
                console.table(`Added movie: ${newMovie.title}`)
            // If duplicates, logs error message.
            } else {
                console.table(`Duplicate item not added: ${yargsObj.title}`)
            }
        } else {
            console.log('Please enter a title: --title "Example Title" (Titles are case-sensitive.)')
        }
    // Logs table of db items based on commands.
    } else if(yargsObj.read){
        // If --search, finds specific item based on title.
        if(yargsObj.search){
            console.table(await collection.findOne({ title: yargsObj.title }))
        // If --searchBy, finds all items with the same actor or director.
        } else if(yargsObj.searchBy){
            // If an --actor is specified, finds all items with that actor.
            if(yargsObj.actor){
                console.table(await collection.find({ actor: yargsObj.actor }).toArray());
            // If a --director is specified, finds all items with that director.
            } else if(yargsObj.director){
                console.table(await collection.find({ director: yargsObj.director }).toArray());
            // If neither is specified, logs error and instruction.
            } else {
                console.log('Please specify an --actor OR --director.')
            }
        } else {
        // If search not specified, logs entire collection.
        console.table(await collection.find().toArray())
        }
    // Updates actor of collection entry based on title.
    } else if(yargsObj.update){
        // Checks if user has entered --title.
        if(yargsObj.title){
            // Checks if item specified is in list.
            const checkTrue = await collection.findOne({title: yargsObj.title})
            if (checkTrue) {
                // If in list, checks if user has entered --actor or --director.
                if(yargsObj.actor || yargsObj.director){
                    // If --actor present, updates actor.
                    console.log(`Updating ${yargsObj.title}`)
                    if(yargsObj.actor){
                        await collection.updateOne({
                            title: yargsObj.title},
                        {
                            $set: {actor: yargsObj.actor}
                        })
                        console.log(`Actor updated to:${yargsObj.actor}`)
                    };
                    // If --director present, updates director.
                    if(yargsObj.director){
                        await collection.updateOne({
                            title: yargsObj.title},
                        {
                            $set: {director: yargsObj.director}
                        })
                        console.log(`Director updated to:${yargsObj.director}`)
                    };
                // If no actor or director, logs error and instruction.
                } else {
                    console.log('Please specify an actor and/or director: --actor "example actor" / --director "example director"')
                }
            // If item not in collection, logs error and instruction.
            } else {
                console.log(`This title has not been added to our database.\nTo add it, use --create --title "${yargsObj.title}"`)
            }
        // If no title specified, logs error and instruction.
        } else {
            console.log(`Please specify a title: --title "example title"`)
        }
    // Deletes selected entry by --title.
    } else if(yargsObj.delete){
        // Checks if title specified.
        if(yargsObj.title){
            // Checks if item is in collection.
            const checkTrue = await collection.findOne({title: yargsObj.title})
            // If title in entry, deletes item.
            if(checkTrue){
                console.log(`Successfully deleted ${yargsObj.title}.`)
                await collection.deleteOne({title: yargsObj.title})
            // If title not in entry, logs error message.
            } else {
                console.log(`Item Not Found: ${yargsObj.title}`)
            }
        // If title not specified, logs error and instructions.
        } else {
            console.log('Please specify a title: --title "example title"')
        }
    }
    await client.close();
}
app(yargs.argv)