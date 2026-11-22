"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, Keyboard, Pagination } from "swiper/modules";
import { useReducedMotion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";

// Freely licensed Wikimedia Commons photos; each keeps its visible credit as the licence asks
const slides = [
  {
    src: "/images/florist-working-on-a-bouquet-of-flowers-1920.jpg",
    alt: "A florist holding a wrapped bouquet of lilies and orchids",
    position: "40% 50%",
    category: "Decoration & Florist",
    line: "Bouquets, stage flowers and table pieces",
    credit: "Photo: direct2Florist, CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Florist_working_on_a_bouquet_of_flowers.jpg",
  },
  {
    src: "/images/photographic-lenses-and-tubes-2025-1920.jpg",
    alt: "A row of camera lenses standing on a wooden shelf",
    position: "50% 50%",
    category: "Photography & Videography",
    line: "Photographers and film crews for the whole day",
    credit: "Photo: Carlos Valenzuela Montuy, CC BY 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Photographic_lenses_and_tubes_2025.jpg",
  },
  {
    src: "/images/traditional-goldsmith-engraving-a-ring-goa-india-1920.jpg",
    alt: "A goldsmith engraving a ring at a wooden bench",
    position: "50% 40%",
    category: "Wedding Fashion",
    line: "Rings, jewellery and bridal wear",
    credit: "Photo: SerChevalerie, CC0",
    href: "https://commons.wikimedia.org/wiki/File:Traditional_goldsmith_engraving_a_ring,_Goa,_India.jpg",
  },
  {
    src: "/images/tailor-s-shop-werkstatt-2-1920.jpg",
    alt: "Tailor's shears, a tape measure and chalk on a cutting table",
    position: "45% 55%",
    category: "Wedding Fashion",
    line: "Sherwanis, suits and blouses stitched to fit",
    credit: "Photo: Wolfgang Sauber, CC BY-SA 3.0",
    href: "https://commons.wikimedia.org/wiki/File:Tailor%C2%B4s_shop_-_Werkstatt_2.jpg",
  },
  {
    src: "/images/florist-working-1920.jpg",
    alt: "Hands gathering green stems into a bouquet at a flower shop counter",
    position: "65% 40%",
    category: "Decoration & Florist",
    line: "Fresh arrangements made for your date",
    credit: "Photo: direct2Florist, CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Florist_working.jpg",
  },
];

const HeroSlider = () => {
  const reduceMotion = useReducedMotion();
  const swiperRef = useRef<SwiperInstance | null>(null);
  const [paused, setPaused] = useState(false);

  // A moving slider needs a visible pause control
  const togglePause = () => {
    const autoplay = swiperRef.current?.autoplay;
    if (!autoplay) {
      return;
    }
    if (paused) {
      autoplay.start();
    } else {
      autoplay.stop();
    }
    setPaused(!paused);
  };

  return (
    <div>
      <Swiper
        modules={[A11y, Autoplay, Keyboard, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        spaceBetween={16}
        loop
        speed={600}
        keyboard={{ enabled: true }}
        autoplay={reduceMotion ? false : { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ el: ".hero-pagination", clickable: true }}
        a11y={{ prevSlideMessage: "Previous photo", nextSlideMessage: "Next photo", paginationBulletMessage: "Show photo {{index}}" }}
        className="rounded-(--radius-stock)"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.src}>
            <div data-slot={`hero-${index + 1}`} data-alt="a wedding photograph from a real vendor" className="h-[min(52dvh,500px)] min-h-72 rounded-(--radius-stock)">
              <Image
                src={slide.src}
                alt={slide.alt}
                fill
                priority={index === 0}
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover"
                style={{ objectPosition: slide.position }}
              />
              <a
                data-keep
                href={slide.href}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute right-(--space-xs) bottom-(--space-xs) z-2 rounded-(--radius-pill) bg-ink/70 px-(--space-xs) py-(--space-3xs) text-[0.6875rem] text-paper transition-colors duration-(--dur-short) hover:bg-ink"
              >
                {slide.credit}
              </a>
            </div>
            <div className="mt-(--space-md) flex flex-wrap items-baseline justify-between gap-x-(--space-md) gap-y-(--space-2xs) text-sm">
              <span className="font-semibold text-ink">{slide.category}</span>
              <span className="text-ink-3">{slide.line}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-(--space-sm) flex items-center justify-between gap-(--space-sm)">
        <div className="hero-pagination flex items-center gap-(--space-2xs)" />
        {!reduceMotion && (
          <button
            type="button"
            onClick={togglePause}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="flex size-8 items-center justify-center rounded-full text-ink-2 transition-colors duration-(--dur-short) hover:bg-paper-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
