const Post = require("../mongo/model/post");
const Author = require("../mongo/model/author");
const mongoose = require("mongoose");
exports.getPosts = async (req, resp) => {
  let sort = {};
  let filter = {};
  const aggrFilter = [];
  let isNextPageAvailable = false;
  const count = await Post.count();

  if (req.query.sort) {
    const sorter = req.query.sort.split("&").map((value) => value.split("."));
    sort = sorter.reduce(
      (prev, curr) => ({ ...prev, [curr[0]]: curr[1] != "asc" ? -1 : 1 }),
      {}
    );
    aggrFilter.push({ $sort: sort });
  }

  if (req.query.limit || req.query.skip) {
    const limit = req.query.limit || 10;
    aggrFilter.push({
      $limit: +limit,
    });
    const skip = req.query.skip || 0;
    aggrFilter.push({ $skip: +skip });
    isNextPageAvailable = skip + limit < count;
  }

  if (req.query.isPublished) {
    switch (req.query.isPublished) {
      case "-1": {
        filter = { isPublished: false };
        aggrFilter.push({
          $match: filter,
        });
        break;
      }
      case "1": {
        filter = { isPublished: true };
        aggrFilter.push({
          $match: filter,
        });
        break;
      }
      default: {
        break;
      }
    }
  }
  //use this when only need post object and authorId not with author object
  // const posts = await Post.find(filter).limit(limit).skip(skip).sort(sort);
  const post = await Post.aggregate([
    ...aggrFilter,
    {
      $lookup: {
        from: Author.collection.name,
        localField: "authorId",
        foreignField: "_id",
        as: "author",
      },
    },
  ]);
  resp.send({ count, isNextPageAvailable, post });
};

exports.savePost = async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    created: new Date(),
    modified: new Date(),
    isPublished: req.body.isPublished,
    authorId: req.body.authorId,
  });
  await post.save();
  res.send(post);
};

exports.getPost = async (req, res) => {
  //let post = await Post.findOne({ _id: req.params.id }).catch((error) => null);

  try {
    const post = await Post.aggregate([
      {
        $match: { _id: mongoose.Types.ObjectId(req.params.id) },
      },
      {
        $lookup: {
          from: Author.collection.name,
          localField: "authorId",
          foreignField: "_id",
          as: "author",
        },
      },
    ]);
    res.send(post);
  } catch (error) {
    res.status(404);
    res.send({ success: false, message: "Post does not exists" });
  }
};
exports.updatePost = async (req, res) => {
  const post = await Post.findOne({ _id: req.params.id }).catch(
    (error) => null
  );
  if (post == null) {
    res.status(404);
    res.send({ success: false, message: "Post does not exists" });
  } else {
    if (req.body.title) {
      post.title = req.body.title;
    }
    if (req.body.content) {
      post.content = req.body.content;
    }
    post.modified = new Date();
    res.send(await post.save());
  }
};
exports.deletePost = async (req, res) => {
  const err = await Post.deleteOne({ _id: req.params.id }).catch(
    (error) => null
  );
  if (err == null) {
    res.status(404);
    res.send({ success: false, message: "Post does not exists" });
  } else {
    res.status(204).send();
  }
};
