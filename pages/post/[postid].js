import { getSession, withPageAuthRequired } from "@auth0/nextjs-auth0";
import { AppLayout } from "../../components/AppLayout/AppLayout";
import clientPromise from "../../lib/mongodb";
import { ObjectId } from "mongodb";
import SinglePost from "../../components/Post/SinglePost";
import { getAppProps } from "../../utils/getAppProps";
import { useContext, useState } from "react";
import { useRouter } from "next/router";
import PostsContext from "../../context/postsContext";

export default function Post(props) {
  const { content, meta, title, keywords, postId } = props;
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const router = useRouter();

  const {deletePost} = useContext(PostsContext);

  const handlePostDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("/api/deletePost", {
        method: "POST",
        headers: {
          "content-type": "application/json",
        },
        body: JSON.stringify({postId: postId}),
      });

      const json = await response.json();
      if(json.success){
        console.log("Post deleted:", json);
        deletePost(postId);
        router.replace("/post/new");
      }

    } catch (error) {
      console.log("error occured", error);
    }
  };

  return (
    <SinglePost
      content={content}
      meta={meta}
      title={title}
      keywords={keywords}
      setShowDeleteConfirm={setShowDeleteConfirm}
      showDeleteConfirm={showDeleteConfirm}
      handlePostDelete={handlePostDelete}
    />
  );
}

Post.getLayout = function getLayout(page, pageProps) {
  return <AppLayout {...pageProps}>{page}</AppLayout>;
};

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps(ctx) {
    const props = await getAppProps(ctx);
    const { res, req, params,  } = ctx;
    const userSession = await getSession(req, res);

    const client = await clientPromise;
    const db = client.db("AIBlogGenerator");

    const user = await db.collection("users").findOne({
      auth0Id: userSession.user.sub,
    });

    const post = await db.collection("posts").findOne({
      _id: new ObjectId(params.postid),
      userId: user._id,
    });

    if (!post) {
      return {
        redirect: {
          destination: "/post/new",
          permanent: false,
        },
      };
    }
    //console.log(post.created);

    return {
      props: {
        title: post.postTitle,
        content: post.postContent,
        meta: post.postMeta,
        keywords: post.keywords,
        postCreated: post.created.toString(),
        postId: params.postid.toString(),
        ...props,
      },
    };
  },
});
