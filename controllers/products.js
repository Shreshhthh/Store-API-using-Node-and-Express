const Products = require('../models/product')

const getAllProductsStatic = async (req,res)=>{
    // throw new Error('Testing error')
    //const search = ''
    const products = await Products.find({}).select('name price')
    res.status(200).json({items : products, nBHits:products.length})
}

const getAllProducts = async (req,res) =>{

    const {featured,company,name,sort,fields} = req.query
    const queryObject = {}

    if(featured){
        queryObject.featured = featured==='true'?true:false
    }

    if(company){
        queryObject.company = company
    }

    if(name){
        queryObject.name = {$regex:name, $options:'i'}
    }

    let result = Products.find(queryObject)
    if (sort){
        const sortList = sort.split(',').join(' ')
        result = result.sort(sortList)
    }
    else{
        result = result.sort('createdAt')
    }

    if(fields){
        const fieldsList = fields.split(',').join(' ')
        result = result.select(fieldsList)
    }

    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page-1) * limit
    result = result.page().limit().skip()

    const products = await result
    res.status(200).json({items:products, nBHits:products.length})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}