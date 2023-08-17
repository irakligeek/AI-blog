import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHashtag } from "@fortawesome/free-solid-svg-icons";

export default function SinglePost({ content, meta, title, keywords }) {
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
      </div>
    </div>
  );
}
