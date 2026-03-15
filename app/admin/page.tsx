"use client";

import { useEffect, useState, useCallback } from "react";

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

const ADMIN_PASSWORD = "zach";

export default function AdminPage() {
  const [authed, setAuthed] = useState(false);
  const [password, setPassword] = useState("");
  const [content, setContent] = useState<Content | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [deploying, setDeploying] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("birdhaus-admin");
    if (stored === ADMIN_PASSWORD) setAuthed(true);
  }, []);

  useEffect(() => {
    if (!authed) return;
    fetch("/api/content", {
      headers: { "x-admin-password": ADMIN_PASSWORD },
    })
      .then((r) => r.json())
      .then(setContent);
  }, [authed]);

  if (!authed) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (password === ADMIN_PASSWORD) {
              sessionStorage.setItem("birdhaus-admin", password);
              setAuthed(true);
            }
          }}
          className="bg-white rounded-xl border border-gray-200 p-8 w-full max-w-xs space-y-4"
        >
          <h1 className="text-lg font-semibold text-gray-900 text-center">
            birdhaus admin
          </h1>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="password"
            className="w-full text-sm px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            autoFocus
          />
          <button
            type="submit"
            className="w-full bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Log in
          </button>
        </form>
      </div>
    );
  }

  const save = useCallback(async () => {
    if (!content) return;
    setSaving(true);
    setSaved(false);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
      body: JSON.stringify(content),
    });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [content]);

  const deploy = useCallback(async () => {
    if (!content) return;
    setDeploying(true);
    await fetch("/api/content", {
      method: "PUT",
      headers: { "Content-Type": "application/json", "x-admin-password": ADMIN_PASSWORD },
      body: JSON.stringify(content),
    });
    const hookUrl = prompt(
      "Enter your Vercel Deploy Hook URL (or cancel to just save):"
    );
    if (hookUrl) {
      await fetch(hookUrl, { method: "POST" });
      alert("Deploy triggered! Your site will update in ~60 seconds.");
    }
    setDeploying(false);
  }, [content]);

  if (!content) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-400">Loading...</p>
      </div>
    );
  }

  const updateField = (field: keyof Content, value: string) => {
    setContent({ ...content, [field]: value });
  };

  const updateGroup = (idx: number, field: keyof Group, value: string) => {
    const groups = [...content.groups];
    groups[idx] = { ...groups[idx], [field]: value };
    setContent({ ...content, groups });
  };

  const addGroup = () => {
    setContent({
      ...content,
      groups: [...content.groups, { title: "new group", items: [] }],
    });
  };

  const removeGroup = (idx: number) => {
    const groups = content.groups.filter((_, i) => i !== idx);
    setContent({ ...content, groups });
  };

  const moveGroup = (idx: number, dir: -1 | 1) => {
    const groups = [...content.groups];
    const target = idx + dir;
    if (target < 0 || target >= groups.length) return;
    [groups[idx], groups[target]] = [groups[target], groups[idx]];
    setContent({ ...content, groups });
  };

  const updateItem = (
    gIdx: number,
    iIdx: number,
    field: keyof Item,
    value: string
  ) => {
    const groups = [...content.groups];
    const items = [...groups[gIdx].items];
    items[iIdx] = { ...items[iIdx], [field]: value };
    groups[gIdx] = { ...groups[gIdx], items };
    setContent({ ...content, groups });
  };

  const addItem = (gIdx: number) => {
    const groups = [...content.groups];
    groups[gIdx] = {
      ...groups[gIdx],
      items: [...groups[gIdx].items, { name: "" }],
    };
    setContent({ ...content, groups });
  };

  const removeItem = (gIdx: number, iIdx: number) => {
    const groups = [...content.groups];
    groups[gIdx] = {
      ...groups[gIdx],
      items: groups[gIdx].items.filter((_, i) => i !== iIdx),
    };
    setContent({ ...content, groups });
  };

  const moveItem = (gIdx: number, iIdx: number, dir: -1 | 1) => {
    const groups = [...content.groups];
    const items = [...groups[gIdx].items];
    const target = iIdx + dir;
    if (target < 0 || target >= items.length) return;
    [items[iIdx], items[target]] = [items[target], items[iIdx]];
    groups[gIdx] = { ...groups[gIdx], items };
    setContent({ ...content, groups });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top bar */}
      <div className="sticky top-0 z-50 bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">
            birdhaus admin
          </h1>
          <a
            href="/"
            target="_blank"
            className="text-xs text-blue-500 hover:underline"
          >
            view site
          </a>
        </div>
        <div className="flex items-center gap-3">
          {saved && (
            <span className="text-xs text-green-600">Saved!</span>
          )}
          <button
            onClick={save}
            disabled={saving}
            className="bg-gray-900 text-white text-sm px-5 py-2 rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors"
          >
            {saving ? "Saving..." : "Save"}
          </button>
          <button
            onClick={deploy}
            disabled={deploying}
            className="bg-[#dc4619] text-white text-sm px-5 py-2 rounded-lg hover:bg-[#c53d15] disabled:opacity-50 transition-colors"
          >
            {deploying ? "Deploying..." : "Save & Deploy"}
          </button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-6 py-8 space-y-8">
        {/* Event details */}
        <Section title="Event Details">
          <Field
            label="Address Line 1"
            value={content.addressLine1}
            onChange={(v) => updateField("addressLine1", v)}
            placeholder="80 n beacon st #3"
          />
          <Field
            label="Address Line 2"
            value={content.addressLine2}
            onChange={(v) => updateField("addressLine2", v)}
            placeholder="allston, ma 02134"
          />
          <div className="grid grid-cols-2 gap-4">
            <Field
              label="Date"
              value={content.date}
              onChange={(v) => updateField("date", v)}
              placeholder="saturday, december 6"
            />
            <Field
              label="Time"
              value={content.time}
              onChange={(v) => updateField("time", v)}
              placeholder="4pm"
            />
          </div>
        </Section>

        {/* RSVP */}
        <Section title="RSVP">
          <Field
            label="RSVP Link"
            value={content.rsvpUrl}
            onChange={(v) => updateField("rsvpUrl", v)}
            placeholder="https://partiful.com/..."
          />
          <Field
            label="RSVP Deadline Text"
            value={content.rsvpDeadline}
            onChange={(v) => updateField("rsvpDeadline", v)}
            multiline
          />
        </Section>

        {/* Note */}
        <Section title="Note">
          <Field
            label="Note (displayed in orange)"
            value={content.note}
            onChange={(v) => updateField("note", v)}
            multiline
          />
        </Section>

        {/* Instagram */}
        <Section title="Social">
          <Field
            label="Instagram Handle"
            value={content.instagramHandle}
            onChange={(v) => updateField("instagramHandle", v)}
            placeholder="dine.birdhaus"
          />
        </Section>

        {/* Menu Groups */}
        <Section
          title="Menu"
          action={
            <button
              onClick={addGroup}
              className="text-xs text-blue-500 hover:text-blue-700"
            >
              + Add group
            </button>
          }
        >
          {content.groups.map((group, gIdx) => (
            <div
              key={gIdx}
              className="border border-gray-200 rounded-xl p-4 space-y-3 bg-gray-50"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => moveGroup(gIdx, -1)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                    title="Move up"
                  >
                    ↑
                  </button>
                  <button
                    onClick={() => moveGroup(gIdx, 1)}
                    className="text-gray-400 hover:text-gray-600 text-xs"
                    title="Move down"
                  >
                    ↓
                  </button>
                </div>
                <button
                  onClick={() => removeGroup(gIdx)}
                  className="text-xs text-red-400 hover:text-red-600"
                >
                  Remove group
                </button>
              </div>
              <Field
                label="Group Title"
                value={group.title}
                onChange={(v) => updateGroup(gIdx, "title", v)}
                small
              />

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Items
                  </span>
                  <button
                    onClick={() => addItem(gIdx)}
                    className="text-xs text-blue-500 hover:text-blue-700"
                  >
                    + Add item
                  </button>
                </div>
                {group.items.map((item, iIdx) => (
                  <div
                    key={iIdx}
                    className="flex items-start gap-2 bg-white rounded-lg p-2.5 border border-gray-100"
                  >
                    <div className="flex flex-col gap-0.5 mt-1.5">
                      <button
                        onClick={() => moveItem(gIdx, iIdx, -1)}
                        className="text-gray-300 hover:text-gray-500 text-[10px] leading-none"
                      >
                        ▲
                      </button>
                      <button
                        onClick={() => moveItem(gIdx, iIdx, 1)}
                        className="text-gray-300 hover:text-gray-500 text-[10px] leading-none"
                      >
                        ▼
                      </button>
                    </div>
                    <div className="flex-1 grid grid-cols-2 gap-2">
                      <input
                        value={item.name}
                        onChange={(e) =>
                          updateItem(gIdx, iIdx, "name", e.target.value)
                        }
                        placeholder="Item name"
                        className="text-sm px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <input
                        value={item.detail || ""}
                        onChange={(e) =>
                          updateItem(gIdx, iIdx, "detail", e.target.value)
                        }
                        placeholder="Detail (optional)"
                        className="text-sm px-2.5 py-1.5 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                    <button
                      onClick={() => removeItem(gIdx, iIdx)}
                      className="text-gray-300 hover:text-red-500 mt-1.5 text-sm"
                      title="Remove item"
                    >
                      ×
                    </button>
                  </div>
                ))}
                {group.items.length === 0 && (
                  <p className="text-xs text-gray-400 text-center py-2">
                    No items yet
                  </p>
                )}
              </div>
            </div>
          ))}
        </Section>
      </div>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-semibold text-gray-900 uppercase tracking-wider">
          {title}
        </h2>
        {action}
      </div>
      {children}
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  multiline,
  small,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  multiline?: boolean;
  small?: boolean;
}) {
  const cls = `w-full ${small ? "text-sm" : "text-sm"} px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-colors`;
  return (
    <div>
      <label className="block text-xs font-medium text-gray-500 mb-1">
        {label}
      </label>
      {multiline ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className={cls + " resize-none"}
        />
      ) : (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cls}
        />
      )}
    </div>
  );
}
