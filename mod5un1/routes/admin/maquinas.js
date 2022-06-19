var express = require('express');
var router = express.Router();
var maquinasModel = require('./../../models/maquinasModel');

router.get('/', async function (req, res, next) {

    var maquinas = await maquinasModel.getMaquinas();

    res.render('admin/maquinas', {
        layout: 'admin/layout',
        usuario: req.session.nombre,
        maquinas
    });

});

router.get('/eliminar/:id', async (req, res, next) => {
    var id = req.params.id;
    await maquinasModel.deleteMaquinasById(id);
    res.redirect('/admin/maquinas')
});



module.exports = router;