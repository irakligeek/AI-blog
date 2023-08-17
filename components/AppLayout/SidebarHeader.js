import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCoins } from "@fortawesome/free-solid-svg-icons";
import Logo from "../Logo/Logo";
import Link from "next/link";

export default function SidebarHeader({availableTokens}) {
  return (
    <div className="bg-slate-800 px-2">
      <Logo />
      <Link className="btn" href={"/post/new"}>
        New Post
      </Link>
      <Link className="block text-center mt-2" href={"/token-topup"}>
        <FontAwesomeIcon icon={faCoins} className="text-yellow-500" />
        <span className="pl-1">{availableTokens} tokens available</span>
      </Link>
    </div>
  );
}
