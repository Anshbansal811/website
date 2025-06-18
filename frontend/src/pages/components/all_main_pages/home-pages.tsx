import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import image1 from "../../../image/image1.png";
import image2 from "../../../image/image2.jpg";
import image3 from "../../../image/image3.png";
import api from "../../../utils/axios";
import { Product } from "../../../types/types";
import ProductCard from "../ProductCard";

const Homepage = () => {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("/products/allproduct");
        // Get random 10 products from the response
        const allProducts = response.data;
        const randomProducts = allProducts
          .sort(() => 0.5 - Math.random())
          .slice(0, 10);
        setLatestProducts(randomProducts);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen">
      <section className="bg-white py-12 md:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-10 text-center">
          <div className="relative flex flex-col lg:flex-row items-center gap-10">
            {/* First Image */}
            <div className="mt-10 lg:mt-0 lg:-ml-10">
              <div className="w-40 h-55 md:w-56 md:h-69 rounded-[50%] bg-modus-orange overflow-hidden mx-auto">
                <img
                  src={image1}
                  alt="Model wearing green sweater"
                  className="w-full h-full"
                  loading="lazy"
                  width={224}
                  height={276}
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
                to="/products"
                className="inline-block bg-modus-orange text-white px-6 py-3 rounded-full hover:bg-orange-600 transition"
              >
                Shop Now
              </Link>
            </div>

            {/* Second Image */}
            <div className="mt-8 lg:mt-0 lg:absolute lg:right-0 lg:bottom-0 lg:translate-y-20">
              <div className="w-40 h-55 sm:w-40 sm:h-55 md:w-56 md:h-69 rounded-[50%] bg-modus-orange overflow-hidden mx-auto lg:mx-0">
                <img
                  src={image2}
                  alt="Model wearing green sweater"
                  className="w-full h-full"
                  loading="lazy"
                  width={224}
                  height={276}
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Collection */}
      <section className="mt-10 py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className="text-3xl font-bold"
              style={{ fontFamily: "Algerian, serif" }}
            >
              Latest collection
              <br />
              <span className="text-dark">of modus {currentYear}</span>
            </h2>
          </div>

          <div className="flex justify-end mb-4">
            <Link
              to="/products"
              className="text-modus-orange hover:underline flex items-center"
            >
              More <span className="ml-2">→</span>
            </Link>
          </div>

          <div className="overflow-x-auto pb-4 -mx-4 px-4">
            <div className="flex gap-4 md:gap-6 min-w-max">
              {latestProducts.map((product) => (
                <div className="w-[280px] flex-shrink-0">
                  <ProductCard key={product._id} product={product} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Text Content */}
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-4xl font-bold mb-6 text-gray-900">
                Fashion is a trend of modern life
              </h2>
              <p className="text-gray-700 mb-6 text-lg">
                Fashion is a form of self-expression and autonomy at a
                particular period and place and in a specific context for
                clothing, lifestyle, accessories.
              </p>
              <Link
                to="/about"
                className="inline-block border border-gray-800 px-6 py-2 rounded-full text-gray-800 hover:bg-gray-800 hover:text-white transition"
              >
                Explore more
              </Link>
            </div>

            {/* Right Image + Yellow Background + Curved Text */}
            <div className="lg:w-1/2 relative flex justify-center items-center">
              <div className="relative w-[320px] h-[420px]">
                {/* Yellow organic background */}
                <div
                  className="w-full h-full bg-yellow-400 flex items-center justify-center overflow-hidden"
                  style={{
                    borderRadius: "60% 40% 30% 70% / 50% 30% 70% 50%",
                  }}
                >
                  <img
                    src={image1}
                    alt="Model"
                    className="w-[85%] h-auto"
                    loading="lazy"
                    width={272}
                    height={357}
                  />
                </div>

                {/* Curved SVG Text */}
                <svg
                  className="absolute top-0 left-0 w-[360px] h-[360px] -translate-x-4 -translate-y-4"
                  viewBox="0 0 300 300"
                >
                  <defs>
                    <path
                      id="textCircle"
                      d="M 150, 150 m -120, 0 a 120,120 0 1,1 240,0 a 120,120 0 1,1 -240,0"
                    />
                  </defs>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fashion Inside */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row-reverse items-center gap-12">
            <div className="lg:w-1/2 text-center lg:text-left">
              <h2 className="text-2xl md:text-4xl font-bold mb-6 text-dark">
                Fashion is always come from inside
              </h2>
              <p className="text-gray-600 mb-6">
                Clothing is something that comes from within you. The way you
                dress reflects your personality and your mood. We believe
                everyone has a unique sense of style that deserves to be
                expressed.
              </p>
              <Link to="/about" className="btn btn-primary">
                Find out more
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="w-[65vw] h-[85vw] sm:w-[35vw] sm:h-[40vw] md:w-[30vw] md:h-[35vw] lg:w-[25vw] lg:h-[30vw] rounded-full bg-modus-orange overflow-hidden mx-auto lg:mx-0">
                  <img
                    src={image3}
                    alt="Model in yellow outfit"
                    className="w-full h-full"
                    loading="lazy"
                    width={400}
                    height={480}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
