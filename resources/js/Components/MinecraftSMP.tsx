import React from "react";

export function MinecraftSMP() {
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

      {/* Minecraft GUI Screen Frame (Loading Screen Style) - Responsive Borders */}
      <div className="border-[4px] md:border-[8px] border-[#2c2c2c] rounded-lg md:rounded-xl overflow-hidden z-20 relative shadow-[0_8px_0_rgba(0,0,0,0.3)] md:shadow-[0_15px_0_rgba(0,0,0,0.3)] bg-[#c6c6c6]">
        {/* Bezel Frame Inner Shadow/Highlight */}
        <div className="relative shadow-[inset_3px_3px_0_#ffffff,inset_-3px_-3px_0_#555555] md:shadow-[inset_6px_6px_0_#ffffff,inset_-6px_-6px_0_#555555] flex flex-col">
          
          {/* Header Part (Loading...) */}
          <div className="pt-4 pb-3 md:pt-6 md:pb-4 flex items-center justify-center">
            <h3 className="text-xs sm:text-sm md:text-2xl font-normal text-[#3c3c3c]"
                style={{
                  fontFamily: '"Press Start 2P", system-ui',
                  textShadow: '1.5px 1.5px 0 #9e9e9e',
                }}>
              Loading...
            </h3>
          </div>

          {/* Separator / Inner Frame Wrapper */}
          <div className="px-[8px] pb-[8px] md:px-[14px] md:pb-[14px]">
            {/* Inner Frame (Black border surrounding the dark area) */}
            <div className="border-[3px] md:border-[6px] border-[#2c2c2c]">
              {/* Inner Content Area (Semi-transparent dark background) */}
              <div className="bg-black/75 px-4 py-10 md:px-8 md:py-16 flex flex-col items-center justify-center relative min-h-[8rem] md:min-h-[12rem]"
                   style={{ imageRendering: 'pixelated' }}>
                
                {/* Coming Soon Text */}
                <h2 className="relative z-30 text-lg sm:text-2xl md:text-5xl text-white uppercase text-center"
                    style={{
                      fontFamily: '"Press Start 2P", system-ui', 
                      textShadow: '3px 3px 0 rgba(0, 0, 0, 0.4)',
                      lineHeight: '1.5',
                      letterSpacing: '0.05em'
                    }}>
                  Coming Soon 2027
                </h2>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}



