import {model, models, Schema} from "mongoose";

const CategorySchema = new Schema({
    name: {type: String, required: true, unique: true}
})

export interface ICategory extends Document{
    _id: string;
    name: string;
}

const Category = models.Category || model('Category', CategorySchema)

export default Category;