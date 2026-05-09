export function WhyBlock() {
  return (
    <section className="mx-auto max-w-3xl px-4 pb-24 pt-16 text-center sm:px-6 sm:pt-20 lg:px-8">
      <Stamp />
      <h2 className="mt-8 font-serif text-3xl text-heading sm:text-4xl">
        Why Toilet Atlas?
      </h2>
      <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-[#243447] sm:text-lg">
        Because the best stories are often found in the most unexpected places.
      </p>
    </section>
  );
}

function Stamp() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto grid h-20 w-20 place-items-center rounded-full border border-[#1e3a5f]/25 text-center font-serif text-[10px] uppercase leading-tight tracking-[0.18em] text-[#1e3a5f]/60"
    >
      <div>
        <div>Toilet</div>
        <div>Atlas</div>
        <div className="mt-1 text-[8px] tracking-[0.3em] text-[#1e3a5f]/40">
          ★ ★ ★
        </div>
      </div>
    </div>
  );
}
