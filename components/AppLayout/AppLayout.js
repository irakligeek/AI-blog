import UserInfo from "../Users/UserInfo";
import PostsContext from "../../context/postsContext";
import { useContext, useEffect } from "react";
import SidebarHeader from "./SidebarHeader";
import PostsList from "./PostsList";

export const AppLayout = ({
  children,
  posts: postsFromSSR,
  availableTokens,
  postId,
  postCreated,
}) => {
  const { posts, setPostsFromSSR, getPosts, noMorePosts } =
    useContext(PostsContext);
  useEffect(() => {
    //console.log(postCreated);
    setPostsFromSSR(postsFromSSR);
    if (postId) {
      const exists = postsFromSSR.find((post) => post._id === postId);
      if (!exists) {
        getPosts({ getNewerPosts: true, lastCreatedDate: postCreated });
      }
    }
  }, [postsFromSSR, setPostsFromSSR, postId, postCreated, getPosts]);

  return (
    <div className="grid grid-cols-[300px_1fr] h-screen max-h-screen">
      <div className="flex flex-col text-white overflow-hidden">
        <SidebarHeader availableTokens={availableTokens} />
        <PostsList
          posts={posts}
          getPosts={getPosts}
          postId={postId}
          noMorePosts={noMorePosts}
        />
        <UserInfo />
      </div>
      {children}
    </div>
  );
};
