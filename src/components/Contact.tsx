import { Mail, MapPin, Phone, Github, Linkedin, Twitter, Instagram } from "lucide-react";
import { useState } from "react";

export function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitMessage, setSubmitMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSubmitMessage("");

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        setSubmitMessage(
          "✓ Thank you for your message! I'll get back to you soon."
        );
        setFormData({ name: "", email: "", message: "" });
      } else {
        setSubmitMessage("✗ Error: " + (data.error || "Failed to submit form"));
      }
    } catch (error) {
      setSubmitMessage("✗ Error: Failed to submit form. Please try again.");
      console.error("Form submission error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <section
      id="contact"
      className="relative z-20 py-20 px-6"
      style={{ backgroundColor: "#F8EFEA" }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="mb-4">Contact Me</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Have a project in mind? Let's work together to create something
            amazing
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Information */}
          <div>
            <h3 className="mb-6">Contact Information</h3>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Mail className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4>Email</h4>
                  <p className="text-gray-600">jerryopradnatan2@gmail.com</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Phone className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4>Phone</h4>
                  <p className="text-gray-600">+62 897-4883-632</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <MapPin className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4>Location</h4>
                  <p className="text-gray-600">North Sumatera, Indonesia</p>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <h4 className="mb-4">Follow My Social</h4>
              <div className="flex gap-4">
                <a
                  href="/github"
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Instagram size={20} />
                </a>
                <a
                  href="/linkedin"
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Linkedin size={20} />
                </a>
                <a
                  href="/twitter"
                  className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors"
                >
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="name" className="block mb-2 text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-gray-700">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="your@email.com"
                />
              </div>
              <div>
                <label htmlFor="message" className="block mb-2 text-gray-700">
                  Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent resize-none"
                  placeholder="Your message..."
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
              {submitMessage && (
                <div
                  className={`text-center py-2 px-4 rounded-lg ${
                    submitMessage.startsWith("✓")
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {submitMessage}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-20 pt-8 border-t border-gray-200">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-gray-600">
            © 2025 Jerryo Pradnatan. All rights reserved.
          </p>
        </div>
      </footer>
    </section>
  );
}
