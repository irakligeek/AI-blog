import clientPromise from "../../lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);

    const client = await clientPromise;
    const db = client.db("AIBlogGenerator");

    const userProfile = await db.collection("users").findOne({
      auth0Id: user.sub,
    });

    const { lastCreatedDate, getNewerPosts } = req.body; //passed parameter to the API

    //console.log(userProfile._id);
    const posts = await db
      .collection("posts")
      .find({
        userId: userProfile._id,
        created: { [getNewerPosts ? "$gt" : "$lt"]: new Date(lastCreatedDate) },
      })
      .limit(getNewerPosts ? 0 : 5)
      .sort({ created: -1 })
      .toArray();

    const totalNumPosts = await db.collection("posts").countDocuments({
      userId: userProfile._id,
    });

    res.status(200).json({ posts: posts, totalNumPosts: totalNumPosts });
    return;
  } catch (error) {
    console.log("Error occured retrieving psots: ", error);
    res.status(400).end();
    return;
  }
});
