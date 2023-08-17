import React, { useCallback, useState } from "react";
import { Context } from "react";

const PostsContext = React.createContext({});
export default PostsContext;

export const PostsProvider = ({ children }) => {
  const [posts, setPosts] = React.useState([]);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    setPosts((val) => {
      const newPosts = [...val];
      postsFromSSR.forEach((post) => {
        const exists = newPosts.find((item) => item._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;
    });
  }, []);

  const getPosts = useCallback(
    async ({ lastCreatedDate, getNewerPosts = false }) => {
      const response = await fetch("/api/getPosts", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({ lastCreatedDate, getNewerPosts }),
      });

      const json = await response.json();
      const retreivedPosts = json.posts || [];
      const totalNumPosts = json.totalNumPosts;

      if (
        retreivedPosts.length < 5 ||
        retreivedPosts.length === totalNumPosts
      ) {
        setNoMorePosts(true);
      }

      setPosts((val) => {
        const newPosts = [...val];
        retreivedPosts.forEach((post) => {
          const exists = newPosts.find((item) => item._id === post._id);
          if (!exists) {
            newPosts.push(post);
          }
        });
        return newPosts;
      });
    },
    []
  );

  const deletePost = useCallback((postId) => {
    setPosts((oldPosts) => {
      let newPosts = [];
      oldPosts.forEach((item) => {
        if(item._id !== postId){
          newPosts.push(item);
        }
      });
      return newPosts;
    });
  }, []);

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  );
};
