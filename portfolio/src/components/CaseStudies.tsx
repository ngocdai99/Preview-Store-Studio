import React from "react";
import Image from "next/image";

const LINK_CLASS =
  "text-blue-300/80 hover:text-blue-200 underline underline-offset-4 decoration-blue-300/30 hover:decoration-blue-200/70 transition-colors";

interface CaseMeta {
  appName: string;
  publisher: string;
  framework: string;
  position: string;
}

interface CaseCover {
  src: string;
  alt: string;
  width: number;
  height: number;
  href: string;
}

interface CaseItem {
  title: string;
  meta: CaseMeta;
  problem: string;
  approach: string;
  result: string;
  links?: { label: string; href: string }[];
  cover?: CaseCover;
}

function CaseMetaGrid({ meta }: { meta: CaseMeta }) {
  const fields = [
    { label: "App", value: meta.appName },
    { label: "Publisher", value: meta.publisher },
    { label: "Framework", value: meta.framework },
    { label: "Position", value: meta.position },
  ];

  return (
    <dl className="mt-3 mb-4 grid grid-cols-2 sm:grid-cols-[1.5fr_1fr_1fr_1fr] gap-x-5 gap-y-2.5 py-2.5 border-y border-[#212221] text-xs">
      {fields.map((field) => (
        <div key={field.label}>
          <dt className="text-[#989A99] mb-0.5">{field.label}</dt>
          <dd className="text-[#EDEDED] font-medium leading-snug">
            {field.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}

function CaseCoverPreview({ cover }: { cover: CaseCover }) {
  return (
    <a
      href={cover.href}
      target="_blank"
      rel="noreferrer"
      className="mt-5 block w-full max-w-[680px] rounded-xl overflow-hidden border border-[#282928] bg-[#1D1E1D] hover:border-[#383a38] transition-colors"
    >
      <Image
        src={cover.src}
        alt={cover.alt}
        width={cover.width}
        height={cover.height}
        className="w-full h-auto block"
      />
    </a>
  );
}

const cases: CaseItem[] = [
  {
    title: "Getting a health app through Apple’s review",
    meta: {
      appName: "Suc Khoe Gia Dinh Viet (AVN PMS)",
      publisher: "Ajinomoto Vietnam CO., LTD",
      framework: "Flutter",
      position: "Sole Mobile Developer",
    },
    problem:
      "Apple rejected the app under Guideline 1.4.1 (Physical Harm) because it shows nutrition and health figures, and later under 2.1(a) (App Completeness). Google Play also rejected it over user data. The release was blocked.",
    approach:
      "For 1.4.1, I added reusable in-app citations from WHO, NIN and HUPH and bilingual disclaimers, so each health figure points to a source. For Google Play, I added data-retention transparency and in-app account deletion.",
    result:
      "The release was unblocked on both stores. TestFlight uploads now run through Fastlane and Apple Transporter CLI, so later releases skip the manual steps.",
    links: [
      {
        label: "App Store",
        href: "https://apps.apple.com/vn/app/avn-pms/id6766154421",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.avn.pms.app&hl=en",
      },
    ],
    cover: {
      src: "/covers/pms.png",
      alt: "AVN PMS listing on the Apple App Store",
      width: 2006,
      height: 1850,
      href: "https://apps.apple.com/vn/app/avn-pms/id6766154421",
    },
  },
  {
    title: "Cutting rendered views by 93% and migrating a 100K+ app to New Architecture",
    meta: {
      appName: "5 Phut Thuoc Bai",
      publisher: "Tam Tri Luc",
      framework: "React Native",
      position: "Mobile Developer",
    },
    problem:
      "On low-end Android phones, scrolling dropped frames visibly. Meanwhile, Google Play’s 16 KB page size requirement forced a migration from React Native 0.68 to 0.84 (Fabric and Bridgeless), with 60+ dependencies introducing native build conflicts.",
    approach:
      "I profiled with Layout Bounds (~5,200 rendered views on screen), detached off-screen navigators, replaced heavy SVG icons with static assets, and checked GPU cost via Profile HWUI Rendering after each change. For the 16 KB page size and New Architecture migration, I worked through all 60+ libraries one by one to resolve native errors alongside Target SDK 35 (Android 15) and React 19.",
    result:
      "Rendered views fell from 5,200 to 380 (-93%), locking 60 FPS scrolling while cutting RAM usage by over 50% and eliminating out-of-memory back-navigation crashes. The app runs on the New Architecture with 16 KB page size support and custom scripts automating APK/AAB builds and USB/Wi-Fi ADB installs.",
    links: [
      { label: "Website", href: "https://5phutthuocbai.com/" },
      {
        label: "App Store",
        href: "https://apps.apple.com/vn/app/5-ph%C3%BAt-thu%E1%BB%99c-b%C3%A0i-t%C3%A2m-tr%C3%AD-l%E1%BB%B1c/id1565648175",
      },
      {
        label: "Google Play",
        href: "https://play.google.com/store/apps/details?id=com.edu.tamtriluc&hl=en",
      },
    ],
    cover: {
      src: "/covers/5ptb.png",
      alt: "5 Phut Thuoc Bai listing on the Apple App Store",
      width: 2002,
      height: 1332,
      href: "https://apps.apple.com/vn/app/5-ph%C3%BAt-thu%E1%BB%99c-b%C3%A0i-t%C3%A2m-tr%C3%AD-l%E1%BB%B1c/id1565648175",
    },
  },
];

export function CaseStudies() {
  return (
    <section id="work" className="py-12 border-b border-[#212221]">
      <h2 className="text-xl font-semibold text-white tracking-tight mb-7">
        Selected work
      </h2>

      <div className="space-y-8">
        {cases.map((item, idx) => (
          <article
            key={idx}
            className="pt-7 first:pt-0 border-t first:border-t-0 border-[#212221]"
          >
            <h3 className="text-lg font-semibold text-white tracking-tight">
              {item.title}
            </h3>
            <CaseMetaGrid meta={item.meta} />

            <dl className="grid grid-cols-1 sm:grid-cols-[90px_1fr] gap-x-6 gap-y-2.5 text-sm">
              <dt className="text-[#989A99] font-medium">Problem</dt>
              <dd className="text-[#d3d6d4] leading-relaxed">{item.problem}</dd>

              <dt className="text-[#989A99] font-medium">Approach</dt>
              <dd className="text-[#d3d6d4] leading-relaxed">{item.approach}</dd>

              <dt className="text-[#989A99] font-medium">Result</dt>
              <dd className="text-[#d3d6d4] leading-relaxed">{item.result}</dd>
            </dl>

            {item.links && item.links.length > 0 && (
              <div className="mt-3.5 flex flex-wrap items-center gap-4 text-sm">
                {item.links.map((link, lIdx) => (
                  <a
                    key={lIdx}
                    href={link.href}
                    target="_blank"
                    rel="noreferrer"
                    className={LINK_CLASS}
                  >
                    {link.label}
                  </a>
                ))}
              </div>
            )}

            {item.cover && <CaseCoverPreview cover={item.cover} />}
          </article>
        ))}

        {/* Also shipped: WithPlay */}
        <div className="pt-7 border-t border-[#212221]">
          <h3 className="text-base font-semibold text-white tracking-tight">
            Also shipped: WithPlay
          </h3>
          <CaseMetaGrid
            meta={{
              appName: "WithPlay",
              publisher: "Donghyun Moon",
              framework: "Flutter",
              position: "Mobile Developer",
            }}
          />
          <p className="text-sm text-[#d3d6d4] leading-relaxed">
            Sports social app with venue discovery on Google Maps (marker
            clustering), community features on REST APIs, and push
            notifications through Firebase.
          </p>
          <div className="mt-3 flex flex-wrap items-center gap-4 text-sm">
            <a
              href="https://apps.apple.com/vn/app/withplay-sports-booking/id6758744744"
              target="_blank"
              rel="noreferrer"
              className={LINK_CLASS}
            >
              App Store
            </a>
            <a
              href="https://play.google.com/store/apps/details?id=com.withplay.community.app&hl=en"
              target="_blank"
              rel="noreferrer"
              className={LINK_CLASS}
            >
              Google Play
            </a>
          </div>

          <CaseCoverPreview
            cover={{
              src: "/covers/withplay.png",
              alt: "WithPlay listing on the Apple App Store",
              width: 2006,
              height: 1844,
              href: "https://apps.apple.com/vn/app/withplay-sports-booking/id6758744744",
            }}
          />
        </div>
      </div>
    </section>
  );
}
