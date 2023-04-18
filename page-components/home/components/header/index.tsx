import { Inter } from "next/font/google";

const inter = Inter({
  weight: "600",
  subsets: ["latin"],
});

const interSemiBold = Inter({
  weight: "400",
  subsets: ["latin"],
});

const interLight = Inter({
  weight: "200",
  subsets: ["latin"],
});

const Header = () => {
  return (
    <div className="w-full h-full px-10 py-4 flex flex-col items-start justify-center">
      <h1 className={`${inter.className} text-2xl`}>Blurred Image DataURL</h1>
      <h4 className={`${interLight.className} text-lg`}>
        Optimised to use as{" "}
        <span className={`${interSemiBold.className}`}>
          {" "}
          NextJS Image's <span className="italic">blurDataURL</span>
        </span>
      </h4>
    </div>
  );
};

export default Header;
