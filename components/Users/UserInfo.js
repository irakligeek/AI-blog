import Link from "next/link";
import Image from "next/image";
import { useUser } from "@auth0/nextjs-auth0/client";

export default function UserInfo() {
  const user = useUser();
  const userInfo = user.user;
  const userHTML = !!userInfo ? (
    <div className="flex items-center gap-2 pt-4">
      <div className="min-w-[50px]">
        <Image
          src={userInfo.picture}
          alt={userInfo.name}
          height={50}
          width={50}
          className="rounded-full"
        ></Image>
      </div>

      <div className="flex-1">
        <div className="font-bold">{userInfo.email}</div>
        <Link className="text-sm" href="/api/auth/logout">
          Logout
        </Link>
      </div>
    </div>
  ) : (
    <Link href="/api/auth/login">Login</Link>
  );

  return (
    <div className="bg-cyan-800 border-t border-t-black/50 h-20 px-2">
      {userHTML}
    </div>
  );
}
