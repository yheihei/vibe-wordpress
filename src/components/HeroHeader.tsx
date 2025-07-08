'use client'

export default function HeroHeader() {
  return (
    <section
      className="relative min-h-screen overflow-hidden crt scanlines"
      style={{ isolation: 'isolate' }}
    >
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-900 via-purple-900 to-gray-900"></div>

      {/* Pixel rain effect */}
      <div
        className="pixel-rain"
        style={{ left: '5%', animationDelay: '0s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '15%', animationDelay: '0.5s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '25%', animationDelay: '1s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '35%', animationDelay: '1.5s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '45%', animationDelay: '2s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '55%', animationDelay: '2.5s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '65%', animationDelay: '3s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '75%', animationDelay: '3.5s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '85%', animationDelay: '4s' }}
      ></div>
      <div
        className="pixel-rain"
        style={{ left: '95%', animationDelay: '4.5s' }}
      ></div>

      {/* Pixel particles */}
      <div
        className="pixel-particle"
        style={{ left: '10%', animationDelay: '0s' }}
      ></div>
      <div
        className="pixel-particle"
        style={{ left: '30%', animationDelay: '2s', background: '#00fffc' }}
      ></div>
      <div
        className="pixel-particle"
        style={{ left: '50%', animationDelay: '4s', background: '#fc00ff' }}
      ></div>
      <div
        className="pixel-particle"
        style={{ left: '70%', animationDelay: '6s' }}
      ></div>
      <div
        className="pixel-particle"
        style={{ left: '90%', animationDelay: '8s', background: '#00ff00' }}
      ></div>

      {/* Game stage background */}
      <div className="absolute bottom-0 left-0 right-0 h-48 bg-gray-800 border-t-4 border-gray-700">
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gray-700 border-t-4 border-gray-600"></div>
      </div>

      {/* Character placeholders - Replace these divs with actual images when available */}
      {/* Main character Akim */}
      <div className="absolute bottom-[35%] right-[10%] md:bottom-[46%] md:right-[16%] z-20">
        <img
          src="/images/game-assets/akim_level_2.png"
          alt="Akim"
          className="h-24 md:h-52 float-animation"
          style={{ filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.5))' }}
        />
      </div>

      {/* VLOrochi */}
      <div className="absolute bottom-[45%] left-[5%] md:bottom-60 md:left-[25%] z-10">
        <img
          src="/images/game-assets/VLOrochi-1.png.png"
          alt="Orochi"
          className="h-20 md:h-36 float-animation"
          style={{
            animationDelay: '1.2s',
            filter: 'drop-shadow(0 0 15px rgba(128, 0, 255, 0.6))',
          }}
        />
      </div>

      {/* Hayato character */}
      <div className="absolute bottom-[15%] left-[15%] z-8 hidden md:block">
        <img
          src="/images/game-assets/hayato_chara.png"
          alt="Hayato"
          className="h-20 float-animation"
          style={{
            animationDelay: '0.3s',
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.6))',
          }}
        />
      </div>

      {/* Leelee character */}
      <div className="absolute top-[30%] left-[10%] md:top-20 md:left-[28%] z-20">
        <img
          src="/images/game-assets/leelee-1_1.png"
          alt="Leelee"
          className="h-28 md:h-48 float-animation"
          style={{
            animationDelay: '1s',
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 255, 0.5))',
          }}
        />
      </div>

      {/* Cat */}
      <div className="absolute bottom-[44%] right-1/5 z-8 hidden md:block">
        <img
          src="/images/game-assets/cat.png"
          alt="Cat"
          className="h-32 float-animation"
          style={{ animationDelay: '1.5s' }}
        />
      </div>

      {/* VLYama */}
      <div className="absolute top-[10%] right-[25%] md:top-10 md:right-[35%] z-10">
        <img
          src="/images/game-assets/VLYama-2.png.png"
          alt="VLYama"
          className="h-24 md:h-32 float-animation"
          style={{
            animationDelay: '2.2s',
            filter: 'drop-shadow(0 0 12px rgba(255, 128, 0, 0.6))',
          }}
        />
      </div>

      {/* VeryLongDragQueensGatotu */}
      <div className="absolute bottom-[20%] right-2 md:bottom-[25%] md:right-5 z-20">
        <img
          src="/images/game-assets/VeryLongDragQueensGatotu-1.png.png"
          alt="DragQueens Gatotu"
          className="h-24 md:h-44 jump-animation"
          style={{
            animationDelay: '0.7s',
            filter: 'drop-shadow(0 0 10px rgba(255, 255, 0, 0.6))',
          }}
        />
      </div>

      {/* vlikehaya_slim */}
      <div className="absolute bottom-[50%] left-[15%] z-7 hidden md:block">
        <img
          src="/images/game-assets/vlikehaya_slim-2.png.png"
          alt="VLike Haya"
          className="h-32 float-animation"
          style={{
            animationDelay: '2.5s',
            filter: 'drop-shadow(0 0 8px rgba(0, 255, 128, 0.6))',
          }}
        />
      </div>

      {/* Unikisp */}
      <div className="absolute bottom-[45%] right-[30%] md:bottom-52 md:right-[28%] z-8">
        <img
          src="/images/game-assets/Unikisp-2.png.png"
          alt="Unikisp"
          className="h-16 md:h-32 float-animation"
          style={{
            animationDelay: '3.2s',
            filter: 'drop-shadow(0 0 10px rgba(255, 0, 128, 0.6))',
          }}
        />
      </div>

      {/* Karma */}
      <div className="absolute bottom-62 left-[15%] z-7">
        <img
          src="/images/game-assets/Karma-2.png.png"
          alt="Karma"
          className="h-20 md:h-32 float-animation"
          style={{
            animationDelay: '3.8s',
            filter: 'drop-shadow(0 0 12px rgba(255, 255, 0, 0.6))',
          }}
        />
      </div>

      {/* Main content */}
      <div className="relative z-[101] flex flex-col items-center justify-center min-h-screen px-2 md:px-4">
        {/* Logo/Title */}
        <div className="text-center mb-12">
          <h1 className="font-press-start text-5xl md:text-6xl lg:text-7xl mb-4">
            <span className="text-yellow-300 glitch-text">VLCNP</span>
          </h1>
          <h2 className="font-press-start text-3xl md:text-4xl lg:text-5xl mb-8">
            <span className="text-white">STORY</span>
          </h2>

          {/* Tagline */}
          <p className="font-press-start text-sm md:text-base text-gray-300 mb-12">
            Retro Game Developer&apos;s Playground
          </p>
        </div>

        {/* Play button with special effects */}
        <a
          href="https://vlcnpstory.y-game.tech/"
          target="_blank"
          rel="noopener noreferrer"
          className="relative group"
        >
          <div className="absolute inset-0 bg-yellow-400 blur-xl opacity-50 group-hover:opacity-75 transition-opacity"></div>
          <button className="relative font-press-start text-lg md:text-xl bg-yellow-400 text-black px-8 py-6 border-4 border-black shadow-[8px_8px_0_0_#000] hover:shadow-[4px_4px_0_0_#000] hover:bg-yellow-300 active:shadow-none active:translate-x-2 active:translate-y-2 transition-all transform">
            <span className="flex items-center gap-4">
              <span className="text-2xl">▶</span>
              体験版をプレイ
              <span className="text-2xl">◀</span>
            </span>
          </button>
        </a>

        {/* Instructions */}
        <div className="mt-8 text-center">
          <p className="font-vt323 text-xl text-gray-400">
            PRESS ENTER TO START
          </p>
          <p className="font-vt323 text-lg text-gray-500 blinking-cursor">_</p>
        </div>

      </div>

      {/* Screenshots preview */}
      <div className="absolute top-[6%] right-2 transform rotate-3 opacity-95 hover:opacity-100 transition-all hover:scale-110 hidden lg:block z-15">
        <img
          src="/images/game-assets/screenshot2.png"
          alt="Game Screenshot"
          className="w-[28rem] border-4 border-yellow-400 shadow-[10px_10px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] transition-all"
          style={{ filter: 'drop-shadow(0 0 20px rgba(255, 255, 0, 0.3))' }}
        />
      </div>

      <div className="absolute top-16 left-2 transform -rotate-3 opacity-95 hover:opacity-100 transition-all hover:scale-110 hidden lg:block z-15">
        <img
          src="/images/game-assets/screenshot1.png"
          alt="Game Screenshot"
          className="w-96 border-4 border-green-400 shadow-[10px_10px_0_0_#000] hover:shadow-[12px_12px_0_0_#000] transition-all"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 255, 0, 0.3))' }}
        />
      </div>

      <div className="absolute bottom-48 right-[5%] transform rotate-2 opacity-95 hover:opacity-100 transition-all hover:scale-110 hidden xl:block z-15">
        <img
          src="/images/game-assets/screenshot5.jpg"
          alt="Game Screenshot"
          className="w-80 border-4 border-blue-400 shadow-[8px_8px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] transition-all"
          style={{ filter: 'drop-shadow(0 0 20px rgba(0, 128, 255, 0.3))' }}
        />
      </div>

      <div className="absolute bottom-60 left-12 transform -rotate-2 opacity-95 hover:opacity-100 transition-all hover:scale-110 hidden xl:block z-15">
        <img
          src="/images/game-assets/screenshot4.png"
          alt="Game Screenshot"
          className="w-80 border-4 border-purple-400 shadow-[8px_8px_0_0_#000] hover:shadow-[10px_10px_0_0_#000] transition-all"
          style={{ filter: 'drop-shadow(0 0 20px rgba(128, 0, 255, 0.3))' }}
        />
      </div>

      {/* Title area */}
      <div className="absolute top-8 left-8 font-vt323 text-lg text-yellow-300 z-[101]">
        <div>RETRO GAME DEVELOPER</div>
      </div>

      <div className="absolute top-8 right-8 font-vt323 text-lg text-green-400 z-[101]">
        <div>EST. 2025</div>
      </div>

      {/* Scroll Indicator */}
      <div
        className="scroll-indicator"
        onClick={() => {
          window.scrollTo({
            top: window.innerHeight,
            behavior: 'smooth',
          })
        }}
      >
        <div className="text-center">
          <div className="flex flex-col items-center gap-1">
            <span className="text-green-400 text-2xl animate-pulse">▼</span>
            <span
              className="text-green-400 text-xl animate-pulse"
              style={{ animationDelay: '0.2s' }}
            >
              ▼
            </span>
            <span
              className="text-green-400 text-lg animate-pulse"
              style={{ animationDelay: '0.4s' }}
            >
              ▼
            </span>
          </div>
        </div>
      </div>
    </section>
  )
}
