import { useState } from "react";
import image1 from "../../../image/image1.png";
import image2 from "../../../image/image2.jpg";
import image3 from "../../../image/image3.png";

export const NewsLetterSection = () => {
  const [phone, setPhone] = useState("");

  const handlePhoneChange = (event: any) => {
    setPhone(event.target.value);
  };

  const handleSubmit = (event: any) => {
    event.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed with email:", phone);
    setPhone(""); //TODO Make Api call
  };
  return (
    <div className="bg-black py-10">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto text-center">
          <h3 className="text-xl mb-2">NEVER MISS A THING</h3>
          <h2 className="text-2xl font-bold mb-6">
            Share your contact number so we can reach out
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          >
            <input
              type="phone"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="Enter your Phone Number"
              className="flex-grow px-4 py-2 rounded-full text-black focus:outline-none focus:ring-2 focus:ring-modus-orange"
              required
            />
            <button
              type="submit"
              className="bg-modus-orange text-white px-4 py-2 rounded-full hover:bg-modus-orange-dark transition duration-300"
            >
              Subscribe
            </button>
          </form>
        </div>

        {/* Floating Images for Mobile */}
        <div className="flex flex-wrap justify-center gap-4 mt-10">
          <div className="w-20 h-20 rounded-full bg-modus-orange flex items-center justify-center">
            <div className="w-[78px] h-[78px] rounded-full bg-black flex items-center justify-center">
              <div className="w-[66px] h-[66px] rounded-full overflow-hidden">
                <img src={image1} alt="Person" className="w-full h-full" />
              </div>
            </div>
          </div>

          {/* Other simple circular avatars */}
          <div className="w-20 h-20 rounded-full bg-modus-orange flex items-center justify-center">
            <div className="w-[78px] h-[78px] rounded-full bg-black flex items-center justify-center">
              <div className="w-[66px] h-[66px] rounded-full overflow-hidden">
                <img src={image2} alt="Person" className="w-full h-full" />
              </div>
            </div>
          </div>

          <div className="w-20 h-20 rounded-full bg-modus-orange flex items-center justify-center">
            <div className="w-[78px] h-[78px] rounded-full bg-black flex items-center justify-center">
              <div className="w-[66px] h-[66px] rounded-full overflow-hidden">
                <img src={image3} alt="Person" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
