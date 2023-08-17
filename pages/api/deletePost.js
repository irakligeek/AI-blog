import clientPromise from "../../lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";
import { ObjectId } from "mongodb";

export default withApiAuthRequired(async function handler(req, res) {
  try {
    const { user } = await getSession(req, res);
    const client = await clientPromise;
    const db = client.db("AIBlogGenerator");

    const userProfile = await db.collection("users").findOne({
      auth0Id: user.sub,
    });

    const { postId } = req.body;

    const deletedPost = await db.collection("posts").deleteOne({
      userId: userProfile._id,
      _id: new ObjectId(postId),
    });

    if (deletedPost.deletedCount < 1) {
      console.log("No post was deleted: ");
      res.status(500).end();
      return;
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("Error occured deleting user: ", error);
    res.status(500).end();
  }
});
