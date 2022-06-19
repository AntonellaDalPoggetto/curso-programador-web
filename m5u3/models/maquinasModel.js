const async = require('hbs/lib/async');
var pool = require('./bd');

async function getMaquinas() {
    var query = 'select * from maquinas';
    var rows = await pool.query(query);
    return rows;
}

async function deleteMaquinasById(id) {
    var query = 'delete from maquinas where id = ?';
    var rows = await pool.query(query, [id]);
    return rows;
}

async function insertMaquina(obj) {
    try {
        var query = "insert into maquinas set ?";
        var rows = await pool.query(query, [obj])
        return rows;

    } catch (error) {
        console.log(error);
        throw error;
    }
}


async function getMaquinasById(id) {
    var query = "select * from maquinas where id=?";
    var rows = await pool.query(query, [id]);
    return rows [0];
}

async function modificarMaquinaById(obj, id) {
    try {
        var query = "update maquinas set ? where id=?";
        var rows = await pool.query(query, [obj, id]);
        return rows;
    } catch (error) {
        throw error;
    }
}

module.exports = { getMaquinas, deleteMaquinasById, insertMaquina, getMaquinasById, modificarMaquinaById };