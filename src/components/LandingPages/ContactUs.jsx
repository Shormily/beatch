// src/components/ContactUs.jsx
import React, { useState } from "react";
import { LuMail, LuPhone, LuSend } from "react-icons/lu";
import { FaFacebook, FaInstagram, FaYoutube } from "react-icons/fa";

export default function ContactUs() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    countryCode: "+880",
    phone: "",
    subject: "",
    message: "",
    agree: false,
  });

  function update(e) {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  }

  function onSubmit(e) {
    e.preventDefault();
    // TODO: integrate with your backend/email service
    // For now, show a simple confirmation
    alert("Message sent! (Demo)");
    setForm({
      firstName: "",
      lastName: "",
      email: "",
      countryCode: "+880",
      phone: "",
      subject: "",
      message: "",
      agree: false,
    });
  }

  return (
    <main className="bg-[#eef2f6] py-10 lg:py-14 ">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 rounded-md">
        {/* Card */}
        <div className="rounded-xl bg-white shadow-sm ring-1 ring-black/5">
          {/* Header */}
          <div className="px-6 sm:px-8 pt-8">
            <h1 className="text-4xl font-bold text-gray-900">
              Contact Us
            </h1>
          </div>

          {/* Content */}
          <div className="px-6 sm:px-8 pb-8">
            <div className="mt-6 grid grid-cols-1 lg:grid-cols-2 gap-10">
              {/* LEFT: contact info */}
              <aside>
                <p className="text-[15px] leading-7 text-gray-700">
                  For any queries or complaints, we are always here for you!
                  Please reach out to us at
                </p>

                <div className="mt-6 space-y-5">
                  <div>
                    <div className="text-sm text-gray-500">Email us:</div>
                    <a
                      href="mailto:ask@firsttrip.com"
                      className="mt-1 inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-red-700"
                    >
                      <LuMail className="h-5 w-5" />
                      ask@firsttrip.com
                    </a>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Call us:</div>
                    <a
                      href="tel:+8809613131415"
                      className="mt-1 inline-flex items-center gap-2 font-semibold text-gray-900 hover:text-red-700"
                    >
                      <LuPhone className="h-5 w-5" />
                      +8809613131415
                    </a>
                  </div>

                  <div>
                    <div className="text-sm text-gray-500">Social Media:</div>
                    <div className="mt-2 flex items-center gap-3">
                      <a
                        href="#"
                        aria-label="Facebook"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-blue-600 text-white hover:opacity-90"
                      >
                        <FaFacebook className="h-4 w-4" />
                      </a>
                      <a
                        href="#"
                        aria-label="Instagram"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-pink-600 text-white hover:opacity-90"
                      >
                        <FaInstagram className="h-4 w-4" />
                      </a>
                      <a
                        href="#"
                        aria-label="YouTube"
                        className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-red-600 text-white hover:opacity-90"
                      >
                        <FaYoutube className="h-4 w-4" />
                      </a>
                    </div>
                  </div>
                </div>
              </aside>

              {/* RIGHT: form */}
              <section>
                <div className="text-sm text-gray-500">
                  Save time, save money!
                </div>
                <div className="text-sm text-gray-700">
                  Sign up and we’ll send the best deals to you
                </div>

                <form onSubmit={onSubmit} className="mt-4 space-y-4">
                  {/* Name row */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        First Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="firstName"
                        name="firstName"
                        required
                        value={form.firstName}
                        onChange={update}
                        placeholder="Write first name here"
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Last Name <span className="text-red-600">*</span>
                      </label>
                      <input
                        id="lastName"
                        name="lastName"
                        required
                        value={form.lastName}
                        onChange={update}
                        placeholder="Write last name here"
                        className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Email <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={update}
                      placeholder="Write email here"
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Phone row */}
                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Phone <span className="text-red-600">*</span>
                    </label>
                    <div className="mt-1 flex">
                      <select
                        name="countryCode"
                        value={form.countryCode}
                        onChange={update}
                        className="rounded-l-lg border border-gray-300 bg-white px-2 py-2 text-sm text-gray-900 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      >
                        <option value="+880">+880</option>
                        <option value="+91">+91</option>
                        <option value="+971">+971</option>
                        <option value="+1">+1</option>
                      </select>
                      <input
                        id="phone"
                        name="phone"
                        required
                        pattern="[0-9]{6,15}"
                        value={form.phone}
                        onChange={update}
                        placeholder="1746 000 000"
                        className="w-full rounded-r-lg border border-l-0 border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                      />
                    </div>
                    <p className="mt-1 text-xs text-gray-500">
                      Digits only, 6–15 characters.
                    </p>
                  </div>

                  {/* Subject */}
                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Subject
                    </label>
                    <input
                      id="subject"
                      name="subject"
                      value={form.subject}
                      onChange={update}
                      placeholder="Write subject here"
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* Message */}
                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Your Message <span className="text-red-600">*</span>
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      rows={5}
                      value={form.message}
                      onChange={update}
                      placeholder="Write message here"
                      className="mt-1 block w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-red-500 focus:outline-none focus:ring-2 focus:ring-red-500/20"
                    />
                  </div>

                  {/* reCAPTCHA placeholder */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    <div className="flex items-center gap-3 rounded-lg border border-gray-300 bg-gray-50 px-3 py-2">
                      <input
                        type="checkbox"
                        name="agree"
                        checked={form.agree}
                        onChange={update}
                        className="h-4 w-4 accent-red-600"
                        aria-label="I'm not a robot (placeholder)"
                      />
                      <span className="text-sm text-gray-700">
                        I’m not a robot
                      </span>
                      <span className="ml-4 text-xs text-gray-500">
                        (Add Google reCAPTCHA here)
                      </span>
                    </div>

                    <button
                      type="submit"
                      className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-red-700 disabled:opacity-50"
                      disabled={
                        !form.firstName ||
                        !form.lastName ||
                        !form.email ||
                        !form.phone ||
                        !form.message
                      }
                    >
                      <LuSend className="h-4 w-4" />
                      Send Message
                    </button>
                  </div>
                </form>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
