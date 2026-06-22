import { Link } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay, EffectFade } from 'swiper/modules';
import { ArrowRight, ChevronRight } from 'lucide-react';
import { heroSlides } from '../../data/products';

import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';

// Header heights: announcement(32) + navbar(72) + category-strip(44) = 148px
const HERO_HEIGHT = 'calc(100vh - 148px)';

export default function HeroSection() {
  return (
    <section
      className="relative w-full overflow-hidden"
      style={{ height: HERO_HEIGHT, minHeight: '520px' }}
    >
      <Swiper
        modules={[Navigation, Pagination, Autoplay, EffectFade]}
        effect="fade"
        navigation
        pagination={{ clickable: true }}
        autoplay={{ delay: 5500, disableOnInteraction: false, pauseOnMouseEnter: true }}
        loop
        speed={900}
        className="hero-swiper h-full w-full"
      >
        {heroSlides.map(slide => (
          <SwiperSlide key={slide.id}>
            <div className="relative h-full w-full">
              {/* Background image */}
              <div className="absolute inset-0">
                <img
                  src={slide.image}
                  alt={`${slide.title} — Sitara Vastram ethnic wear`}
                  className="w-full h-full object-cover object-top"
                />
                {/* Gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-r from-navy-700/88 via-navy-700/50 to-navy-700/10" />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-900/50 via-transparent to-transparent" />
              </div>

              {/* Floating decorative rings */}
              <div className="absolute top-1/4 right-[15%] w-80 h-80 rounded-full border border-rosegold-400/12 float-slow hidden lg:block pointer-events-none" />
              <div className="absolute top-[38%] right-[22%] w-52 h-52 rounded-full border border-rosegold-400/18 float-slow hidden lg:block pointer-events-none" style={{ animationDelay: '2s' }} />
              <div className="absolute bottom-1/4 right-[10%] w-24 h-24 rounded-full border border-rosegold-300/20 float-slow hidden lg:block pointer-events-none" style={{ animationDelay: '4s' }} />

              {/* Slide Content */}
              <div className="relative h-full flex items-center">
                <div className="max-w-screen-xl mx-auto px-6 sm:px-10 lg:px-14 w-full">
                  <div className="max-w-[580px]">
                    {/* Badge */}
                    {slide.badge && (
                      <div className="inline-flex items-center gap-2.5 mb-5">
                        <div className="w-8 h-px bg-rosegold-400" />
                        <span className="font-inter text-[11px] font-bold tracking-[0.32em] uppercase text-rosegold-300">
                          {slide.badge}
                        </span>
                      </div>
                    )}

                    {/* Subtitle */}
                    <p className="font-inter text-sm font-medium tracking-[0.22em] uppercase text-white/65 mb-4">
                      {slide.subtitle}
                    </p>

                    {/* Title */}
                    <h1 className="font-playfair text-5xl sm:text-6xl lg:text-[72px] font-bold text-white leading-[1.08] mb-5">
                      {slide.title}
                    </h1>

                    {/* Rose gold divider */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="h-px w-10 bg-rosegold-400" />
                      <div className="w-1.5 h-1.5 rotate-45 bg-rosegold-400" />
                    </div>

                    {/* Description */}
                    <p className="font-inter text-base sm:text-lg text-white/78 leading-relaxed mb-9 max-w-[420px]">
                      {slide.description}
                    </p>

                    {/* CTAs */}
                    <div className="flex flex-wrap items-center gap-4">
                      <Link
                        to={slide.ctaLink}
                        className="group inline-flex items-center gap-2.5 bg-rosegold-500 text-white font-inter font-semibold text-sm tracking-[0.1em] uppercase px-8 py-4 rounded-sm hover:bg-rosegold-600 active:scale-95 transition-all duration-300 shadow-rose hover:shadow-rose-lg"
                      >
                        {slide.cta1}
                        <ArrowRight size={16} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                      <Link
                        to={slide.ctaLink}
                        className="group inline-flex items-center gap-1.5 text-white font-inter font-medium text-sm tracking-wide border-b border-white/40 pb-0.5 hover:border-rosegold-400 hover:text-rosegold-300 transition-all duration-300"
                      >
                        {slide.cta2}
                        <ChevronRight size={14} className="transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>

              {/* Bottom scroll hint */}
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1.5 opacity-60">
                <div className="w-px h-7 bg-white/50" />
                <span className="text-white/60 text-[10px] font-inter tracking-[0.3em] uppercase">Scroll</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
