import { useState } from "react";
import Icon from "@/components/ui/icon";

type Page = "home" | "catalog" | "car" | "pricing";

interface Car {
  id: number;
  brand: string;
  model: string;
  year: number;
  price: number;
  type: "sedan" | "suv" | "sport" | "moto";
  img: string;
  fuel: string;
  power: number;
  drive: string;
  engine: string;
  acceleration: number;
  topSpeed: number;
  consumption: number;
  weight: number;
  length: number;
  isNew?: boolean;
  isPremium?: boolean;
  isSoviet?: boolean;
}

const CARS: Car[] = [
  {
    id: 1, brand: "BMW", model: "M5 Competition", year: 2024, price: 12800000,
    type: "sedan", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/ae23a62c-5819-4bd2-8b83-6e64b714f23e.jpg",
    fuel: "Бензин", power: 625, drive: "Полный", engine: "4.4л V8 Bi-Turbo",
    acceleration: 3.3, topSpeed: 305, consumption: 11.5, weight: 1940, length: 4962, isNew: true, isPremium: true,
  },
  {
    id: 2, brand: "Porsche", model: "Cayenne Turbo", year: 2024, price: 15200000,
    type: "suv", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/7caaf104-1de9-4f78-816e-810b22fec90e.jpg",
    fuel: "Бензин", power: 550, drive: "Полный", engine: "4.0л V8 Twin-Turbo",
    acceleration: 3.9, topSpeed: 286, consumption: 13.1, weight: 2210, length: 4918, isPremium: true,
  },
  {
    id: 3, brand: "Mercedes", model: "AMG GT 63", year: 2023, price: 18500000,
    type: "sport", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/e4f282fc-fc20-4edf-9126-ef3f7eed4d28.jpg",
    fuel: "Бензин", power: 639, drive: "Полный", engine: "4.0л V8 Bi-Turbo",
    acceleration: 3.2, topSpeed: 315, consumption: 12.8, weight: 1880, length: 5055, isPremium: true,
  },
  {
    id: 4, brand: "Ducati", model: "Panigale V4 S", year: 2024, price: 4200000,
    type: "moto", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/07463e89-ad3d-44bf-a1e8-4ce248c314f5.jpg",
    fuel: "Бензин", power: 214, drive: "Цепь", engine: "1103cc V4",
    acceleration: 2.8, topSpeed: 299, consumption: 6.8, weight: 198, length: 2100, isNew: true,
  },
  {
    id: 5, brand: "Audi", model: "RS7 Sportback", year: 2023, price: 11400000,
    type: "sedan", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/ae23a62c-5819-4bd2-8b83-6e64b714f23e.jpg",
    fuel: "Бензин", power: 600, drive: "Полный", engine: "4.0л V8 Bi-Turbo",
    acceleration: 3.6, topSpeed: 280, consumption: 11.0, weight: 2025, length: 5015,
  },
  {
    id: 6, brand: "Land Rover", model: "Defender 110", year: 2024, price: 9800000,
    type: "suv", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/7caaf104-1de9-4f78-816e-810b22fec90e.jpg",
    fuel: "Дизель", power: 300, drive: "Полный", engine: "3.0л I6 MHEV",
    acceleration: 6.1, topSpeed: 191, consumption: 9.5, weight: 2380, length: 5018, isNew: true,
  },
  {
    id: 7, brand: "Ferrari", model: "Roma", year: 2023, price: 25100000,
    type: "sport", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/e4f282fc-fc20-4edf-9126-ef3f7eed4d28.jpg",
    fuel: "Бензин", power: 620, drive: "Задний", engine: "3.9л V8 Twin-Turbo",
    acceleration: 3.4, topSpeed: 320, consumption: 13.4, weight: 1570, length: 4656, isPremium: true,
  },
  {
    id: 8, brand: "BMW", model: "M 1000 RR", year: 2024, price: 3800000,
    type: "moto", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/07463e89-ad3d-44bf-a1e8-4ce248c314f5.jpg",
    fuel: "Бензин", power: 212, drive: "Цепь", engine: "999cc Inline-4",
    acceleration: 3.1, topSpeed: 306, consumption: 6.5, weight: 193, length: 2090, isPremium: true,
  },
  {
    id: 9, brand: "Урал", model: "М-72 с коляской", year: 1956, price: 320000, isSoviet: true,
    type: "moto", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/85fc6d75-8f6e-4cad-9746-3dec2d5a6a1e.jpg",
    fuel: "Бензин", power: 22, drive: "Цепь", engine: "750cc OHV Boxer",
    acceleration: 18.0, topSpeed: 95, consumption: 7.5, weight: 380, length: 2420, isNew: false,
  },
  {
    id: 10, brand: "Днепр", model: "К-750", year: 1967, price: 185000, isSoviet: true,
    type: "moto", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/b233551b-7723-45c2-8d0e-5d24a5c13389.jpg",
    fuel: "Бензин", power: 26, drive: "Цепь", engine: "750cc Boxer",
    acceleration: 16.5, topSpeed: 105, consumption: 6.8, weight: 215, length: 2200, isNew: false,
  },
  {
    id: 11, brand: "Минск", model: "М-105", year: 1978, price: 95000, isSoviet: true,
    type: "moto", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/a029d840-109b-4e9f-8ec7-e154e76d69a7.jpg",
    fuel: "Бензин", power: 9, drive: "Цепь", engine: "125cc 2T",
    acceleration: 22.0, topSpeed: 80, consumption: 3.5, weight: 95, length: 1900, isNew: false,
  },
  {
    id: 12, brand: "ИЖ", model: "Юпитер-5", year: 1985, price: 120000, isSoviet: true,
    type: "moto", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/a029d840-109b-4e9f-8ec7-e154e76d69a7.jpg",
    fuel: "Бензин", power: 18, drive: "Цепь", engine: "350cc 2T",
    acceleration: 14.0, topSpeed: 120, consumption: 5.2, weight: 155, length: 2085, isNew: false,
  },
  {
    id: 13, brand: "Восход", model: "3М", year: 1982, price: 75000, isSoviet: true,
    type: "moto", img: "https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/b233551b-7723-45c2-8d0e-5d24a5c13389.jpg",
    fuel: "Бензин", power: 14, drive: "Цепь", engine: "175cc 2T",
    acceleration: 20.0, topSpeed: 95, consumption: 4.0, weight: 112, length: 1980, isNew: false,
  },
];

