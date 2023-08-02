const { hash, compare } = require('bcryptjs');
const AppError = require('../utils/AppError');
const dbConnect = require('../database/sqlite');

class UsersController {
    async create(req, res) {
        const { name, email, password } = req.body;
        const db = await dbConnect();
        const checkUserExists = await db.get('SELECT * FROM users WHERE email = ?', [email]);

        if (checkUserExists) {
            throw new AppError('Este usuário já existe!');
        }

        const encriptedPassword = await hash(password, 8);

        await db.run('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [name, email, encriptedPassword]);

        return res.status(201).json({ message: 'Usuário criado com sucesso!' })
    }

    async update (req, res) {
        let { name, email, password, old_password } = req.body;
        const { id } = req.params;
        const db = await dbConnect();

        const checkUserExists = await db.get('SELECT * FROM users WHERE id = ?', [id]);
        if (!checkUserExists) {
            throw new AppError('Este usuário não existe!');
        }

        const checkEmailExists = await db.get('SELECT * FROM users WHERE email = ?', [email]);
        if(checkEmailExists && checkEmailExists.id !== checkUserExists.id) {
            throw new AppError('Este e-mail já está sendo utilizado!');
        }

        checkUserExists.name = name || checkUserExists.name;
        checkUserExists.email = email || checkUserExists.email;

        if(password && old_password) {
            const checkOldPassword = await compare(old_password, checkUserExists.password);

            if (!checkOldPassword) {
                throw new AppError('A senha antiga não confere!');
            }

            const encriptedPassword = await hash(password, 8);

            await db.run('UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?', [checkUserExists.name, checkUserExists.email, encriptedPassword, id]);
        }

        await db.run('UPDATE users SET name = ?, email = ? WHERE id = ?', [checkUserExists.name, checkUserExists.email, id]);

        return res.status(200).json({ message: 'Usuário atualizado com sucesso!' })
    }
}

module.exports = UsersController;