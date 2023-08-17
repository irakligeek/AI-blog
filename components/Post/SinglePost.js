import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";

export default function SinglePost({
  content,
  meta,
  title,
  keywords,
  setShowDeleteConfirm,
  showDeleteConfirm,
  handlePostDelete,
}) {
  
  return (
    <div className=" overflow-auto h-full">
      <div className=" max-w-screen-sm mx-auto mb-16">
        <div className=" text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          SEO title and meta description
        </div>
        <div className="p-4 my-2 border border-stone-200 rounded-sm">
          <div className="text-blue-600 text-2xl font-bold">{title}</div>
          <div className="mt-2 ">{meta}</div>
        </div>
        <div className=" text-sm font-bold mt-6 p-2 bg-stone-200 rounded-sm">
          Keywords
        </div>
        <div className="flex flex-wrap gap-1 pt-2">
          {keywords.split(",").map((item, i) => (
            <div key={i} className=" text-white rounded-full bg-slate-800 p-2">
              <FontAwesomeIcon icon={faHashtag} /> {item}
            </div>
          ))}
        </div>
        <div dangerouslySetInnerHTML={{ __html: content || "" }}></div>
        <div className="my-4">
          {!showDeleteConfirm && (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="btn bg-red-500 hover:bg-red-700"
            >
              Delete post
            </button>
          )}

          {showDeleteConfirm && (
            <div>
              <div className="grid grid-cols-2 gap-x-4">
                <button
                  className="btn bg-stone-400 hover:bg-stone-700"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn bg-red-500 hover:bg-red-700"
                  onClick={handlePostDelete}
                >
                  Delete
                </button>
              </div>
              <p className="mb-2 py-1 text-center bg-red-200 w-full block">
                Are you sure? This action is irreversable
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
