import Link from "next/link";
export default function PostsList({ posts, getPosts, postId, noMorePosts }) {
  return (
    <div className="flex-1 overflow-auto bg-gradient-to-b from-slate-800 to-cyan-800">
      {posts.map((item, index) => (
        <li key={item._id} className=" list-none my-2 mx-2">
          <Link
            href={`/post/${item._id}`}
            className={`
                block 
                border-2 
                border-white/0
                text-ellipsis 
                overflow-hidden 
                whitespace-nowrap
                bg-white/10 
                cursor-pointer 
                rounded-full
                py-2 px-4
                ${postId === item._id ? " bg-white/20 border-white/40" : ""} `}
          >
            {item.postTitle}
          </Link>
        </li>
      ))}

      {!noMorePosts && (
        <div
          onClick={() => {
            getPosts({ lastCreatedDate: posts[posts.length - 1].created });
          }}
          className="hover:underline text-slate-400 text-center cursor-pointer mt-4"
        >
          Load more posts
        </div>
      )}
    </div>
  );
}
