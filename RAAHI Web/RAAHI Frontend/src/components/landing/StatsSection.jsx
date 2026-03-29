const StatsSection = ({ stats }) => {
  return (
    <section className="border-y border-outline-variant/10 bg-surface-container-lowest px-6 py-16 sm:px-8">
      <div className="mx-auto grid max-w-7xl gap-12 text-center md:grid-cols-3">
        {stats.map((stat) => (
          <article key={stat.label}>
            <div className={`text-5xl font-extrabold ${stat.valueClass}`}>{stat.value}</div>
            <div className="mt-2 text-sm font-bold uppercase tracking-[0.28em] text-outline">
              {stat.label}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
};

export default StatsSection;
