"use client";

import { cldPublic } from "@/app/lib/cloudinary";
import Image from "next/image";
import React from "react";
import { MapPin, Phone } from "lucide-react";

export default function OfficeLocations() {
  const chennai = {
    heading: "Chennai ( H Q )",
    address:
      "2nd Floor, VMP complex, 200 Feet Radial Rd, Ganesh Avenue, Rose Avenue, Pallikaranai, Chennai, Tamil Nadu 600100",
    phone: "+91 9943532532",
    mapSrc:
      "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d4845.267757057534!2d80.19946998538059!3d12.948457882822341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a525d9723750c13%3A0x10e6f878e4c1e0ce!2sQMatrix%20Technologies!5e1!3m2!1sen!2sus!4v1771743736245!5m2!1sen!2sus",
    // ✅ FIX: string URL (not object)
    imageSrc: cldPublic("/QMatrix/officelocationimage.webp", "f_auto,q_auto,w_1000"),
  };

  return (
    <section className="w-full bg-white">
      <div className="mx-auto max-w-6xl px-4 py-14">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-[var(--primary)] sm:text-4xl">
            Explore Our Location
          </h2>
          <div className="mx-auto mt-2 h-2 w-2 rounded-full bg-[var(--secondary)]" />
        </div>

        {/* Big Card */}
        <div className="mt-8 rounded-2xl border border-black/10 bg-white p-6 shadow-[0_18px_60px_rgba(16,24,40,0.10)] sm:p-8">
          {/* Header */}
          <div>
            <h3 className="text-3xl font-extrabold tracking-tight text-[var(--primary)]">
              {chennai.heading}
            </h3>

            <div className="mt-3 flex flex-col gap-2 text-sm text-slate-700 sm:flex-row sm:items-start sm:gap-6">
              <div className="flex items-start gap-2">
                <MapPin className="mt-0.5 h-4 w-4 text-[var(--secondary)]" />
                <p className="max-w-3xl leading-6">{chennai.address}</p>
              </div>

              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-[var(--secondary)]" />
                <p className="font-semibold text-slate-800">{chennai.phone}</p>
              </div>
            </div>
          </div>

          {/* Map + Image */}
          <div className="mt-7 grid gap-8 lg:grid-cols-2">
            {/* Map */}
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Location Map</h4>
              <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <iframe
                  src={chennai.mapSrc}
                  className="h-[320px] w-full"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <h4 className="text-sm font-extrabold text-slate-900">Location Image</h4>
              <div className="mt-3 overflow-hidden rounded-xl border border-black/10 bg-white shadow-sm">
                <div className="relative h-[320px] w-full">
                  <Image
                    src={chennai.imageSrc}
                    alt="Chennai HQ location"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="h-2" />
      </div>
    </section>
  );
}