const TYPE_LABELS: Record<string, string> = {
  sedan: "Седан", suv: "Внедорожник", sport: "Спорткар", moto: "Мотоцикл"
};
const TYPES = ["all", "sedan", "suv", "sport", "moto"] as const;

function formatPrice(p: number) {
  return p >= 1000000
    ? `${(p / 1000000).toFixed(1).replace(".0", "")} млн ₽`
    : `${(p / 1000).toFixed(0)} тыс ₽`;
}

function CarCard({ car, index, onOpen, isPro }: { car: Car; index: number; onOpen: (c: Car) => void; isPro: boolean }) {
  return (
    <div
      className="bg-white border border-[#e8e8e8] rounded-sm overflow-hidden card-hover cursor-pointer fade-in group"
      style={{ animationDelay: `${index * 50}ms` }}
      onClick={() => onOpen(car)}
    >
      <div className="relative bg-[#f5f5f5] overflow-hidden" style={{ aspectRatio: "4/3" }}>
        <img
          src={car.img} alt={`${car.brand} ${car.model}`}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          {car.isNew && (
            <span className="bg-[#111] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
              New
            </span>
          )}
          {car.isPremium && (
            <span className="bg-[#c9a96e] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
              Premium
            </span>
          )}
          {car.isSoviet && (
            <span className="bg-[#c0392b] text-white text-[10px] font-bold tracking-widest uppercase px-2 py-0.5 rounded-sm">
              СССР
            </span>
          )}
        </div>
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm">
          <span className="text-[11px] font-semibold text-[#111]">{TYPE_LABELS[car.type]}</span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-3">
          <p className="text-[#bbb] text-xs mb-0.5">{car.year}</p>
          <h3 className="font-playfair text-lg font-semibold text-[#111] leading-tight">
            {car.brand} {car.model}
          </h3>
          <p className="text-[#111] font-semibold text-sm mt-1">{formatPrice(car.price)}</p>
        </div>

        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-[#f0f0f0]">
          <div className="text-center">
            <p className="text-[#111] font-semibold text-sm">{car.power}</p>
            <p className="text-[#ccc] text-[10px]">л.с.</p>
          </div>
          <div className="text-center border-x border-[#f0f0f0]">
            <p className="text-[#111] font-semibold text-sm">{car.acceleration}с</p>
            <p className="text-[#ccc] text-[10px]">до 100</p>
          </div>
          <div className="text-center">
            <p className={`font-semibold text-sm ${!isPro ? "blur-[3px] select-none text-[#ccc]" : "text-[#111]"}`}>
              {car.topSpeed}
            </p>
            <p className="text-[#ccc] text-[10px]">макс. км/ч</p>
          </div>
        </div>

        {!isPro && (
          <div className="mt-2.5 flex items-center gap-1.5 text-[#c9a96e]">
            <Icon name="Lock" size={11} />
            <span className="text-[10px] font-medium">Полные данные по подписке</span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Index() {
  const [page, setPage] = useState<Page>("home");
  const [selectedCar, setSelectedCar] = useState<Car | null>(null);
  const [filter, setFilter] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"price_asc" | "price_desc" | "power">("price_asc");
  const [isPro, setIsPro] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const filtered = CARS
    .filter(c => filter === "all" || c.type === filter)
    .sort((a, b) => {
      if (sortBy === "price_asc") return a.price - b.price;
      if (sortBy === "price_desc") return b.price - a.price;
      return b.power - a.power;
    });

  const openCar = (car: Car) => { setSelectedCar(car); setPage("car"); };
  const nav = (p: Page) => { setPage(p); setMenuOpen(false); window.scrollTo(0, 0); };

  return (
    <div className="min-h-screen bg-[#fafafa] font-inter text-[#111]">

      {/* ─── HEADER ─── */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-sm border-b border-[#ebebeb]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <button onClick={() => nav("home")} className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 bg-[#111] flex items-center justify-center rounded-sm">
              <span className="text-white text-[10px] font-bold tracking-wide">AC</span>
            </div>
            <span className="font-playfair text-[1.1rem] font-semibold text-[#111] tracking-tight">AutoCraft</span>
          </button>

          <nav className="hidden md:flex items-center gap-8">
            {([
              ["Главная", "home"],
              ["Каталог", "catalog"],
              ["Подписка", "pricing"],
            ] as [string, Page][]).map(([label, p]) => (
              <button
                key={p} onClick={() => nav(p)}
                className={`text-sm font-medium transition-colors ${page === p ? "text-[#111]" : "text-[#999] hover:text-[#333]"}`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            {isPro && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-[#c9a96e] text-xs font-semibold bg-[#c9a96e]/10 border border-[#c9a96e]/25 px-2.5 py-1 rounded-full">
                <Icon name="Crown" size={11} /> PRO
              </span>
            )}
            <button
              onClick={() => nav("pricing")}
              className={`hidden sm:block text-sm px-4 py-2 rounded-sm font-medium transition-all ${
                isPro
                  ? "bg-[#f0f0f0] text-[#555] hover:bg-[#e8e8e8]"
                  : "bg-[#111] text-white hover:bg-[#333]"
              }`}
            >
              {isPro ? "Мой план" : "Получить доступ"}
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1.5 text-[#555]">
              <Icon name={menuOpen ? "X" : "Menu"} size={20} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className="md:hidden bg-white border-t border-[#ebebeb] px-5 py-3 space-y-0">
            {([["Главная", "home"], ["Каталог", "catalog"], ["Подписка", "pricing"]] as [string, Page][]).map(([label, p]) => (
              <button
                key={p} onClick={() => nav(p)}
                className="w-full text-left py-3 text-sm font-medium text-[#444] border-b border-[#f5f5f5] last:border-0"
              >
                {label}
              </button>
            ))}
          </div>
        )}
      </header>

      <div className="pt-16">

        {/* ─── HOME ─── */}
        {page === "home" && (
          <>
            {/* Hero */}
            <section className="relative bg-[#0f0f0f] min-h-[88vh] flex items-center overflow-hidden">
              <div className="absolute inset-0">
                <img
                  src="https://cdn.poehali.dev/projects/acb3b6a8-4bcb-445d-888f-d91385131155/files/e4f282fc-fc20-4edf-9126-ef3f7eed4d28.jpg"
                  alt="" className="w-full h-full object-cover opacity-25"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-[#0f0f0f]/85 to-[#0f0f0f]/30" />
              </div>
              <div className="relative max-w-7xl mx-auto px-4 sm:px-6 py-24">
                <div className="max-w-lg">
                  <p className="text-[#c9a96e] text-xs font-semibold tracking-[0.25em] uppercase mb-5 fade-in">
                    Премиальный каталог
                  </p>
                  <h1 className="font-playfair text-5xl sm:text-6xl lg:text-[4.5rem] font-semibold text-white leading-[1.06] mb-6 fade-in-delay-1">
                    Найдите<br />своё авто
                  </h1>
                  <p className="text-white/55 text-lg leading-relaxed mb-10 fade-in-delay-2">
                    Подробные характеристики, сравнения и данные на сотни автомобилей и мотоциклов.
                  </p>
                  <div className="flex flex-wrap gap-3 fade-in-delay-3">
                    <button onClick={() => nav("catalog")} className="btn-gold px-7 py-3.5 rounded-sm text-sm">
                      Открыть каталог
                    </button>
                    <button
                      onClick={() => nav("pricing")}
                      className="px-7 py-3.5 rounded-sm text-sm font-medium text-white border border-white/25 hover:border-white/50 transition-all"
                    >
                      Тарифы
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Stats */}
            <section className="bg-white border-b border-[#ebebeb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 grid grid-cols-2 md:grid-cols-4 gap-6">
                {[
                  { val: "500+", label: "Автомобилей" },
                  { val: "80+", label: "Мотоциклов" },
                  { val: "50+", label: "Характеристик" },
                  { val: "12K+", label: "Подписчиков" },
                ].map((s, i) => (
                  <div key={i} className="text-center py-4">
                    <p className="font-playfair text-3xl sm:text-4xl font-semibold text-[#111] mb-1">{s.val}</p>
                    <p className="text-[#999] text-sm">{s.label}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* Featured */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="block w-10 h-0.5 bg-[#c9a96e] mb-4" />
                  <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#111]">Избранное</h2>
                </div>
                <button onClick={() => nav("catalog")} className="text-sm text-[#999] hover:text-[#111] transition-colors flex items-center gap-1.5">
                  Весь каталог <Icon name="ArrowRight" size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CARS.filter(c => c.isPremium).slice(0, 3).map((car, i) => (
                  <CarCard key={car.id} car={car} index={i} onOpen={openCar} isPro={isPro} />
                ))}
              </div>
            </section>

            {/* Moto section */}
            <section className="bg-white border-y border-[#ebebeb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
                <div className="flex items-end justify-between mb-10">
                  <div>
                    <span className="block w-10 h-0.5 bg-[#c9a96e] mb-4" />
                    <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#111]">Мотоциклы</h2>
                  </div>
                  <button onClick={() => { setFilter("moto"); nav("catalog"); }} className="text-sm text-[#999] hover:text-[#111] transition-colors flex items-center gap-1.5">
                    Все мото <Icon name="ArrowRight" size={14} />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {CARS.filter(c => c.type === "moto" && !c.isSoviet).map((car, i) => (
                    <CarCard key={car.id} car={car} index={i} onOpen={openCar} isPro={isPro} />
                  ))}
                </div>
              </div>
            </section>

            {/* Soviet moto */}
            <section className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
              <div className="flex items-end justify-between mb-10">
                <div>
                  <span className="block w-10 h-0.5 bg-[#c0392b] mb-4" />
                  <p className="text-[#c0392b] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Ретро / Советская классика</p>
                  <h2 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#111]">Мотоциклы СССР</h2>
                </div>
                <button onClick={() => { setFilter("moto"); nav("catalog"); }} className="text-sm text-[#999] hover:text-[#111] transition-colors flex items-center gap-1.5">
                  Все мото <Icon name="ArrowRight" size={14} />
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {CARS.filter(c => c.isSoviet).map((car, i) => (
                  <CarCard key={car.id} car={car} index={i} onOpen={openCar} isPro={isPro} />
                ))}
              </div>
            </section>

            {/* CTA */}
            <section className="bg-[#111] text-white">
              <div className="max-w-3xl mx-auto px-4 sm:px-6 py-24 text-center">
                <span className="block w-10 h-0.5 bg-[#c9a96e] mx-auto mb-6" />
                <h2 className="font-playfair text-3xl sm:text-4xl font-semibold mb-4">
                  Полный доступ к каталогу
                </h2>
                <p className="text-white/45 text-base max-w-sm mx-auto mb-8 leading-relaxed">
                  Все характеристики, сравнения и фильтры без ограничений — от 990 ₽/мес
                </p>
                <button onClick={() => nav("pricing")} className="btn-gold px-8 py-3.5 rounded-sm text-sm">
                  Выбрать тариф
                </button>
              </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-[#ebebeb]">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 bg-[#111] flex items-center justify-center rounded-sm">
                    <span className="text-white text-[9px] font-bold">AC</span>
                  </div>
                  <span className="font-playfair text-sm font-semibold">AutoCraft</span>
                </div>
                <p className="text-[#ccc] text-xs">© 2024 AutoCraft. Все права защищены.</p>
              </div>
            </footer>
          </>
        )}

        {/* ─── CATALOG ─── */}
        {page === "catalog" && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10">
            <div className="mb-8">
              <p className="text-[#c9a96e] text-xs font-semibold tracking-[0.2em] uppercase mb-2">Каталог</p>
              <h1 className="font-playfair text-3xl sm:text-4xl font-semibold text-[#111]">
                Все автомобили и мотоциклы
              </h1>
              <p className="text-[#999] text-sm mt-1">{CARS.length} позиций в базе</p>
            </div>

            {/* Filters bar */}
            <div className="bg-white border border-[#ebebeb] rounded-sm p-4 mb-6 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <div className="flex flex-wrap gap-2">
                {TYPES.map(t => (
                  <button
                    key={t} onClick={() => setFilter(t)}
                    className={`px-3.5 py-1.5 text-xs font-semibold rounded-sm transition-all ${
                      filter === t ? "bg-[#111] text-white" : "bg-[#f5f5f5] text-[#777] hover:bg-[#eee] hover:text-[#333]"
                    }`}
                  >
                    {t === "all" ? "Все" : TYPE_LABELS[t]}
                  </button>
                ))}
              </div>
              <div className="flex items-center gap-2 flex-shrink-0">
                <span className="text-xs text-[#bbb]">Сортировка:</span>
                <select
                  value={sortBy}
                  onChange={e => setSortBy(e.target.value as typeof sortBy)}
                  className="text-xs border border-[#e8e8e8] rounded-sm px-3 py-1.5 bg-white text-[#444] outline-none cursor-pointer"
                >
                  <option value="price_asc">Цена ↑</option>
                  <option value="price_desc">Цена ↓</option>
                  <option value="power">Мощность</option>
                </select>
              </div>
            </div>

            {!isPro && (
              <div className="mb-6 bg-amber-50 border border-amber-200 rounded-sm p-4 flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-start gap-3 flex-1">
                  <Icon name="Lock" size={15} className="text-[#c9a96e] flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-[#666]">
                    <span className="font-semibold text-[#333]">Бесплатный план: </span>
                    показаны только базовые параметры. Подпишитесь для доступа ко всем характеристикам.
                  </p>
                </div>
                <button onClick={() => nav("pricing")} className="btn-gold px-4 py-2 rounded-sm text-xs whitespace-nowrap flex-shrink-0">
                  Открыть доступ
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              {filtered.map((car, i) => (
                <CarCard key={car.id} car={car} index={i} onOpen={openCar} isPro={isPro} />
              ))}
            </div>
          </div>
        )}

        {/* ─── CAR DETAIL ─── */}
        {page === "car" && selectedCar && (
          <div className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
            <button
              onClick={() => setPage("catalog")}
              className="flex items-center gap-2 text-sm text-[#999] hover:text-[#111] transition-colors mb-8"
            >
              <Icon name="ArrowLeft" size={14} /> Назад в каталог
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
              {/* Image */}
              <div>
                <div className="bg-[#f5f5f5] rounded-sm overflow-hidden relative" style={{ aspectRatio: "4/3" }}>
                  <img src={selectedCar.img} alt={`${selectedCar.brand} ${selectedCar.model}`} className="w-full h-full object-cover" />
                  <div className="absolute top-4 left-4 flex gap-2">
                    {selectedCar.isNew && (
                      <span className="bg-[#111] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">New</span>
                    )}
                    {selectedCar.isPremium && (
                      <span className="bg-[#c9a96e] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">Premium</span>
                    )}
                    {selectedCar.isSoviet && (
                      <span className="bg-[#c0392b] text-white text-[10px] font-bold tracking-widest uppercase px-2.5 py-1 rounded-sm">СССР</span>
                    )}
                  </div>
                </div>
                {/* Quick specs below image */}
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {[
                    { icon: "Zap", label: "Мощность", val: `${selectedCar.power} л.с.` },
                    { icon: "Timer", label: "До 100 км/ч", val: `${selectedCar.acceleration} с` },
                    { icon: "Fuel", label: "Топливо", val: selectedCar.fuel },
                  ].map(s => (
                    <div key={s.label} className="bg-white border border-[#ebebeb] rounded-sm p-3 text-center">
                      <Icon name={s.icon} size={16} className="text-[#ccc] mx-auto mb-1.5" />
                      <p className="text-[#111] font-semibold text-sm">{s.val}</p>
                      <p className="text-[#bbb] text-[10px] mt-0.5">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Info */}
              <div>
                <div className="mb-7">
                  <p className="text-[#c9a96e] text-xs font-semibold tracking-[0.2em] uppercase mb-2">
                    {TYPE_LABELS[selectedCar.type]} · {selectedCar.year}
                  </p>
                  <h1 className="font-playfair text-4xl sm:text-5xl font-semibold text-[#111] leading-tight mb-3">
                    {selectedCar.brand}<br />{selectedCar.model}
                  </h1>
                  <p className="font-playfair text-2xl text-[#111]">{formatPrice(selectedCar.price)}</p>
                </div>

                {/* Full specs table */}
                <div className="border border-[#ebebeb] rounded-sm overflow-hidden mb-6">
                  <div className="bg-[#f8f8f8] border-b border-[#ebebeb] px-4 py-2.5 flex items-center justify-between">
                    <span className="text-xs font-semibold text-[#555] tracking-wider uppercase">Технические характеристики</span>
                    {!isPro && (
                      <span className="flex items-center gap-1 text-[#c9a96e] text-xs font-medium">
                        <Icon name="Lock" size={12} /> PRO
                      </span>
                    )}
                  </div>
                  <div className={`divide-y divide-[#f5f5f5] ${!isPro ? "select-none" : ""}`}>
                    {[
                      { label: "Двигатель", val: selectedCar.engine, locked: false },
                      { label: "Привод", val: selectedCar.drive, locked: false },
                      { label: "Макс. скорость", val: `${selectedCar.topSpeed} км/ч`, locked: true },
                      { label: "Расход топлива", val: `${selectedCar.consumption} л/100км`, locked: true },
                      { label: "Снаряжённая масса", val: `${selectedCar.weight} кг`, locked: true },
                      { label: "Длина кузова", val: `${selectedCar.length} мм`, locked: true },
                    ].map(row => (
                      <div key={row.label} className="flex items-center justify-between px-4 py-3">
                        <span className="text-sm text-[#888]">{row.label}</span>
                        <span className={`text-sm font-medium ${row.locked && !isPro ? "blur-[5px] text-[#ccc] select-none" : "text-[#111]"}`}>
                          {row.val}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Lock block */}
                {!isPro ? (
                  <div className="bg-[#111] text-white rounded-sm p-6">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-8 h-8 bg-[#c9a96e]/20 rounded-full flex items-center justify-center flex-shrink-0">
                        <Icon name="Lock" size={15} className="text-[#c9a96e]" />
                      </div>
                      <p className="font-semibold text-sm">Часть данных скрыта</p>
                    </div>
                    <p className="text-white/45 text-sm mb-5 leading-relaxed">
                      Подпишитесь на PRO, чтобы видеть полные характеристики: максимальную скорость, расход, массу, размеры и другие данные.
                    </p>
                    <button onClick={() => nav("pricing")} className="btn-gold px-5 py-2.5 rounded-sm w-full text-sm">
                      Выбрать тариф — от 990 ₽/мес
                    </button>
                  </div>
                ) : (
                  <button className="w-full bg-[#111] text-white py-3 rounded-sm text-sm font-medium hover:bg-[#333] transition-colors">
                    Добавить в сравнение
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ─── PRICING ─── */}
        {page === "pricing" && (
          <div className="max-w-5xl mx-auto px-4 sm:px-6 py-16">
            <div className="text-center mb-14">
              <span className="block w-10 h-0.5 bg-[#c9a96e] mx-auto mb-5" />
              <h1 className="font-playfair text-4xl sm:text-5xl font-semibold text-[#111] mb-4">
                Выберите план
              </h1>
              <p className="text-[#999] text-base max-w-sm mx-auto leading-relaxed">
                Начните бесплатно или получите полный доступ к каталогу с подпиской PRO
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-16">
              {/* Free */}
              <div className="bg-white border border-[#ebebeb] rounded-sm p-8">
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#bbb] mb-3">Бесплатно</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-playfair text-4xl font-semibold text-[#111]">0 ₽</span>
                    <span className="text-[#bbb] text-sm">/мес</span>
                  </div>
                  <p className="text-[#999] text-sm">Для знакомства с каталогом</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    [true, "Просмотр всех карточек"],
                    [true, "Базовые параметры (мощность, разгон)"],
                    [false, "Полные технические характеристики"],
                    [false, "Сравнение автомобилей"],
                    [false, "Расширенные фильтры"],
                    [false, "Данные по расходу и массе"],
                  ].map(([ok, text], i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Icon name={ok ? "Check" : "X"} size={14} className={ok ? "text-green-500 flex-shrink-0" : "text-[#ddd] flex-shrink-0"} />
                      <span className={ok ? "text-[#444]" : "text-[#ccc]"}>{text as string}</span>
                    </li>
                  ))}
                </ul>
                <button
                  disabled
                  className="w-full py-3 rounded-sm text-sm font-medium bg-[#f5f5f5] text-[#aaa] cursor-default border border-[#ebebeb]"
                >
                  {isPro ? "Переключиться" : "Текущий план"}
                </button>
              </div>

              {/* PRO */}
              <div className="bg-[#111] text-white rounded-sm p-8 relative overflow-hidden">
                <div className="absolute top-0 right-0">
                  <div className="bg-[#c9a96e] text-white text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-1.5">
                    Популярный
                  </div>
                </div>
                <div className="mb-6">
                  <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#c9a96e] mb-3">PRO</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="font-playfair text-4xl font-semibold text-white">990 ₽</span>
                    <span className="text-white/35 text-sm">/мес</span>
                  </div>
                  <p className="text-white/45 text-sm">Полный доступ без ограничений</p>
                </div>
                <ul className="space-y-3 mb-8">
                  {[
                    "Всё из бесплатного плана",
                    "Полные технические характеристики",
                    "Сравнение до 4 автомобилей",
                    "Расширенные фильтры и сортировка",
                    "Данные по расходу, массе, размерам",
                    "Приоритетное обновление каталога",
                  ].map((text, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm">
                      <Icon name="Check" size={14} className="text-[#c9a96e] flex-shrink-0" />
                      <span className="text-white/75">{text}</span>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => { setIsPro(true); nav("catalog"); }}
                  className={`w-full py-3 rounded-sm text-sm font-semibold transition-all ${
                    isPro
                      ? "bg-white/10 text-white/50 cursor-default"
                      : "bg-[#c9a96e] text-white hover:bg-[#b8944f]"
                  }`}
                >
                  {isPro ? "✓ Активен" : "Подключить PRO"}
                </button>
              </div>
            </div>

            {/* FAQ */}
            <div className="max-w-2xl mx-auto">
              <h3 className="font-playfair text-2xl font-semibold text-[#111] text-center mb-8">Частые вопросы</h3>
              <div className="space-y-4">
                {[
                  { q: "Можно ли отменить подписку?", a: "Да, в любой момент в личном кабинете. Доступ сохраняется до конца оплаченного периода." },
                  { q: "Как часто обновляется каталог?", a: "Новые модели добавляются еженедельно. PRO-подписчики получают уведомления о новинках первыми." },
                  { q: "Есть ли пробный период?", a: "Базовый доступ всегда бесплатен. При первой подписке PRO — 7 дней бесплатно." },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-[#ebebeb] rounded-sm p-5">
                    <p className="font-semibold text-sm text-[#111] mb-2">{item.q}</p>
                    <p className="text-sm text-[#888] leading-relaxed">{item.a}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}