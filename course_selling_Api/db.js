import mongoose from 'mongoose';

const Schema = mongoose.Schema;
const ObjectId = mongoose.Types.ObjectId;



const UserSchema = new Schema({
    email : {
        type:String, unique:true
    },
    password:String,
    firstName:String,
    lastName:String,
});


const AdminSchema = new Schema({
    email : {
        type:String, unique:true
    },
    password:String,
    firstName:String,
    lastName:String,
});


const CourseSchema = new Schema({
    title: String,
    description: String,
    price: Number,
    imageUrl: String,
    creatorId: ObjectId

});

const PurchaseSchema = new Schema({
    userId:ObjectId,
    courseId : ObjectId,
})

export const UserModel = mongoose.model("user", UserSchema);
export const AdminModel = mongoose.model("admin", AdminSchema);
export const CourseModel = mongoose.model("course", CourseSchema);
export const PurchaseModel = mongoose.model("purchase", PurchaseSchema);

// module.exports = {
//     UserModel,
//     AdminModel,
//     CourseModel,
//     PurchaseModel,
// }
