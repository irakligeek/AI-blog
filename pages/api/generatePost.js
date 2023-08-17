import { Configuration, OpenAIApi } from "openai";
import clientPromise from "../../lib/mongodb";
import { getSession } from "@auth0/nextjs-auth0";
import { withApiAuthRequired } from "@auth0/nextjs-auth0";

export default withApiAuthRequired(async function handler(req, res) {
  //.. Check if user has any tokens before generating a post

  const { user } = await getSession(req, res);

  const client = await clientPromise;
  const db = client.db("AIBlogGenerator");

  const userProfile = await db.collection("users").findOne({
    auth0Id: user.sub,
  });

  if (!userProfile?.availableTokens) {
    //user doesn't have tokens, return un-authorized error
    res.status(403);
    return;
  }

  await db.collection("users").updateOne(
    {
      auth0Id: user.sub,
    },
    {
      $inc: {
        availableTokens: -1, //minus one to token since
      },
    }
  );

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const { topic, keywords } = req.body;

  //validate user input
  if (!topic || !keywords) {
    res.status(422).end();
    return;
  }

  if (topic.trim().length > 80 || keywords.trim().length > 80) {
    res.status(422).end();
    return;
  }

  const response = await openai.createChatCompletion({
    model: "gpt-3.5-turbo",
    messages: [
      {
        role: "user",
        content: `Write an SEO-friendly blog post about ${topic}, 
          target following keywords: ${keywords}.
          The content shuold be formatted in SEO-friendly HTML.
          The response must also include appropriate html title and meta description.
          The return format must be stringified JSON in the following format: 
          {
            "postContent": post content here,
            "postTitle" : title goes here,
            "metaDescription": Meta description goes here,
          }`,
      },
    ],
    temperature: 0,
    max_tokens: 3600,
    // top_p: 1,
    // frequency_penalty: 0,
    // presence_penalty: 0,
  });

  //Save post to Mongo DB
  const post = JSON.parse(response.data.choices[0]?.message?.content);

  const insertPost = await db.collection("posts").insertOne({
    postContent: post?.postContent,
    postTitle: post?.postTitle,
    postMeta: post?.metaDescription,
    userId: userProfile._id,
    created: new Date(),
    topic,
    keywords,
  });

  res.status(200).json({ postId: insertPost.insertedId });
});
