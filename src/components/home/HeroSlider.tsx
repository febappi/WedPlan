"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Pause, Play } from "lucide-react";
import { Swiper, SwiperSlide } from "swiper/react";
import type { Swiper as SwiperInstance } from "swiper";
import { A11y, Autoplay, EffectFade, Keyboard, Pagination } from "swiper/modules";
import { useReducedMotion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

// Freely licensed wedding photos from Wikimedia Commons, one for each service category.
// CC BY and CC BY-SA ask for a visible credit with a link, so every slide keeps its own.
const slides = [
  {
    src: "/images/bridal-makeup-artist-1920.jpg",
    alt: "A makeup artist styling a bride's hair with red roses before her wedding",
    position: "55% 30%",
    category: "Makeup & Styling",
    line: "Bridal makeup, hair and jewellery",
    credit: "Photo: Bridalglamguide, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Meribindiya_Bridal_Makeup.jpg",
  },
  {
    src: "/images/wedding-stage-flower-arch-1920.jpg",
    alt: "A wedding stage with a flower arch, a couple's sofa and white flowers along the floor",
    position: "50% 55%",
    category: "Decoration & Florist",
    line: "Flower stages and bridal seating",
    credit: "Photo: Ayga Events, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Indoor_wedding_stage_decoration_in_Kerala.jpg",
  },
  {
    src: "/images/bride-groom-lehenga-sherwani-1920.jpg",
    alt: "A bride in a pink bridal lehenga and a groom in a white sherwani and turban at their wedding",
    position: "50% 35%",
    category: "Wedding Fashion",
    line: "Lehengas, sarees and sherwanis for the big day",
    credit: "Photo: The open draft, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Bride_and_Groom_During_Pair_Pujan_Rasam.jpg",
  },
  {
    src: "/images/wedding-photographer-shoot-1920.jpg",
    alt: "A wedding photographer taking pictures of a bride posing in her gown",
    position: "50% 50%",
    category: "Photography & Videography",
    line: "Photographers for every moment of the day",
    credit: "Photo: Mike Baird, CC BY 2.0",
    href: "https://commons.wikimedia.org/wiki/File:Wedding_photographer_preparing_shot.jpg",
  },
  {
    src: "/images/holud-wedding-food-spread-1920.jpg",
    alt: "A Bangladeshi holud night food spread with sweets, fruit and a decorated cake",
    position: "50% 50%",
    category: "Catering Services",
    line: "Feasts, sweets and cakes for every guest",
    credit: "Photo: Syed Sajidul Islam, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Bangladeshi_traditional_turmeric_night%27s_food_and_its_decoration.jpg",
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
        modules={[A11y, Autoplay, EffectFade, Keyboard, Pagination]}
        onSwiper={(swiper) => {
          swiperRef.current = swiper;
        }}
        slidesPerView={1}
        // a cross-fade swaps photos in place, so no half-moved slide or caption is ever on screen
        effect="fade"
        fadeEffect={{ crossFade: true }}
        loop
        speed={700}
        keyboard={{ enabled: true }}
        autoplay={reduceMotion ? false : { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }}
        pagination={{ el: ".hero-pagination", clickable: true }}
        a11y={{ prevSlideMessage: "Previous photo", nextSlideMessage: "Next photo", paginationBulletMessage: "Show photo {{index}}" }}
        className="rounded-(--radius-stock)"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.src}>
            <div data-slot={`hero-${index + 1}`} data-alt="a photograph of a wedding service" className="h-[min(52dvh,500px)] min-h-72 rounded-(--radius-stock)">
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
                className="absolute right-(--space-xs) bottom-(--space-xs) z-2 rounded-(--radius-input) bg-ink/70 px-(--space-xs) py-(--space-2xs) text-xs leading-snug text-paper sm:px-(--space-sm) transition-colors duration-(--dur-short) hover:bg-ink"
              >
                {slide.credit}
              </a>
            </div>
            <div className="mt-(--space-md) flex flex-wrap items-baseline justify-between gap-x-(--space-md) gap-y-(--space-2xs) px-(--space-2xs) text-sm">
              <span className="font-semibold text-ink">{slide.category}</span>
              <span className="text-ink-3">{slide.line}</span>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      <div className="mt-(--space-sm) flex items-center justify-between gap-(--space-sm)">
        <div className="hero-pagination -ml-(--space-xs) flex items-center" />
        {!reduceMotion && (
          <button
            type="button"
            onClick={togglePause}
            aria-label={paused ? "Play slideshow" : "Pause slideshow"}
            className="flex size-8 shrink-0 items-center justify-center rounded-full text-ink-2 transition-colors duration-(--dur-short) hover:bg-paper-3 hover:text-ink focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-focus"
          >
            {paused ? <Play className="size-4" aria-hidden="true" /> : <Pause className="size-4" aria-hidden="true" />}
          </button>
        )}
      </div>
    </div>
  );
};

export default HeroSlider;
