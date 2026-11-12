import React from "react";

export function ExperienceEducation() {
  return (
    <>
      <section
        id="resume"
        className="py-12 border-b border-[#212221] scroll-mt-6"
      >
        <h2 className="text-xl font-semibold text-white tracking-tight mb-7">
          Experience
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-x-6 gap-y-2 text-sm">
          <div className="text-[#989A99]">
            <p>Current</p>
            <p className="mt-0.5 text-xs">Ho Chi Minh City</p>
          </div>

          <div>
            <p>
              <strong className="font-semibold text-white">
                Mobile Developer
              </strong>
              <span className="text-[#989A99]"> · </span>
              <span className="text-[#d3d6d4]">Sunshine Software</span>
            </p>
            <p className="text-[#989A99] mt-2 leading-relaxed">
              Flutter and React Native apps in healthcare, education and sports
              social. Sole mobile developer on AVN PMS, maintainer of 5 Phut
              Thuoc Bai (100K+ downloads), and builder of WithPlay.
            </p>
          </div>
        </div>
      </section>

      <section
        id="education"
        className="py-12 border-b border-[#212221] scroll-mt-6"
      >
        <h2 className="text-xl font-semibold text-white tracking-tight mb-7">
          Education
        </h2>

        <div className="space-y-4 text-sm">
          <div>
            <strong className="font-semibold text-white">
              University of Transport and Communications
            </strong>
            <p className="text-[#989A99] mt-0.5">
              Bachelor in Information Technology
            </p>
          </div>

          <div>
            <strong className="font-semibold text-white">
              FPT Polytechnic Ho Chi Minh City
            </strong>
            <p className="text-[#989A99] mt-0.5">
              Associate Degree in Mobile App Development. High Distinction, GPA
              3.90/4.00, top 1% of cohort.
            </p>
          </div>

          <div>
            <strong className="font-semibold text-white">
              Hanoi University of Science and Technology
            </strong>
            <p className="text-[#989A99] mt-0.5">
              Electrical Systems Engineering
            </p>
          </div>
        </div>
      </section>

      <section
        id="skills"
        className="py-12 border-b border-[#212221] scroll-mt-6"
      >
        <h2 className="text-xl font-semibold text-white tracking-tight mb-7">
          Skills
        </h2>

        <dl className="grid grid-cols-1 sm:grid-cols-[170px_1fr] gap-x-6 gap-y-2.5 text-sm">
          <dt className="text-[#989A99]">Languages</dt>
          <dd className="text-[#d3d6d4]">
            Dart, TypeScript, JavaScript, Kotlin, Java
          </dd>

          <dt className="text-[#989A99]">Frameworks</dt>
          <dd className="text-[#d3d6d4]">
            Flutter, React Native (New Architecture and legacy), Next.js
          </dd>

          <dt className="text-[#989A99]">Architecture</dt>
          <dd className="text-[#d3d6d4]">Clean Architecture, MVVM</dd>

          <dt className="text-[#989A99]">State management</dt>
          <dd className="text-[#d3d6d4]">Riverpod, Redux, Redux-Saga</dd>

          <dt className="text-[#989A99]">Testing</dt>
          <dd className="text-[#d3d6d4]">Unit testing</dd>

          <dt className="text-[#989A99]">Release and monitoring</dt>
          <dd className="text-[#d3d6d4]">
            Fastlane, Codemagic, Firebase (FCM, Remote Config, Crashlytics),
            Sentry
          </dd>

          <dt className="text-[#989A99]">Performance</dt>
          <dd className="text-[#d3d6d4]">
            Android Studio Profiler, Layout Bounds, HWUI Rendering, memory leak
            analysis
          </dd>
        </dl>
      </section>
    </>
  );
}
