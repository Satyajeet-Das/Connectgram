import { Document, Types } from "mongoose"

interface IUser extends Document {
    _id: Types.ObjectId,
    name: string,
    email: string,
    username: string,
    password: string,
    resetPasswordCode?: number,
    resetPasswordExpiry?: Date,
    comparePassword: (password: string) => Promise<boolean>;
}

interface IPost extends Document {
    _id: Types.ObjectId,
    photo?: Buffer[],
    content: string,
    author: Types.ObjectId,
    date: Date,
    comments: Types.ObjectId[],
    likes: Types.ObjectId[]
}

interface IComment extends Document {
    _id: Types.ObjectId,
    post: Types.ObjectId
    content: string,
    date: Date,
    author: Types.ObjectId,
}