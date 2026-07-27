import React, { useState } from "react";
import { Copy, Check, Flame, Sparkles } from "lucide-react";

export function MinecraftSMP() {
  const [copied, setCopied] = useState(false);

  const handleCopyIp = () => {
    navigator.clipboard.writeText("play.safescape.ph");
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto mb-16 md:mb-32 mt-8 md:-mt-4">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
        `}
      </style>

      {/* Chainmail Hangers - Hidden on mobile */}
      <div className="absolute -top-[8rem] left-[15%] hidden md:flex flex-col items-center -z-10">
        {[...Array(4)].map((_, i) => (
          <div key={`chain-l-${i}`} className="flex flex-col items-center -mt-2">
            <div className="w-8 h-12 border-[6px] border-[#9e9e9e] bg-transparent shadow-[inset_2px_2px_0_#e0e0e0,2px_2px_0_#555]" style={{ borderRadius: '4px' }} />
            <div className="w-3 h-10 bg-[#808080] border-[3px] border-[#c0c0c0] shadow-[2px_2px_0_#555] -mt-3 z-10" />
          </div>
        ))}
      </div>
      
      <div className="absolute -top-[8rem] right-[15%] hidden md:flex flex-col items-center -z-10">
        {[...Array(4)].map((_, i) => (
          <div key={`chain-r-${i}`} className="flex flex-col items-center -mt-2">
            <div className="w-8 h-12 border-[6px] border-[#9e9e9e] bg-transparent shadow-[inset_2px_2px_0_#e0e0e0,2px_2px_0_#555]" style={{ borderRadius: '4px' }} />
            <div className="w-3 h-10 bg-[#808080] border-[3px] border-[#c0c0c0] shadow-[2px_2px_0_#555] -mt-3 z-10" />
          </div>
        ))}
      </div>

      {/* Minecraft GUI Screen Frame (Teaser Screen Style) */}
      <div className="border-[4px] md:border-[8px] border-[#2c2c2c] rounded-xl overflow-hidden z-20 relative shadow-[0_15px_0_rgba(0,0,0,0.4)] bg-[#c6c6c6]">
        {/* Bezel Frame Inner Shadow/Highlight */}
        <div className="relative shadow-[inset_3px_3px_0_#ffffff,inset_-3px_-3px_0_#555555] md:shadow-[inset_6px_6px_0_#ffffff,inset_-6px_-6px_0_#555555] flex flex-col">
          
          {/* Header Part (Title Bar & XP Level) */}
          <div className="pt-4 pb-3 md:pt-6 md:pb-4 flex flex-col items-center justify-center gap-2 border-b-2 border-[#8b8b8b]">
            <div className="flex items-center gap-2">
              <Flame className="h-5 w-5 md:h-7 md:w-7 text-orange-600 animate-bounce" />
              <h3 className="text-xs sm:text-sm md:text-xl font-normal text-[#222] tracking-wider uppercase text-center"
                  style={{ fontFamily: '"Press Start 2P", system-ui', textShadow: '1.5px 1.5px 0 #fff' }}>
                SafeScape Minecraft SMP
              </h3>
              <Flame className="h-5 w-5 md:h-7 md:w-7 text-orange-600 animate-bounce" />
            </div>

            {/* Minecraft XP Bar HUD */}
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] md:text-xs text-[#555] font-black" style={{ fontFamily: '"Press Start 2P", system-ui' }}>
                HP ❤️❤️❤️❤️❤️
              </span>
              <div className="w-32 md:w-60 h-3 bg-[#111] border-2 border-[#555] rounded-xs relative overflow-hidden">
                <div className="h-full bg-gradient-to-r from-emerald-500 to-green-400 w-3/4 animate-pulse" />
              </div>
              <span className="text-[10px] md:text-xs text-emerald-700 font-bold" style={{ fontFamily: '"Press Start 2P", system-ui' }}>
                LVL 2027
              </span>
            </div>
          </div>

          {/* Main Teaser Poster Canvas */}
          <div className="p-3 md:p-6">
            <div className="border-[3px] md:border-[6px] border-[#2c2c2c] bg-black/85 p-6 md:p-10 flex flex-col items-center justify-center relative min-h-[16rem] md:min-h-[22rem] rounded-lg shadow-inner">
              
              {/* Floating Fire Embers Overlay Effect */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-30">
                <div className="absolute top-4 left-1/4 w-2 h-2 bg-orange-400 animate-ping" />
                <div className="absolute top-12 right-1/3 w-3 h-3 bg-yellow-400 animate-pulse" />
                <div className="absolute bottom-6 left-1/3 w-2 h-2 bg-red-500 animate-bounce" />
              </div>

              {/* Main Heading Poster Title: COMING SOON 2027 */}
              <div className="text-center z-10 space-y-3 mb-6">
                <span className="inline-block text-[10px] md:text-xs text-yellow-400 uppercase tracking-widest bg-yellow-950/80 px-3 py-1 border border-yellow-500/50 rounded-md"
                      style={{ fontFamily: '"Press Start 2P", system-ui' }}>
                  🔥 Official Survival Multiplayer Server
                </span>
                
                <h2 className="text-2xl sm:text-4xl md:text-6xl text-white uppercase text-center tracking-wider pt-2 leading-relaxed"
                    style={{
                      fontFamily: '"Press Start 2P", system-ui', 
                      textShadow: '4px 4px 0 #d60000, 8px 8px 0 #800000',
                    }}>
                  COMING SOON <br />
                  <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.6)]">2027</span>
                </h2>

                <p className="text-slate-300 text-xs md:text-sm max-w-2xl mx-auto pt-3 font-mono">
                  Get ready for the ultimate Fire Safety Minecraft adventure! Explore BFP Sta. Cruz HQ, save villages from fire hazards, and earn exclusive firefighter gear.
                </p>
              </div>

              {/* Teaser Feature Poster Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl my-4 z-10">
                {/* Feature 1 */}
                <div className="bg-[#1c1c1c] border-2 border-[#4a4a4a] hover:border-yellow-400 p-4 rounded-xl shadow-lg transition-all group hover:-translate-y-1">
                  <div className="text-2xl mb-2">🚒</div>
                  <h4 className="text-yellow-400 text-xs font-bold uppercase mb-1.5" style={{ fontFamily: '"Press Start 2P", system-ui' }}>
                    BFP Sta. Cruz HQ
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
                    Explore a 1:1 scale pixel replica of the Sta. Cruz Fire Station built inside Minecraft!
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="bg-[#1c1c1c] border-2 border-[#4a4a4a] hover:border-red-400 p-4 rounded-xl shadow-lg transition-all group hover:-translate-y-1">
                  <div className="text-2xl mb-2">🧑‍🚒</div>
                  <h4 className="text-red-400 text-xs font-bold uppercase mb-1.5" style={{ fontFamily: '"Press Start 2P", system-ui' }}>
                    Fire Quests
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
                    Team up with friends to respond to emergency calls & save villagers from raging fires!
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="bg-[#1c1c1c] border-2 border-[#4a4a4a] hover:border-emerald-400 p-4 rounded-xl shadow-lg transition-all group hover:-translate-y-1">
                  <div className="text-2xl mb-2">🧱</div>
                  <h4 className="text-emerald-400 text-xs font-bold uppercase mb-1.5" style={{ fontFamily: '"Press Start 2P", system-ui' }}>
                    Fireproof Builds
                  </h4>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans font-medium">
                    Construct fire-resistant structures, earn badges & unlock custom firefighter skins!
                  </p>
                </div>
              </div>

              {/* Server IP Copy Box */}
              <div className="flex items-center gap-2 bg-[#141414] border-2 border-[#383838] px-4 py-2.5 rounded-xl text-xs font-mono text-slate-300 mt-2 z-10">
                <span className="text-slate-500 font-bold">SERVER IP:</span>
                <span className="text-white font-bold tracking-wider">play.safescape.ph</span>
                <button
                  onClick={handleCopyIp}
                  className="ml-2 p-1.5 bg-[#2c2c2c] hover:bg-[#3c3c3c] text-white rounded-lg transition-colors cursor-pointer"
                  title="Copy Server IP"
                >
                  {copied ? <Check className="h-4 w-4 text-emerald-400" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>

            </div>
          </div>

          {/* Footer Bar (Java & Bedrock Crossplay Info) */}
          <div className="py-3 px-6 bg-[#b0b0b0] border-t-2 border-[#8b8b8b] flex flex-col sm:flex-row items-center justify-between gap-2 text-[10px] md:text-xs text-[#333] font-bold">
            <span style={{ fontFamily: '"Press Start 2P", system-ui' }}>
              🎮 Crossplay: Minecraft Java & Bedrock 1.21+
            </span>
            <span className="text-[#555]" style={{ fontFamily: '"Press Start 2P", system-ui' }}>
              STATUS: 🛠️ IN DEVELOPMENT (2027)
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}


