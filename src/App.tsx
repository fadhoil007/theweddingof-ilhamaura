import { FormEvent, useEffect, useMemo, useRef, useState } from "react";

const weddingDate = new Date("2026-06-08T09:00:00+07:00").getTime();

const galleryImages = [
  "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1606800052052-a08af7148866?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6?auto=format&fit=crop&w=1400&q=85",
  "https://images.unsplash.com/photo-1509610973147-232dfea52a97?auto=format&fit=crop&w=1400&q=85",
];

const story = [
  {
    title: "Pertemuan Tak Terduga",
    date: "Awal Cerita",
    text: "Sapa pertama mereka hadir dengan sederhana di sebuah tenant CFD, dalam momen yang tampak biasa namun ditakdirkan menjadi awal yang indah.",
  },
  {
    title: "Tumbuh Dengan Ketulusan",
    date: "Bab Yang Lembut",
    text: "Hubungan itu tumbuh melalui kebaikan, percakapan yang jujur, dan keyakinan yang perlahan hadir bersama doa-doa yang dipanjatkan.",
  },
  {
    title: "Komitmen Dan Doa",
    date: "Bismillah",
    text: "Ilham dan Aura memilih cinta yang dituntun oleh iman, restu keluarga, dan niat untuk membangun rumah tangga yang penuh rahmah.",
  },
  {
    title: "Persiapan Pernikahan",
    date: "Together Forever",
    text: "Kini keluarga berkumpul untuk menjadi saksi janji suci dan merayakan awal perjalanan selamanya, insyaAllah.",
  },
];

const defaultWishes = [
  {
    name: "Nadia",
    attendance: "Hadir",
    message: "Semoga Allah memberkahi pernikahan kalian dengan sakinah, mawaddah, dan rahmah yang tak berakhir.",
  },
  {
    name: "Rizky",
    attendance: "Hadir",
    message: "Barakallahu lakuma. Semoga Ilham dan Aura selalu diberi kebahagiaan dalam kehidupan bersama.",
  },
];

type Wish = (typeof defaultWishes)[number];

function getGuestName() {
  if (typeof window === "undefined") return "Tamu Undangan";
  const params = new URLSearchParams(window.location.search);
  return params.get("to") || params.get("guest") || "Tamu Undangan";
}

function formatNumber(value: number) {
  return String(Math.max(0, value)).padStart(2, "0");
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const tick = () => {
      const distance = Math.max(0, weddingDate - Date.now());
      setTimeLeft({
        days: Math.floor(distance / (1000 * 60 * 60 * 24)),
        hours: Math.floor((distance / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((distance / (1000 * 60)) % 60),
        seconds: Math.floor((distance / 1000) % 60),
      });
    };

    tick();
    const timer = window.setInterval(tick, 1000);
    return () => window.clearInterval(timer);
  }, []);

  return timeLeft;
}

