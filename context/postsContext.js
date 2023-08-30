import React, { useCallback, useReducer, useState } from "react";

const PostsContext = React.createContext({});
export default PostsContext;

function postsReducer(state, action) {
  //console.log(action);
  switch (action.type) {
    case "SET_POSTS":
      let newPosts = [...state];

      action.posts.forEach((post) => {
        const exists = newPosts.find((item) => item._id === post._id);
        if (!exists) {
          newPosts.push(post);
        }
      });
      return newPosts;

    case "DELETE_POSTS":
      let newPosts2 = [];
      state.forEach((item) => {
        if (item._id !== action.postId) {
          newPosts2.push(item);
        }
      });
      return newPosts2;
    default:
      return state;
  }
}

export const PostsProvider = ({ children }) => {
  const [posts, dispatch] = useReducer(postsReducer, []);
  const [noMorePosts, setNoMorePosts] = useState(false);

  const setPostsFromSSR = useCallback((postsFromSSR = []) => {
    //console.log("noMorePosts", postsFromSSR);
    if (
      postsFromSSR.length < 5 
      //|| postsFromSSR.length === totalNumPosts
    ) {
      setNoMorePosts(true);
    }
    dispatch({ type: "SET_POSTS", posts: postsFromSSR });
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

      dispatch({ type: "SET_POSTS", posts: retreivedPosts });

      if (
        retreivedPosts.length < 5 ||
        retreivedPosts.length === totalNumPosts
      ) {
        setNoMorePosts(true);
      }
    },
    []
  );

  const deletePost = useCallback((postId) => {
    dispatch({ type: "DELETE_POSTS", postId });
  }, []);

  return (
    <PostsContext.Provider
      value={{ posts, setPostsFromSSR, getPosts, noMorePosts, deletePost }}
    >
      {children}
    </PostsContext.Provider>
  );
};
