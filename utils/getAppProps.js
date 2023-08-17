import { getSession } from "@auth0/nextjs-auth0";
import clientPromise from "../lib/mongodb";
import { ObjectId } from "mongodb";

export const getAppProps = async (ctx) => {
  const { req, res } = ctx;
  const userSession = await getSession(req, res);
  const client = await clientPromise;
  const db = client.db("AIBlogGenerator");
  const user = await db.collection("users").findOne({
    auth0Id: userSession.user.sub,
  });

  //.. make sure user has enough tokens
  if (!user) {
    return {
      availableTokens: 0,
      posts: [],
    };
  }

  const posts = await db
    .collection("posts")
    .find({
      userId: user._id,
    })
    .limit(5) //Retrieve 5 posts initially
    .sort({
      created: -1,
    })
    .toArray();

//   console.log("params", ctx.params);

  return {
    availableTokens: user.availableTokens,
    posts: posts.map(({ created, _id, userId, ...rest }) => ({
      _id: _id.toString(),
      created: created.toString(),
      ...rest,
    })),
    postId: ctx.params?.postid || null
  };
};
