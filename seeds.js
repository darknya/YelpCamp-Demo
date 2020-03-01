const mongose = require("mongoose");
const Campground = require("./models/campground"),
      Comment = require("./models/comment");
      


const dataDemo = [
    {
        name: "Salmon Creek",
        image: "https://live.staticflickr.com/3230/2935192829_a5f13ea821_b.jpg",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum perferendis neque aperiam alias pariatur, reprehenderit omnis commodi corporis, minus voluptate id suscipit odit autem minima magni reiciendis distinctio assumenda sapiente."
    },
    {
        name: "Mountain Goat's Rest",
        image: "https://live.staticflickr.com/7169/6401974259_459a877dd4_b.jpg",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Harum perferendis neque aperiam alias pariatur, reprehenderit omnis commodi corporis, minus voluptate id suscipit odit autem minima magni reiciendis distinctio assumenda sapiente."
    },
    {
        name: "Granite Hill",
        image: "https://live.staticflickr.com/1086/882244782_d067df2717_b.jpg",
        description: "So many Bugs, but I like!"
    }
]

function seedDB(){
    // remove all campground
    Campground.remove({}, (err) => {
        if(err){
            console.log(err);
        }
        console.log("remove campground");
        Comment.deleteMany({}, (err) => {if(err){console.log(err);}else{console.log("remove comments");}});
        //add a few campgrounds
        dataDemo.forEach((seed) => {
            Campground.create(seed, (err, campground) => {
                if(err){
                    console.log(err);
                }else{
                    console.log("Success add seed campground");
                    // Create a Comment
                    Comment.create(
                        {
                            text: "This place is great, but Iwish there was internet",
                            author: "Tester"
                        }, (err, comment) => {
                            if(err){
                                console.log(err);
                            }else{
                                if(err){
                                    console.log(err);
                                }else{
                                    campground.comments.push(comment);
                                    campground.save();
                                    console.log("Create New comment")
                                }
                            }
                        }
                    );
                }
            });
        });
    });
    
}


module.exports = seedDB;