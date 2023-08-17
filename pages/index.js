import Image from "next/image";
import HeroImage from "../public/hero.webp";
import Logo from "../components/Logo/Logo";
import Link from "next/link";
export default function Home() {
  
  return (
    <div className="w-screen h-screen overflow-hidden flex justify-center items-center relative">
      <Image
        src={HeroImage}
        alt="AI Blog Hero image"
        fill
        className=" absolute"
      />
      <div
        className="relative z-10
       text-white 
       px-10 py-5 
       text-center 
       max-w-screen-sm
       bg-slate-900/90 
       rounded-md 
       backdrop-blur-sm"
      >
        <Logo />
        <p className=" pb-2">
          Ths AI-powered SAAS solution to generate SEO-friendly blog posts with a
          click of a button
        </p>
        <Link href="/post/new" className="btn">Generate a post</Link>
      </div>
    </div>
  );
}
