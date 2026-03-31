import { motion } from 'framer-motion'

export function RainbowBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-[#02020a]">
      {/* Dynamic Mesh Gradients */}
      <div className="absolute inset-0 opacity-40 mix-blend-screen">
        <motion.div
          animate={{
            rotate: [0, 360],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            ease: "linear"
          }}
          className="absolute -top-[50%] -left-[50%] w-[200%] h-[200%] bg-[conic-gradient(from_0deg,transparent_0deg,#ff0000_60deg,#ff7f00_120deg,#ffff00_180deg,#00ff00_240deg,#0000ff_300deg,transparent_360deg)] blur-[100px]"
        />
      </div>

      {/* Floating Delta Orbs */}
      <motion.div
        animate={{
          x: [0, 100, -50, 0],
          y: [0, -50, 100, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/30 blur-[120px] rounded-full mix-blend-screen"
      />
      <motion.div
        animate={{
          x: [0, -100, 50, 0],
          y: [0, 100, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "easeInOut" }}
        className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/20 blur-[130px] rounded-full mix-blend-screen"
      />
      
      {/* High-Fidelity Grain Overlay */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none mix-blend-overlay bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
      
      {/* Radial Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0.4)_100%)]" />
    </div>
  )
}
