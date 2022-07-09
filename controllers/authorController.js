const Author = require("../mongo/model/author");
const Post = require("../mongo/model/post");
const mongoose = require("mongoose");

exports.saveAuthor = async (req, res) => {
  const author = new Author({
    name: req.body.name,
    email: req.body.email,
    joined: new Date(),
  });
  await author.save(author);
  res.send(author);
};

exports.getAuthor = async (req, res) => {
  try {
    const author = await Author.aggregate([
      { $match: { _id: mongoose.Types.ObjectId(req.params.id) } },
      {
        $lookup: {
          from: Post.collection.name,
          localField: "_id",
          foreignField: "authorId",
          as: "post_docs",
        },
      },
    ]);
    res.send(author);
  } catch (error) {
    res.status(404);
    res.send({ success: false, message: "Post does not exists" });
  }
};
exports.getAllAuthors = async (req, res) => {
  const aggrFilter = [];
  let isNextPageAvailable = false;
  const count = await Author.count();
  if (req.query.limit || req.query.skip) {
    const limit = req.query.limit || 10;
    aggrFilter.push({
      $limit: +limit,
    });
    const skip = req.query.skip || 0;
    aggrFilter.push({ $skip: +skip });
    isNextPageAvailable = skip + limit < count;
  }
  const author = await Author.aggregate([
    ...aggrFilter,
    {
      $lookup: {
        from: Post.collection.name,
        localField: "_id",
        foreignField: "authorId",
        as: "post_docs",
      },
    },
  ]);
  res.send({ count, isNextPageAvailable, author });
};
