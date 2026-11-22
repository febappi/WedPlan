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

// Freely licensed wedding photos from Wikimedia Commons, taken in Bangladesh and Bengal.
// CC BY-SA asks for a visible credit with a link, so every slide keeps its own.
const slides = [
  {
    src: "/images/bangladeshi-bride-bridal-makeup-1920.jpg",
    alt: "A Bangladeshi bride in gold jewellery and a red veil at her wedding",
    position: "50% 35%",
    category: "Makeup & Styling",
    line: "Bridal makeup, hair and jewellery",
    credit: "Photo: Jubair1985, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Bridal_Photo.jpg",
  },
  {
    src: "/images/bengali-bride-flower-stage-1920.jpg",
    alt: "A Bengali bride in a red saree in front of a stage decorated with red roses",
    position: "45% 45%",
    category: "Decoration & Florist",
    line: "Flower stages and bridal seating",
    credit: "Photo: Goutam1962, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Portrait_of_a_Bengali_Bride_21.jpg",
  },
  {
    src: "/images/wedding-couple-parliament-of-bangladesh-1920.jpg",
    alt: "A bride in a red saree and a groom in a gold sherwani outside the Parliament of Bangladesh at night",
    position: "35% 75%",
    category: "Wedding Fashion",
    line: "Sarees and sherwanis for the big day",
    credit: "Photo: Jubair1985, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Wedding_Gallery_-_Wedding_Couple,_Parliament_of_Bangladesh.jpg",
  },
  {
    src: "/images/wedding-dance-chittagong-1920.jpg",
    alt: "Women in bright sarees laughing and dancing at a wedding in Bangladesh",
    position: "55% 45%",
    category: "Photography & Videography",
    line: "Every dance and laugh, on camera",
    credit: "Photo: Jubair1985, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Wedding_Photography_of_Bangladesh.jpg",
  },
  {
    src: "/images/wedding-feast-chittagong-1920.jpg",
    alt: "Guests holding plates of polao at a wedding in Chittagong",
    position: "50% 55%",
    category: "Catering Services",
    line: "Polao, roast and sweets for every guest",
    credit: "Photo: Moheen Reeyad, CC BY-SA 4.0",
    href: "https://commons.wikimedia.org/wiki/File:Bangladeshi_wedding_ceremony,_Chittagong_(02).jpg",
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
            <div data-slot={`hero-${index + 1}`} data-alt="a wedding photograph from Bangladesh" className="h-[min(52dvh,500px)] min-h-72 rounded-(--radius-stock)">
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
            <div className="mt-(--space-md) flex flex-wrap items-baseline justify-between gap-x-(--space-md) gap-y-(--space-2xs) text-sm">
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
