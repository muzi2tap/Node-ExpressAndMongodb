const express =require("express");

const app=express();

// 表示express抽离提交过来的JSON数据
app.use(express.json())

const mongoose=require("mongoose")
// 连接数据库,27017后面跟的是数据库名称,如果没有就相当于新建一个库
mongoose.connect('mongodb://localhost:27017/express-test',{ useUnifiedTopology: true,useNewUrlParser: true })
//定义一个产品模型(建立一个表名字为product),定义产品数据类型
const Product =mongoose.model("Product",new mongoose.Schema({
    title:String,
}))
// 插入数据
/* Product.insertMany([
    {title:"产品1"},
    {title:"产品2"},
    {title:"产品3"},
]) */

// 实现cors跨域
app.use(require("cors")())
// 访问静态资源文件
app.use("/",express.static("public"));


// 查找产品(由于数据库查询连接数据库是异步查询,所以要用async和await)
// 列表页接口
app.get("/products",async function(req,res){
    // const data=await Product.find().skip(1).limit(2)   skip()是跳过几个,limit()是限制多少条数据
    /* const data=await Product.find().where({            where()根据条件进行查询
        title:"产品2"
    }) */
    // const data=await Product.find().sort({_id:-1})        sort() _id为1是根据id大小正序排列,-1则为逆序
    const data=await Product.find()              //查询所有  
    res.send(data)
})
//详情页接口
app.get("/products/:id",async function(req,res){            
    const data=await Product.findById(req.params.id)      //req.params表示客户端传递过来URL里面所有的参数
    res.send(data)
})

// 增加产品 REST CLIENT插件用来测试接口数据的,根目录下新建一个test.http
app.post("/products",async function(req,res){
    const data=req.body;  //req.body就是客户端给我们发送过来的数据
    const product=await Product.create(data)  // 将客户端传递过来的数据新增到product表中
    res.send(product);
})

// 修改产品
app.put("/products/:id",async function(req,res){
    const product=await Product.findById(req.params.id);  //通过id找到这个产品
    product.title=req.body.title  //将客户端提交过来对象里的title赋值给这个产品里的title
    await product.save() //保存下这个产品
    res.send(product)
})

// 删除产品
app.delete("/products/:id",async function(req,res){
    const product=await Product.findById(req.params.id)
    await product.remove();
    res.send({
        success:true  //删除成功返回success:true给前端
    })
}) 

// 监听端口号
app.listen(4000,()=>{
    console.log("App is 4000")
})