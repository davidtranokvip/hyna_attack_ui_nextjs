import Link from "next/link";

export default function NotFound() {
    return (
      <div className="min-h-screen bg-[#000000] bg-no-repeat bg-cover font-['Inconsolata',Helvetica,sans-serif] text-2xl text-[rgba(128,255,128,0.8)] relative"
        style={{
          backgroundImage: `radial-gradient(#11581E, #041607), url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif")`,
          textShadow: '0 0 1ex rgba(51, 255, 51, 1), 0 0 2px rgba(255, 255, 255, 0.8)'
        }}>
        <div className="pointer-events-none absolute w-full h-full bg-no-repeat bg-cover opacity-[0.02] -z-10"
              style={{
                backgroundImage: `url("https://media.giphy.com/media/oEI9uBYSzLpBK/giphy.gif")`
              }}></div>
        <div className="pointer-events-none absolute w-full h-full bg-[repeating-linear-gradient(180deg,rgba(0,0,0,0)_0,rgba(0,0,0,0.3)_50%,rgba(0,0,0,0)_100%)] bg-[length:auto_4px] z-10 before:content-[''] before:pointer-events-none before:absolute before:block before:inset-0 before:w-full before:h-full before:bg-[linear-gradient(0deg,transparent_0%,rgba(32,128,32,0.2)_2%,rgba(32,128,32,0.8)_3%,rgba(32,128,32,0.2)_3%,transparent_100%)] before:bg-no-repeat before:animate-scan"></div>
        <div className="absolute h-full w-full p-16 uppercase">
            <h1 className="text-[rgba(128,255,128,0.8)] text-6xl mb-4 [text-shadow:0_0_1ex_rgba(51,255,51,1),0_0_2px_rgba(255,255,255,0.8)]">
                Error <span className="text-white">404</span>
            </h1>
            <p className="text-[rgba(128,255,128,0.8)] mb-8 [text-shadow:0_0_1px_rgba(51,255,51,0.4),0_0_2px_rgba(255,255,255,0.8)] before:content-['>_']">
                The page you are looking for might have been removed, had its name changed or is temporarily unavailable.
            </p>
            <p className="text-[rgba(128,255,128,0.8)] mb-8 [text-shadow:0_0_1px_rgba(51,255,51,0.4),0_0_2px_rgba(255,255,255,0.8)] before:content-['>_']">
                Please try to <Link href="/" className="text-white no-underline before:content-['['] after:content-[']']">return to the homepage</Link>.
            </p>
            <p className="text-[rgba(128,255,128,0.8)] [text-shadow:0_0_1px_rgba(51,255,51,0.4),0_0_2px_rgba(255,255,255,0.8)] before:content-['>_']">
                Good luck.
            </p>
            <div className="absolute inset-0 opacity-15 pointer-events-none animate-glow"
                style={{
                    background: 'radial-gradient(circle at center, #1bd459 0%, rgba(27, 212, 89, 0.88) 58%, rgba(21, 235, 92, 0.57) 80%, rgba(19, 94, 29, 0.27) 93%, rgba(10, 23, 12, 0) 100%)'
                }}>
            </div>
        </div>
      </div>
    );
  }