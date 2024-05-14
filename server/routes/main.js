const express = require('express');
const router = express.Router();
const Post = require('../models/movieModel');

//Routes

/*
    * Get/
    * Home
*/
router.get('', async (req,res) => {
try {
    const locals = {
        title: "Nodejs Blog",
        description: "Simple Blog created with NodeJS, Express & MongoDb."
    
    }
   
    let perPage = 5;
    let page =req.query.page || 1;

    const data = await Post.aggregate([{ $sort:{createsAt: -1}}])
    .skip((perPage * page) - perPage)
    .limit(perPage)
    .exec();

    const count = await Post.countDocuments();
    const nextPage = parseInt(page) + 1 ;
    const hasNextPage = nextPage <= Math.ceil(count / perPage);

    res.render('index', {
        locals,
        data,
        current: page,
        nextPage: hasNextPage ? nextPage : null,
        currentRoute: '/'
    });

    
    }catch (error) {
        console.log(error);
    }
});




/*
    * Get/
    * Post :id
*/
// router.get('/post/:id', async(req, res) =>{



//     try{

//         let slug = req.params.id;


//         const data = await Post.findById({_id: slug});

//         const locals = {
//             title: data.title,
//             description: "Simple Blog created with NodeJs, Express & MongoDb.",
//             currentRoute: '/post/$(slug'
//         }
//         res.render('post', {locals, data});
//     }catch (error){
//         console.log(error);
//     }
// })



/*
    * POST/
    * Post - searchTerm
*/


// router.post('/search', async(req, res) =>{
   

//     try{

//         const locals = {
//             title: "Search",
//             description: "Simple Blog created with NodeJs, Express & MongoDb."
//         }

//         let searchTerm = req.body.searchTerm;
//         const searchNoSpecialChar = searchTerm.replace(/[^a-zA-Z0-9]/g, "")
    
//         const data = await Post.find({
//             $or: [
//                 {"title": new RegExp(searchNoSpecialChar,'i')},
//                 {"body": new RegExp(searchNoSpecialChar,'i')},
//             ]
//         });
//         res.render("search", {
//             data,
//             locals
//         });
//     }catch (error){
//         console.log(error);
//     }
// })


router.get('/home',(req,res) => {
    res.render('home',{
        currentRoute: '/home'
    });
    
});


router.get('/movie',(req,res) => {
    res.render('movie',{
        currentRoute: '/movie'
    });
    
});


router.get('/categorie',(req,res) => {
    res.render('categorie',{
        currentRoute: '/categorie'
    });
    
});


router.get('/top10',(req,res) => {
    res.render('top10',{
        currentRoute: '/top10'
    });
    
});

router.get('/people',(req,res) => {
    res.render('people',{
        currentRoute: '/people'
    });
    
});
/* function insertPostData(){
    Post.insertMany([
    {
        title:"Laws of human nature",
        body:"The Laws of Human Nature by Robert Greene offers a compelling dive into the intricate world of human behavior, serving as a fun exploration that combines historical examples with psychological insights."
    },
    {
        title:"Psychology of money",
        body:" In the Psychology of Money, Morgan Housel teaches you how to have a better relationship with money and to make smarter financial decisions. Instead of pretending that humans are ROI-optimizing machines, he shows you how your psychology can work for and against you."
    },
    {
        title:"Psychology of selling",
        body:"TIn The Psychology of Selling, Tracy shows how salespeople can learn to control their thoughts, feelings, and actions to make themselves more effective. You'll learn The inner game of sales and selling.How to eliminate the fear of rejection.How to build unshakeable confidence.The psychology of why people buy and how to leverage it."
    },
    {
        title:"How to win friends and influence people",
        body:"Dale Carnegie (1888–1955) described himself as a “simple country boy” from Missouri but was also a pioneer of the self-improvement genre. Since the 1936 publication of his first book, How to Win Friends and Influence People, he has touched millions of readers and his classic works continue to impact lives to this day. Visit DaleCarnegie.com for more information."
    },
    {
        title:"Think and grow rich",
        body:"hink and Grow Rich is a book written by Napoleon Hill and Rosa Lee Beeland released in 1937 and promoted as a personal development and self-improvement book. He claimed to be inspired by a suggestion from business magnate and later-philanthropist Andrew Carnegie."
    },
])
}
insertPostData(); */





module.exports = router;