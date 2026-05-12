'use client'

import { motion } from 'framer-motion'

const companies = [
  { name: 'Nexus Ventures', logo: 'NV' },
  { name: 'Orbit Labs', logo: 'OL' },
  { name: 'Stellar Protocol', logo: 'SP' },
  { name: 'DeFi Capital', logo: 'DC' },
  { name: 'Apex DAO', logo: 'AD' },
  { name: 'Quantum Pay', logo: 'QP' },
  { name: 'Arc Finance', logo: 'AF' },
  { name: 'Nova Chain', logo: 'NC' },
]

export default function TrustedBy() {
  return (
    <section className="py-16 border-y border-white/[0.05] relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-10"
        >
          <p className="text-sm text-white/30 tracking-widest uppercase font-medium">
            Trusted by forward-thinking teams worldwide
          </p>
        </motion.div>

        {/* Scrolling logos */}
        <div className="relative flex overflow-hidden gap-0">
          {/* Fade edges */}
          <div className="absolute left-0 top-0 bottom-0 w-32 bg-gradient-to-r from-[#05060f] to-transparent z-10 pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-32 bg-gradient-to-l from-[#05060f] to-transparent z-10 pointer-events-none" />

          {/* Row 1 */}
          <motion.div
            animate={{ x: [0, -1200] }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="flex items-center gap-8 flex-shrink-0"
          >
            {[...companies, ...companies].map((company, i) => (
              <div
                key={`${company.name}-${i}`}
                className="flex items-center gap-2.5 glass rounded-xl px-5 py-3 border border-white/[0.06] hover:border-white/[0.12] transition-colors flex-shrink-0 group"
              >
                <div className="w-8 h-8 rounded-lg gradient-bg-primary flex items-center justify-center text-xs font-bold text-white">
                  {company.logo}
                </div>
                <span className="text-sm font-medium text-white/50 group-hover:text-white/70 transition-colors whitespace-nowrap">
                  {company.name}
                </span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
