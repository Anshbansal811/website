import { Link } from "react-router-dom";

export const Homepages = () => {
  return (
    <div className="min-h-screen">
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="relative flex flex-col lg:flex-row items-center gap-10">
            {/* First Image */}
            <div className="mt-10 lg:mt-0 lg:-ml-10">
              <div className="w-40 h-55 md:w-56 md:h-69 rounded-[50%] bg-modus-orange overflow-hidden mx-auto">
                <img
                  src="src/image/image1.png"
                  alt="Model wearing green sweater"
                  className="w-full h-full"
                />
              </div>
            </div>

            <div className="lg:w-1/2 text-center lg:text-left w-full">
              <span className="text-lg font-bold text-black mb-3 block">
                Find your personal style with us
              </span>
              <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
                <span className="text-dark">Fashion is your </span>
                <span className="text-modus-orange">own priority</span>
              </h1>
              <p className="text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 px-4 sm:px-0">
                Discover the latest trends and express yourself through fashion
                that speaks to who you are.
              </p>
              {/* Optional CTA */}
              <Link
                to="/shop"
                className="inline-block bg-modus-orange text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
              >
                Explore Collection
              </Link>
            </div>

            {/* Second Image */}
            <div className="mt-8 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 lg:translate-y-20">
              <div className="w-40 h-55 sm:w-40 sm:h-55 md:w-56 md:h-56 rounded-[50%] bg-modus-orange overflow-hidden mx-auto lg:mx-0">
                <img
                  src="src/image/image2.jpg"
                  alt="Model wearing green sweater"
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
