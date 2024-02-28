const express = require('express');
const router = express.Router();
const controller = require("../controller/task.controller");

router.get('/', controller.index);

router.get('/detail/:id', controller.detail);

router.patch('/change-status/:id', controller.changeStaus);

router.patch('/change-multi/', controller.changeMulti);

router.patch('/create/', controller.create);

router.patch('/edit/:id', controller.edit);

router.delete('/delete/:id', controller.delete);



module.exports = router