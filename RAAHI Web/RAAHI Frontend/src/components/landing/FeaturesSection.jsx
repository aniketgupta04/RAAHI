const cardClasses = [
  'md:col-span-2 md:row-span-2 bg-error-container',
  'md:col-span-2 bg-surface-container-low',
  'md:col-span-1 bg-surface-container-low',
  'md:col-span-1 bg-primary text-on-primary',
];

const FeaturesSection = ({ features }) => {
  return (
    <section id="features" className="bg-surface-container-lowest px-6 py-24 scroll-mt-24 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid h-auto grid-cols-1 gap-6 md:h-[600px] md:grid-cols-4 md:grid-rows-2">
          {features.map((feature, index) => (
            <article
              key={feature.title}
              className={`${cardClasses[index]} flex flex-col justify-between p-8 md:p-10`}
            >
              <div>
                <span
                  className={`material-symbols-outlined mb-6 ${
                    feature.inverse ? 'text-secondary-fixed' : feature.accentClass
                  } text-5xl`}
                >
                  {feature.icon}
                </span>
                <h3
                  className={`font-headline ${
                    index === 0 ? 'text-3xl' : 'text-xl lg:text-2xl'
                  } font-extrabold ${feature.inverse ? 'text-on-primary' : feature.titleClass}`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`mt-4 leading-7 ${
                    feature.inverse ? 'text-primary-fixed' : feature.descriptionClass
                  } ${index > 1 ? 'text-sm' : ''}`}
                >
                  {feature.description}
                </p>
              </div>
              {feature.footer && (
                <div
                  className={`mt-8 text-sm font-bold uppercase tracking-[0.24em] ${
                    feature.inverse ? 'text-secondary-fixed' : feature.footerClass
                  }`}
                >
                  {feature.footer}
                </div>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
