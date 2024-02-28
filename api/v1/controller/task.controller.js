const Task = require("../model/task.model");
const paginationHelper = require("../../../helper/pagination");
const searchHelper = require("../../../helper/search");

module.exports.index = async(req, res)=>{
    const user = req.user
    const sort = {};
    const find = {
        deleted: false,
        $or: [
            {createdBy: user.id},
            {listUser: user.id}

        ]
    };

    let objectSearch = searchHelper(req.query);

    if(req.query.keyword){
        find.title = objectSearch.regex
    }

    if(req.query.status){
        find.status = req.query.status
    }

    if(req.query.sortKey && req.query.sortValue){
        sort[req.query.sortKey] = req.query.sortValue  
    }
    let initialPagination = {
        currentPage : 1,
        limitItem : 2
    }
    //Pagination
    const countItems = await Task.countDocuments(find);
    const objectPagination =  paginationHelper(initialPagination,req.query,countItems);

    const tasks = await Task.find(find).sort(sort).limit(objectPagination.limitItem).skip(objectPagination.skip)

    res.json(tasks);
}

module.exports.detail = async(req, res)=>{
    try {
        const id = req.params.id
        const tasks = await Task.findOne({
            _id: id,
            deleted: false
    })

    res.json(tasks);
    } catch (error) {
        res.json(`Không tìm thấy`)
    }
}

module.exports.changeStaus = async(req, res)=>{
    try {
        const id = req.params.id
        

        if(req.body){
            const status =req.body.status
            await Task.updateOne({
                _id: id
            },{
                status: status
            })
        }
        res.json({
            code: "200",
            message: "Cập nhật trạng thái thành công!"
        });
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}

module.exports.changeMulti = async(req, res)=>{
    try {
        const {ids, key, value}= req.body
        
        console.log(ids, key, value);
        switch (key) {
            case "status":
                await Task.updateMany({
                    _id: ids
                },{
                    status : value
                })
                res.json({
                    code: "200",
                    message: "Cập nhật trạng thái thành công!"
                });
                break;
            case "delete":
                await Task.updateMany({
                    _id: ids
                },{
                    deleted: true,
                    deleteAt: new Date()
                })
                res.json({
                    code: "200",
                    message: "Xóa thành công!"
                });
                break;
        
            default:
                res.json({
                    code: 400,
                    message: "Không tồn tại"
                })
                break;
        }
        
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}

module.exports.create = async(req, res)=>{
    try {
        const data = new Task(req.body);
        await data.save()

        res.json({
            code: "200",
            message: "Tạo thành công thành công!",
            data: data
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}

module.exports.edit = async(req, res)=>{
    try {
        const id = req.params.id
        await Task.updateOne({
            _id: id
        },req.body)

        res.json({
            code: "200",
            message: "Tạo thành công thành công!",
            
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}

module.exports.delete = async(req, res)=>{
    try {
        const id = req.params.id
        await Task.updateOne({
            _id: id
        },{
            deleted: true,
            deleteAt: Date.now()
        })

        res.json({
            code: "200",
            message: "Xoá thành công!",
            
        });
        
    } catch (error) {
        res.json({
            code: 400,
            message: "Không tồn tại"
        })
    }
}
