import { useEffect, useState } from "react";

export const Contactpage = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: "",
    phonenumber: "",
    subject: "",
    message: "",
    state: "",
    city: "",
    company: "",
    gst_pan: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

  const handleChange = (e: React.ChangeEvent<Element>) => {
    const { name, value } = e.target as HTMLInputElement;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
    // Clear error when user starts typing
    setError(null);
  };

  const validateForm = () => {
    const requiredFields = [
      "name",
      "phonenumber",
      "subject",
      "message",
      "state",
      "city",
      "company",
    ];
    const missingFields = requiredFields.filter(
      (field) => !formData[field as keyof typeof formData]
    );

    if (missingFields.length > 0) {
      setError(
        `Please fill in all required fields: ${missingFields.join(", ")}`
      );
      return false;
    }

    const phoneRegex = /^[0-9]{10,15}$/;
    if (!phoneRegex.test(formData.phonenumber)) {
      setError("Please enter a valid phone number (10-15 digits)");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      console.log("Submitting to:", `${API_URL}/api/contact/submit`);
      const response = await fetch(`${API_URL}/api/contact/submit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      const data = await response.json();
      console.log("Response:", data);

      if (response.ok) {
        setFormSubmitted(true);
        setFormData({
          name: "",
          phonenumber: "",
          subject: "",
          message: "",
          state: "",
          city: "",
          company: "",
          gst_pan: "",
        });
      } else {
        setError(data.message || "Error submitting form. Please try again.");
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error instanceof TypeError && error.message === "Failed to fetch") {
        setError("");
      } else {
        setError("Network error. Please try again later.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="py-20 px-4 sm:px-6 lg:px-8 relative">
        {/* Wavy SVG Background */}
        <svg
          className="absolute top-0 left-0 w-full h-full"
          viewBox="0 0 1240 200"
          fill="none"
          style={{ zIndex: 0 }}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient
              id="gradient"
              x1="0"
              y1="0"
              x2="1240"
              y2="200"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#F8B4B4" />
              <stop offset="1" stopColor="#FDE68A" />
            </linearGradient>
          </defs>
          <path
            d="M0,100 C800,300 900,0 1240,200 L1240,0 L0,0 Z"
            fill="url(#gradient)"
            opacity="0.7"
          />
        </svg>
        <div className="relative container mx-auto px-4 text-center z-10">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have feedback or questions? Reach out — we'd love to hear from you!
          </p>
        </div>
      </div>
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Form */}
            <div className="lg:w-2/3">
              <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>

              {formSubmitted ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
                  <p>
                    Thank you for your message! We'll get back to you as soon as
                    possible.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
                      <p>{error}</p>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-gray-700 mb-2"
                      >
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="Company Name"
                        className="block text-gray-700 mb-2"
                      >
                        Company Name
                      </label>
                      <input
                        type="text"
                        id="company"
                        name="company"
                        value={formData.company}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="phone number"
                        className="block text-gray-700 mb-2"
                      >
                        Phone Number
                      </label>
                      <input
                        type="number"
                        id="phonenumber"
                        name="phonenumber"
                        value={formData.phonenumber}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="State"
                        className="block text-gray-700 mb-2"
                      >
                        State
                      </label>
                      <input
                        type="text"
                        id="state"
                        name="state"
                        value={formData.state}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="City"
                        className="block text-gray-700 mb-2"
                      >
                        City
                      </label>
                      <input
                        type="text"
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="GST" className="block text-gray-700 mb-2">
                        GST Number/ PAN Number
                      </label>
                      <input
                        type="text"
                        id="gst"
                        name="gst_pan"
                        value={formData.gst_pan}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-gray-700 mb-2"
                    >
                      Subject
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                      required
                    >
                      <option value="">Select a topic</option>
                      <option value="Customer Support">Customer Support</option>
                      <option value="Product Inquiry">Product Inquiry</option>
                      <option value="Feedback">Feedback</option>
                      <option value="Partnerships">Partnerships</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-gray-700 mb-2"
                    >
                      Your Message
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      value={formData.message}
                      onChange={handleChange}
                      rows={5}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-modus-orange"
                      required
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary py-3 px-8"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Sending..." : "Send Message"}
                  </button>
                </form>
              )}
            </div>

            {/* Contact Info */}
            <div className="lg:w-1/3">
              <h2 className="text-2xl font-bold mb-6">Contact Information</h2>
              <div className="space-y-4">
                <div>
                  {/* <h3 className="text-lg font-semibold mb-2">Address 1</h3>
                  <p className="text-gray-600">
                    39/225 Karwan Gali Lohamanid
                    <br />
                    Agra, Uttar Pradesh 282002
                    <br />
                    India
                  </p> */}
                  <h3 className="text-lg font-semibold mb-2">Address</h3>
                  <p className="text-gray-600">
                    MIG-254 B-block Shastripuram
                    <br />
                    Agra, Uttar Pradesh 282007
                    <br />
                    India
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Email Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="mailto:anshbansal811@gmail.com"
                      className="text-modus-orange hover:underline"
                    >
                      anshbansal811@gmail.com
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Call Us</h3>
                  <p className="text-gray-600">
                    <a
                      href="tel:+919359924498"
                      className="text-modus-orange hover:underline"
                    >
                      +919359924498
                    </a>
                    <p className="text-gray-600">
                      <a
                        href="tel:+918077487298"
                        className="text-modus-orange hover:underline"
                      >
                        +918077487298
                      </a>
                    </p>
                    <p className="text-gray-600">
                      <a
                        href="tel:+918279623426"
                        className="text-modus-orange hover:underline"
                      >
                        +918279623426
                      </a>
                    </p>
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Opening Hours</h3>
                  <p className="text-gray-600">
                    Tuesday - Sunday: 9:00 AM - 8:00 PM
                    <br />
                    Monday: Closed
                  </p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-2">Follow Us</h3>
                  <div className="flex space-x-4">
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-modus-orange"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-modus-orange"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href=""
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-gray-600 hover:text-modus-orange"
                    >
                      <svg
                        className="w-6 h-6"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                        aria-hidden="true"
                      >
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
