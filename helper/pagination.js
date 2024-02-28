module.exports = (objectPagination,query,countItems)=>{
    if(query.page){
        objectPagination.currentPage = parseInt(query.page)
    }
    if(query.limit){
        objectPagination.limitItem = parseInt(query.limit)
    }
           
    objectPagination.skip = (objectPagination.currentPage -1) * objectPagination.limitItem

    objectPagination.totalPage = Math.ceil(countItems/objectPagination.limitItem);

    return objectPagination
}