function Ornament({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 220 220" fill="none" aria-hidden="true">
      <path d="M110 15c17 34 41 58 95 95-54 37-78 61-95 95-17-34-41-58-95-95 54-37 78-61 95-95Z" stroke="currentColor" strokeWidth="1" />
      <path d="M110 55c9 19 23 32 54 55-31 23-45 36-54 55-9-19-23-32-54-55 31-23 45-36 54-55Z" stroke="currentColor" strokeWidth="1" />
      <circle cx="110" cy="110" r="18" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

function SectionHeader({ eyebrow, title, text }: { eyebrow: string; title: string; text?: string }) {
  return (
    <div className="reveal mx-auto mb-12 max-w-3xl text-center">
      <p className="mb-3 text-xs uppercase tracking-[0.45em] text-[#b9944c]">{eyebrow}</p>
      <h2 className="font-serif text-4xl text-[#3f2f1d] sm:text-5xl">{title}</h2>
      {text ? <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-[#7a6a57] sm:text-base">{text}</p> : null}
    </div>
  );
}

function App() {
  const [isOpened, setIsOpened] = useState(false);
  const [guestName] = useState(getGuestName);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const [slide, setSlide] = useState(0);
  const [copied, setCopied] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
  const countdown = useCountdown();
  const [wishes, setWishes] = useState<Wish[]>(() => {
    if (typeof window === "undefined") return defaultWishes;
    const saved = window.localStorage.getItem("ilham-aura-wishes");
    return saved ? JSON.parse(saved) : defaultWishes;
  });

  const particleStyles = useMemo(
    () =>
      Array.from({ length: 34 }, (_, index) => ({
        left: `${(index * 29) % 100}%`,
        top: `${(index * 47) % 100}%`,
        animationDelay: `${(index % 9) * 0.6}s`,
        animationDuration: `${9 + (index % 6)}s`,
      })),
    [],
  );

  useEffect(() => {
    document.title = "Ilham & Aura - Together Forever";
    const description = "Undangan pernikahan Islami sinematik premium untuk Ilham Ilhami dan Putri Aura.";
    let meta = document.querySelector('meta[name="description"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "description");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", description);
  }, []);

  useEffect(() => {
    const items = document.querySelectorAll(".reveal");
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-visible");
        });
      },
      { threshold: 0.16 },
    );

    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, [isOpened, wishes.length]);

  useEffect(() => {
    window.localStorage.setItem("ilham-aura-wishes", JSON.stringify(wishes));
  }, [wishes]);

  useEffect(() => {
    const timer = window.setInterval(() => setSlide((current) => (current + 1) % galleryImages.length), 4500);
    return () => window.clearInterval(timer);
  }, []);

  const openInvitation = async () => {
    setIsOpened(true);
    document.body.classList.add("invitation-opened");
    try {
      await audioRef.current?.play();
      setIsMusicPlaying(true);
    } catch {
      setIsMusicPlaying(false);
    }
    await new Promise((resolve) => window.setTimeout(resolve, 350));
    document.getElementById("hero")?.scrollIntoView({ behavior: "smooth" });
  };

  const toggleMusic = async () => {
    if (!audioRef.current) return;
    if (audioRef.current.paused) {
      await audioRef.current.play();
      setIsMusicPlaying(true);
    } else {
      audioRef.current.pause();
      setIsMusicPlaying(false);
    }
  };

  const submitRsvp = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const nextWish = {
      name: String(form.get("name") || "Tamu"),
      attendance: String(form.get("attendance") || "Hadir"),
      message: String(form.get("message") || "Barakallahu lakuma."),
    };
    setWishes((current) => [nextWish, ...current].slice(0, 8));
    event.currentTarget.reset();
  };

  const copyAccount = async () => {
    await navigator.clipboard.writeText("8888 0608 2026");
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="min-h-screen overflow-hidden bg-[#f6eddf] text-[#4c3b28]">
      <audio
        ref={audioRef}
        loop
        preload="auto"
        src="https://archive.org/download/y-2mate-mp-3cut.net_202301/y2mate%20%28mp3cut.net%29.mp3"
      />

      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -left-24 top-16 h-72 w-72 rounded-full bg-[#d6ac59]/25 blur-3xl" />
        <div className="absolute bottom-20 right-0 h-96 w-96 rounded-full bg-[#fff7e8]/80 blur-3xl" />
        {particleStyles.map((style, index) => (
          <span key={index} className="particle" style={style} />
        ))}
      </div>

      <section
        className={`fixed inset-0 z-50 grid place-items-center overflow-hidden bg-[#120f0b] px-6 transition duration-1000 ${
          isOpened ? "pointer-events-none opacity-0 blur-xl" : "opacity-100"
        }`}
      >
        <img
          src="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1800&q=85"
          alt="Soft cinematic wedding atmosphere"
          className="absolute inset-0 h-full w-full scale-105 object-cover opacity-45 blur-[2px]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(245,225,177,0.26),rgba(18,15,11,0.92)_68%)]" />
        <Ornament className="absolute left-1/2 top-12 h-36 w-36 -translate-x-1/2 text-[#d8b15f]/40 opening-float" />
        <div className="relative mx-auto max-w-xl text-center text-[#fffaf0] opening-rise">
          <p className="mb-5 text-xs uppercase tracking-[0.55em] text-[#dfc385]">Undangan Pernikahan</p>
          <h1 className="font-serif text-5xl leading-none sm:text-7xl">Ilham & Aura</h1>
          <p className="mx-auto mt-6 max-w-md text-sm leading-7 text-[#f3e7d4]">
            Kepada {guestName}, dengan penuh hormat kami mengundang Anda untuk menyaksikan janji suci yang dirangkai dengan cinta, doa, dan keberkahan.
          </p>
          <button onClick={openInvitation} className="gold-button mt-10" type="button">
            Buka Undangan
          </button>
        </div>
      </section>

      <button
        onClick={toggleMusic}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full border border-[#d8b15f]/40 bg-[#fff8ea]/80 px-4 py-3 text-xs uppercase tracking-[0.22em] text-[#7a5720] shadow-[0_18px_60px_rgba(93,63,21,0.18)] backdrop-blur-xl transition hover:-translate-y-1"
        type="button"
        aria-label="Putar atau jeda musik latar"
      >
        <span className={`music-disc ${isMusicPlaying ? "is-playing" : ""}`} />
        {isMusicPlaying ? "Diputar" : "Musik"}
      </button>

      <section id="hero" className="relative min-h-screen overflow-hidden">
        <video
          className="absolute inset-0 h-full w-full object-cover"
          autoPlay
          muted
          loop
          playsInline
          poster="https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=2000&q=85"
        >
          <source src="https://videos.pexels.com/video-files/1779495/1779495-hd_1920_1080_25fps.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(21,16,10,0.24),rgba(246,237,223,0.2)_45%,rgba(246,237,223,0.98)_96%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,232,178,0.33),transparent_35%)]" />
        <Ornament className="absolute -left-10 top-20 h-56 w-56 text-[#f4d58f]/25 slow-spin" />
        <Ornament className="absolute -right-16 bottom-24 h-72 w-72 text-[#fff2c8]/25 slow-spin-reverse" />
        <div className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 py-28 text-center text-white">
          <p className="hero-kicker mb-7 text-xs uppercase tracking-[0.65em] text-[#ffe7a8]">Ilham Ilhami & Putri Aura</p>
          <h1 className="hero-title max-w-5xl font-serif text-6xl leading-[0.9] text-[#fff9ed] sm:text-8xl lg:text-9xl">Together Forever</h1>
          <p className="hero-subtitle mx-auto mt-8 max-w-2xl text-base leading-8 text-[#fff5e2] sm:text-lg">
            Dengan menyebut nama Allah, dua hati dipertemukan oleh takdir, memilih satu sama lain dengan ketulusan, dan memulai perjalanan penuh berkah menuju sakinah, mawaddah, dan rahmah.
          </p>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <a href="#event" className="gold-button">
              Detail Acara
            </a>
            <a href="#rsvp" className="cream-button">
              Kirim RSVP
            </a>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader
          eyebrow="Mempelai"
          title="Janji Yang Penuh Keanggunan"
          text="Dengan rasa syukur kepada Allah, kami memperkenalkan kedua mempelai yang cintanya tumbuh dalam ketulusan, doa, dan restu keluarga."
        />
        <div className="mx-auto grid max-w-6xl gap-8 md:grid-cols-2">
          {[
            { name: "Ilham Ilhami", role: "Mempelai Pria", img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=900&q=85" },
            { name: "Putri Aura", role: "Mempelai Wanita", img: "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=900&q=85" },
          ].map((person) => (
            <article key={person.name} className="reveal group relative overflow-hidden rounded-[2rem] border border-[#d7b46a]/35 bg-[#fff8ea]/55 p-4 shadow-[0_28px_90px_rgba(116,79,28,0.12)] backdrop-blur-xl">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(229,190,101,0.22),transparent_45%)] opacity-0 transition duration-500 group-hover:opacity-100" />
              <div className="relative aspect-[4/5] overflow-hidden rounded-[1.5rem]">
                <img src={person.img} alt={person.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#2f2418]/75 via-transparent to-transparent" />
                <Ornament className="absolute right-5 top-5 h-20 w-20 text-[#ffe9ad]/55" />
                <div className="absolute bottom-6 left-6 right-6 text-white">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f3d88d]">{person.role}</p>
                  <h3 className="mt-2 font-serif text-4xl">{person.name}</h3>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section id="event" className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Hari Pernikahan" title="Dengan Berkah Dan Bahagia" text="Merupakan kehormatan bagi kami apabila Anda berkenan hadir saat keluarga kami berkumpul untuk akad suci dan perayaan penuh syukur." />
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-3">
          {[
            { title: "Akad", date: "8 Juni 2026", time: "09.00 WIB - Selesai" },
            { title: "Resepsi", date: "10 Juni 2026", time: "09.00 WIB - Selesai" },
            { title: "Lokasi", date: "Balai Adat Koto Baru", time: "Jl. Raya Koto Baru No.62, Koto Baru, Kec. Sungai Pagu, Kabupaten Solok Selatan, Sumatera Barat 27776" },
          ].map((item) => (
            <article key={item.title} className="reveal glass-panel floating-card p-8">
              <p className="text-xs uppercase tracking-[0.38em] text-[#b9944c]">{item.title}</p>
              <h3 className="mt-5 font-serif text-4xl text-[#3d2d1c]">{item.date}</h3>
              <p className="mt-5 text-sm leading-7 text-[#76654f]">{item.time}</p>
            </article>
          ))}
        </div>
        <div className="reveal mt-10 text-center">
          <a
            href="https://www.google.com/maps/search/?api=1&query=Balai%20Adat%20Koto%20Baru%20Solok%20Selatan"
            target="_blank"
            rel="noreferrer"
            className="gold-button inline-flex"
          >
            Buka Google Maps
          </a>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Hitung Mundur" title="Menuju Ijab Qabul" text="Setiap detik membawa kami semakin dekat pada awal perjalanan yang suci." />
        <div className="reveal mx-auto grid max-w-5xl grid-cols-2 gap-4 rounded-[2.5rem] border border-[#d8b15f]/35 bg-[#fff7e8]/55 p-5 shadow-[0_30px_100px_rgba(116,79,28,0.14)] backdrop-blur-2xl sm:grid-cols-4 sm:p-8">
          {[
            [countdown.days, "Hari"],
            [countdown.hours, "Jam"],
            [countdown.minutes, "Menit"],
            [countdown.seconds, "Detik"],
          ].map(([value, label]) => (
            <div key={label} className="rounded-[1.5rem] border border-[#e4c987]/45 bg-white/35 px-5 py-8 text-center shadow-inner shadow-white/50">
              <strong className="font-serif text-5xl text-[#6d4c18] sm:text-6xl">{formatNumber(Number(value))}</strong>
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-[#9a7a3a]">{label}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Kisah Cinta" title="Ditulis Oleh Takdir" text="Linimasa sinematik dari sebuah pertemuan yang tumbuh menjadi doa, komitmen, dan perjalanan selamanya." />
        <div className="mx-auto max-w-4xl">
          {story.map((item, index) => (
            <article key={item.title} className="reveal timeline-item relative pb-12 pl-10 sm:pl-16">
              <span className="absolute left-0 top-1 h-5 w-5 rounded-full border border-[#d8b15f] bg-[#fff6e4] shadow-[0_0_35px_rgba(216,177,95,0.8)]" />
              <p className="text-xs uppercase tracking-[0.35em] text-[#b9944c]">{item.date}</p>
              <h3 className="mt-3 font-serif text-3xl text-[#3f2f1d]">0{index + 1}. {item.title}</h3>
              <p className="mt-4 text-sm leading-8 text-[#74634f]">{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Galeri" title="Bingkai Kelembutan" text="Kisah visual yang hangat dengan nuansa sinematik, transisi lembut, dan detail yang intim." />
        <div className="reveal mx-auto max-w-6xl">
          <button onClick={() => setActiveImage(galleryImages[slide])} className="group relative mb-6 aspect-[16/9] w-full overflow-hidden rounded-[2rem]" type="button">
            <img src={galleryImages[slide]} alt="Galeri pernikahan utama" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#2d2115]/55 to-transparent" />
            <span className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.35em] text-[#ffe8ab]">Lihat Penuh</span>
          </button>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
            {galleryImages.map((image, index) => (
              <button key={image} onClick={() => { setSlide(index); setActiveImage(image); }} className="group aspect-[4/5] overflow-hidden rounded-[1.5rem]" type="button">
                <img src={image} alt={`Galeri pernikahan ${index + 1}`} className="h-full w-full object-cover transition duration-500 group-hover:scale-110" />
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Film Prewedding" title="Bab Yang Sinematik" text="Tayangan lembut untuk mengenang momen sebelum janji suci terucap." />
        <div className="reveal mx-auto max-w-5xl rounded-[2rem] border border-[#d8b15f]/35 bg-[#fff8ea]/55 p-3 shadow-[0_30px_100px_rgba(116,79,28,0.16)] backdrop-blur-xl">
          <video className="aspect-video w-full rounded-[1.5rem] object-cover" controls poster="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?auto=format&fit=crop&w=1600&q=85">
            <source src="https://videos.pexels.com/video-files/1779495/1779495-hd_1920_1080_25fps.mp4" type="video/mp4" />
          </video>
        </div>
      </section>

      <section id="rsvp" className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="RSVP" title="Kirim Doa Dan Konfirmasi" text="Kehadiran dan doa Anda sangat berarti bagi kami dan keluarga." />
        <form onSubmit={submitRsvp} className="reveal mx-auto grid max-w-4xl gap-5 rounded-[2rem] border border-[#d8b15f]/30 bg-[#fff8ea]/70 p-6 shadow-[0_28px_90px_rgba(116,79,28,0.12)] backdrop-blur-xl sm:p-8">
          <input name="name" required placeholder="Nama tamu" className="form-field" />
          <select name="attendance" className="form-field" defaultValue="Hadir">
            <option>Hadir</option>
            <option>Tidak Dapat Hadir</option>
            <option>Masih Konfirmasi</option>
          </select>
          <textarea name="message" required rows={5} placeholder="Tulis doa atau pesan untuk kedua mempelai" className="form-field resize-none" />
          <button className="gold-button justify-self-start" type="submit">Kirim RSVP</button>
        </form>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Ucapan" title="Doa Dari Orang Terkasih" />
        <div className="mx-auto grid max-w-6xl gap-5 md:grid-cols-2">
          {wishes.map((wish, index) => (
            <article key={`${wish.name}-${index}`} className="reveal glass-panel p-7">
              <p className="text-xs uppercase tracking-[0.3em] text-[#b9944c]">{wish.attendance}</p>
              <h3 className="mt-3 font-serif text-3xl text-[#3f2f1d]">{wish.name}</h3>
              <p className="mt-4 text-sm leading-7 text-[#76654f]">{wish.message}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Hadiah Digital" title="Tanda Kasih Dan Doa" text="Bagi tamu yang ingin mengirimkan hadiah, kami menyediakan pilihan digital gift ini dengan penuh rasa terima kasih." />
        <div className="reveal mx-auto grid max-w-5xl gap-6 md:grid-cols-[1.2fr_0.8fr]">
          <div className="glass-panel p-8">
            <p className="text-xs uppercase tracking-[0.4em] text-[#b9944c]">Transfer Bank</p>
            <h3 className="mt-5 font-serif text-4xl text-[#3f2f1d]">Bank Syariah Indonesia</h3>
            <p className="mt-6 text-sm text-[#76654f]">Atas Nama: Ilham Ilhami</p>
            <p className="mt-3 font-serif text-3xl tracking-wide text-[#6d4c18]">8888 0608 2026</p>
            <button onClick={copyAccount} className="cream-button mt-7" type="button">{copied ? "Tersalin" : "Salin Nomor Rekening"}</button>
          </div>
          <div className="glass-panel grid place-items-center p-8 text-center">
            <div className="grid h-48 w-48 place-items-center rounded-2xl border border-[#d8b15f]/40 bg-white/55 p-5">
              <div className="h-full w-full rounded-xl bg-[linear-gradient(90deg,#4b351d_10%,transparent_10%_20%,#4b351d_20%_30%,transparent_30%_45%,#4b351d_45%_55%,transparent_55%_70%,#4b351d_70%_82%,transparent_82%),linear-gradient(#4b351d_10%,transparent_10%_20%,#4b351d_20%_30%,transparent_30%_45%,#4b351d_45%_55%,transparent_55%_70%,#4b351d_70%_82%,transparent_82%)] opacity-80" />
            </div>
            <p className="mt-5 text-xs uppercase tracking-[0.35em] text-[#b9944c]">Kode QR</p>
          </div>
        </div>
      </section>

      <section className="relative z-10 px-6 py-24 sm:py-32">
        <SectionHeader eyebrow="Siaran Langsung" title="Hadir Dari Mana Saja" text="Ruang siaran langsung privat akan tersedia untuk keluarga dan sahabat yang belum dapat hadir secara langsung." />
        <div className="reveal mx-auto max-w-4xl rounded-[2rem] border border-dashed border-[#d8b15f]/60 bg-[#fff8ea]/50 p-10 text-center backdrop-blur-xl">
          <p className="font-serif text-3xl text-[#3f2f1d]">Tautan Livestream Segera Hadir</p>
          <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-[#76654f]">Tautan akan dibagikan menjelang hari pernikahan dengan pengalaman menonton yang intim dan mudah diakses.</p>
        </div>
      </section>

      <section className="relative z-10 px-6 py-28 sm:py-36">
        <div className="reveal mx-auto max-w-5xl text-center">
          <p className="font-serif text-5xl text-[#b9944c] sm:text-7xl" lang="ar">بارك الله لكما وبارك عليكما وجمع بينكما في خير</p>
          <h2 className="mt-10 font-serif text-4xl text-[#3f2f1d] sm:text-6xl">Semoga Allah Memberkahi Pernikahan Ini</h2>
          <p className="mx-auto mt-6 max-w-2xl text-sm leading-8 text-[#74634f]">
            Semoga Allah menghadirkan barakah dalam pernikahan ini, menyatukan kedua hati dalam kebaikan, dan menjadikan rumah tangga ini penuh iman, kelembutan, dan rahmat sepanjang hayat.
          </p>
        </div>
      </section>

      <section className="relative z-10 px-6 py-28 text-center sm:py-36">
        <div className="absolute inset-x-0 top-0 mx-auto h-px max-w-5xl bg-gradient-to-r from-transparent via-[#d8b15f] to-transparent" />
        <p className="reveal text-xs uppercase tracking-[0.55em] text-[#b9944c]">Ilham & Aura</p>
        <h2 className="reveal mx-auto mt-6 max-w-4xl font-serif text-5xl leading-tight text-[#3f2f1d] sm:text-7xl">Sampai Bertemu Di Hari Bahagia Kami</h2>
        <a href="#rsvp" className="gold-button reveal mt-10 inline-flex">Konfirmasi Kehadiran</a>
      </section>

      <footer className="relative z-10 px-6 pb-12 text-center">
        <Ornament className="mx-auto mb-6 h-16 w-16 text-[#b9944c]/60" />
        <div className="mx-auto mb-6 h-px max-w-sm bg-gradient-to-r from-transparent via-[#d8b15f]/70 to-transparent" />
        <p className="font-serif text-2xl text-[#3f2f1d]">Together Forever</p>
        <p className="mt-2 text-xs uppercase tracking-[0.35em] text-[#9b855e]">Ilham Ilhami & Putri Aura</p>
      </footer>

      {activeImage ? (
        <button onClick={() => setActiveImage(null)} className="fixed inset-0 z-50 grid cursor-zoom-out place-items-center bg-[#120f0b]/90 p-5 backdrop-blur-md" type="button">
          <img src={activeImage} alt="Galeri pernikahan layar penuh" className="max-h-[88vh] w-auto max-w-full rounded-[1.5rem] object-contain shadow-2xl" />
        </button>
      ) : null}
    </main>
  );
}

export default App;