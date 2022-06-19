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

module.exports = { getMaquinas, deleteMaquinasById }