const knex = require('../database/knex');

class NotesController {
    async create(req, res) {
        const { title, description, rating, user_id, tags } = req.body;

        const [note_id] = await knex('movie_notes').insert({ title, description, rating, user_id });

        if(tags || Array.isArray(tags)) {
            const tagsInsert = await Promise.all(tags.map(name => ({ name, user_id, note_id })))
            await knex('movie_tags').insert(tagsInsert);
        }
        
        res.json();
    };

    async show(req, res) { 
        const { id } = req.params;

        const notes = await knex('movie_notes').where({ id });
        const tags = await knex('movie_tags').where({ note_id: id }).orderBy('name');
        
        return res.json({...notes, tags});
    };

    async delete(req, res) {
        const { id } = req.params;

        await knex('movie_notes').where({ id }).del();

        return res.json();
    };

    async index(req, res) {
        const { title, user_id, tags } = req.query;

        let notes;
        if(tags) {
            const filteredTags = tags.split(',').map(tag => tag.trim());
            try{
                notes = await knex
                    .select(['movie_notes.id', 'movie_notes.user_id'])
                    .from('movie_tags')
                    .whereIn('name', filteredTags)
                    .innerJoin('movie_notes', 'movie_tags.note_id', 'movie_notes.id')
                    .where('movie_notes.user_id', user_id)
                    .whereLike('movie_notes.title', `%${title || ""}%`)
                    .orderBy('movie_notes.title');
            } catch(err) {
                console.log(err)
            };
            
        }else {
            notes = await knex('movie_notes').where({ user_id }).whereLike('title', `%${title || ""}%`).orderBy('title');
        }

        const userTags = await knex('movie_tags').where({ user_id });
        const withTags = notes.map(note => {
            const newtags = userTags.filter(tag => tag.note_id === note.id);
            return {...note, tags: newtags}
        });

        return res.json(withTags);
    };
}

module.exports = NotesController;