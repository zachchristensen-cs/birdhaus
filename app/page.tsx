import fs from "fs";
import path from "path";

interface Item {
  name: string;
  detail?: string;
}

interface Group {
  title: string;
  items: Item[];
}

interface Content {
  eventName: string;
  addressLine1: string;
  addressLine2: string;
  date: string;
  time: string;
  rsvpUrl: string;
  rsvpDeadline: string;
  note: string;
  instagramHandle: string;
  groups: Group[];
}

function getContent(): Content {
  const filePath = path.join(process.cwd(), "content.json");
  const raw = fs.readFileSync(filePath, "utf-8");
  return JSON.parse(raw);
}

export default function Home() {
  const content = getContent();

  return (
    <div
      className="flex justify-center p-8"
      style={{
        backgroundImage:
          "linear-gradient(rgba(241,237,225,0.8), rgba(241,237,225,0.8)), url(/background.svg)",
        backgroundSize: "800px",
        backgroundRepeat: "repeat",
      }}
    >
      <div className="flex flex-col items-center gap-6 w-full max-w-[500px] bg-card-bg p-8" style={{ textWrap: "balance" }}>
        {/* Logo */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/logo.svg" alt="birdhaus" width={280} height={70} />

        {/* Address */}
        <p className="text-center leading-5">
          <span className="font-medium">{content.addressLine1}</span>
          <br />
          {content.addressLine2}
        </p>

        {/* RSVP Button Top */}
        <a
          href={content.rsvpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-birdhaus text-body-bg text-center py-4 hover:opacity-90 transition-opacity"
        >
          rsvp
        </a>

        {/* Divider */}
        <div className="w-full h-px bg-birdhaus" />

        {/* Date & Time */}
        <p className="text-center leading-5">
          {content.date}
          <br />
          {content.time}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-birdhaus" />

        {/* Menu Groups */}
        <div className="w-full">
          {content.groups.map((group: Group) => (
            <div key={group.title} className="mb-4">
              <p className="text-center mb-3">{group.title}</p>
              <div className="space-y-3">
                {group.items.map((item: Item) => (
                  <div
                    key={item.name}
                    className="border border-brown p-3 flex flex-col items-center justify-center min-h-[72px]"
                  >
                    <p className="font-medium text-center">{item.name}</p>
                    {item.detail && <p className="text-center">{item.detail}</p>}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div className="w-full h-px bg-birdhaus" />

        {/* RSVP Deadline */}
        <p className="text-center whitespace-pre-line leading-5">
          {content.rsvpDeadline}
        </p>

        {/* Note */}
        {content.note && <p className="text-center text-birdhaus">{content.note}</p>}

        {/* RSVP Button Bottom */}
        <a
          href={content.rsvpUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="block w-full bg-birdhaus text-body-bg text-center py-4 hover:opacity-90 transition-opacity"
        >
          rsvp
        </a>

        {/* Instagram */}
        {content.instagramHandle && (
          <a
            href={`https://www.instagram.com/${content.instagramHandle}/`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-brown hover:text-birdhaus transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 32 32"
              fill="currentColor"
            >
              <circle cx="22.406" cy="9.594" r="1.44" />
              <path d="M16 9.838A6.162 6.162 0 1 0 22.162 16 6.16 6.16 0 0 0 16 9.838M16 20a4 4 0 1 1 4-4 4 4 0 0 1-4 4" />
              <path d="M16 6.162c3.204 0 3.584.012 4.849.07a6.6 6.6 0 0 1 2.228.413 3.98 3.98 0 0 1 2.278 2.278 6.6 6.6 0 0 1 .413 2.228c.058 1.265.07 1.645.07 4.85s-.012 3.583-.07 4.848a6.6 6.6 0 0 1-.413 2.228 3.98 3.98 0 0 1-2.278 2.278 6.6 6.6 0 0 1-2.228.413c-1.265.058-1.645.07-4.849.07s-3.584-.012-4.849-.07a6.6 6.6 0 0 1-2.228-.413 3.98 3.98 0 0 1-2.278-2.278 6.6 6.6 0 0 1-.413-2.228c-.058-1.265-.07-1.645-.07-4.849s.012-3.584.07-4.849a6.6 6.6 0 0 1 .413-2.228 3.98 3.98 0 0 1 2.278-2.278 6.6 6.6 0 0 1 2.228-.413c1.265-.058 1.645-.07 4.849-.07M16 4c-3.259 0-3.668.014-4.948.072a8.8 8.8 0 0 0-2.912.558 6.14 6.14 0 0 0-3.51 3.51 8.8 8.8 0 0 0-.558 2.913C4.014 12.333 4 12.74 4 16s.014 3.668.072 4.948a8.8 8.8 0 0 0 .558 2.912 6.14 6.14 0 0 0 3.51 3.51 8.8 8.8 0 0 0 2.913.558c1.28.058 1.688.072 4.948.072s3.668-.014 4.948-.072a8.8 8.8 0 0 0 2.912-.558 6.14 6.14 0 0 0 3.51-3.51 8.8 8.8 0 0 0 .558-2.913C28 19.667 28 19.26 28 16s-.014-3.668-.072-4.948a8.8 8.8 0 0 0-.558-2.912 6.14 6.14 0 0 0-3.51-3.51 8.8 8.8 0 0 0-2.913-.558C19.667 4.014 19.26 4 16 4" />
            </svg>
          </a>
        )}
      </div>
    </div>
  );
}
