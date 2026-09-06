// FWallet Settings - Lux Banking Signature - Sep 06
import { useMemo, useRef, useState } from "react";
import "./settings.style.css";

const initialData = {
  fullName: "محمد أحمد",
  username: "mohammed",
  email: "mohammed@example.com",
  phone: "+967 777 000 000",
  address: "",
  gender: "",
  birthDate: "",
  nationalId: "",
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

const sections = [
  {
    id: "profile",
    label: "الملف الشخصي",
    description: "صورتك، اسمك، وهوية حسابك داخل FWallet.",
    icon: "user",
    number: "01",
  },
  {
    id: "contact",
    label: "التواصل والعنوان",
    description: "البريد، الهاتف، ومعلومات التواصل الأساسية.",
    icon: "mail",
    number: "02",
  },
  {
    id: "personal",
    label: "البيانات الشخصية",
    description: "معلومات الهوية، الميلاد، والبيانات الشخصية.",
    icon: "id",
    number: "03",
  },
  {
    id: "security",
    label: "الأمان",
    description: "إدارة كلمة المرور وحماية الوصول إلى حسابك.",
    icon: "shield",
    number: "04",
  },
];

export function SettingsPage() {
  const [active, setActive] = useState(null);
  const [form, setForm] = useState(initialData);
  const [saved, setSaved] = useState(initialData);
  const [avatar, setAvatar] = useState(null);
  const [savedAvatar, setSavedAvatar] = useState(null);
  const [notice, setNotice] = useState("");
  const [show, setShow] = useState({
    current: false,
    next: false,
    confirm: false,
  });

  const fileRef = useRef(null);

  const dirty = useMemo(
    () =>
      JSON.stringify(form) !== JSON.stringify(saved) ||
      avatar !== savedAvatar,
    [form, saved, avatar, savedAvatar]
  );

  const completeness = useMemo(() => {
    const values = {
      profile: [form.fullName, form.username],
      contact: [form.email, form.phone, form.address],
      personal: [form.gender, form.birthDate, form.nationalId],
      security: [form.currentPassword, form.newPassword, form.confirmPassword],
    };

    return Object.fromEntries(
      Object.entries(values).map(([key, arr]) => [
        key,
        Math.round((arr.filter(Boolean).length / arr.length) * 100),
      ])
    );
  }, [form]);

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const save = () => {
    setSaved(form);
    setSavedAvatar(avatar);
    setNotice("تم حفظ التغييرات بنجاح");
    window.setTimeout(() => setNotice(""), 1800);
  };

  const cancel = () => {
    setForm(saved);
    setAvatar(savedAvatar);
    setNotice("تم التراجع عن التغييرات");
    window.setTimeout(() => setNotice(""), 1500);
  };

  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => setAvatar(reader.result);
    reader.readAsDataURL(file);
  };

  const current = active ? sections.find((s) => s.id === active) : null;

  return (
    <section className="fw-lux-page" dir="rtl">
      {notice && (
        <div className="fw-lux-notice">
          <span className="fw-lux-notice-mark">✓</span>
          {notice}
        </div>
      )}

      <div className="fw-lux-ambient fw-lux-ambient-one" />
      <div className="fw-lux-ambient fw-lux-ambient-two" />

      {!active ? (
        <div className="fw-lux-home fw-lux-view-in">
          <div className="fw-lux-hero">
            <div className="fw-lux-hero-account">
              <div className="fw-lux-hero-account-avatar">
                {avatar ? (
                  <img src={avatar} alt="الصورة الشخصية" />
                ) : (
                  <span>{(form.fullName || "م").charAt(0)}</span>
                )}
              </div>

              <div className="fw-lux-hero-account-copy">
                <span className="fw-lux-hero-account-label">حساب FWallet</span>
                <strong>{form.fullName || "اسم المستخدم"}</strong>
                <span className="fw-lux-hero-account-email">
                  {form.email || "البريد الإلكتروني"}
                </span>
              </div>

              <span
                className={`fw-lux-hero-save-dot ${dirty ? "dirty" : ""}`}
                title={dirty ? "تغييرات غير محفوظة" : "الحساب محفوظ"}
              />
            </div>

            <div className="fw-lux-hero-ornament" aria-hidden="true">
              <div className="fw-lux-ring ring-a" />
              <div className="fw-lux-ring ring-b" />
              <div className="fw-lux-ring ring-c" />
              <div className="fw-lux-center-gem">
                <Icon name="shield" />
              </div>
            </div>
          </div>

          <div className="fw-lux-section-grid">
            {sections.map((section, index) => (
              <button
                key={section.id}
                type="button"
                className="fw-lux-section-card"
                style={{ "--i": index }}
                onClick={() => setActive(section.id)}
              >
                <span className="fw-lux-card-number">{section.number}</span>

                <div className="fw-lux-card-top">
                  <span className="fw-lux-card-icon">
                    <Icon name={section.icon} />
                  </span>

                  <span className="fw-lux-card-arrow">
                    <Icon name="arrow-left" />
                  </span>
                </div>

                <div className="fw-lux-card-copy">
                  <strong>{section.label}</strong>
                  <p>{section.description}</p>
                </div>

                <div className="fw-lux-card-progress">
                  <span>
                    <i style={{ width: `${completeness[section.id]}%` }} />
                  </span>
                  <small>{completeness[section.id]}% مكتمل</small>
                </div>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <main className="fw-lux-detail fw-lux-view-in">
          <div className="fw-lux-detail-toolbar">
            <button
              type="button"
              className="fw-lux-back"
              onClick={() => setActive(null)}
            >
              <Icon name="arrow-right" />
              <span>العودة للأقسام</span>
            </button>

            <span className={`fw-lux-state-pill ${dirty ? "dirty" : ""}`}>
              <span />
              {dirty ? "تغييرات غير محفوظة" : "الحالة محفوظة"}
            </span>
          </div>

          <div className="fw-lux-detail-shell">
            <aside className="fw-lux-detail-rail">
              <span className="fw-lux-rail-number">{current.number}</span>

              <span className="fw-lux-rail-icon">
                <Icon name={current.icon} />
              </span>

              <span className="fw-lux-rail-line" />

              <div className="fw-lux-rail-copy">
                <strong>{current.label}</strong>
                <small>{current.description}</small>
              </div>
            </aside>

            <section className="fw-lux-form-panel">
              <div className="fw-lux-form-head">
                <span>ACCOUNT SETTINGS</span>
                <h2>{current.label}</h2>
                <p>{detailSubtitle(active)}</p>
              </div>

              <div className="fw-lux-form-body">
                {active === "profile" && (
                  <ProfileSection
                    form={form}
                    setField={setField}
                    avatar={avatar}
                    setAvatar={setAvatar}
                    fileRef={fileRef}
                    uploadAvatar={uploadAvatar}
                  />
                )}

                {active === "contact" && (
                  <ContactSection form={form} setField={setField} />
                )}

                {active === "personal" && (
                  <PersonalSection form={form} setField={setField} />
                )}

                {active === "security" && (
                  <SecuritySection
                    form={form}
                    setField={setField}
                    show={show}
                    setShow={setShow}
                  />
                )}
              </div>

              <footer className="fw-lux-form-footer">
                <button
                  type="button"
                  className="fw-lux-btn fw-lux-btn-ghost"
                  disabled={!dirty}
                  onClick={cancel}
                >
                  إلغاء
                </button>

                <button
                  type="button"
                  className="fw-lux-btn fw-lux-btn-primary"
                  disabled={!dirty}
                  onClick={save}
                >
                  <span>حفظ التغييرات</span>
                  <Icon name="check" />
                </button>
              </footer>
            </section>
          </div>
        </main>
      )}
    </section>
  );
}

export default SettingsPage;

function ProfileSection({
  form,
  setField,
  avatar,
  setAvatar,
  fileRef,
  uploadAvatar,
}) {
  return (
    <div className="fw-lux-form-grid">
      <div className="fw-lux-profile-showcase fw-lux-span-2">
        <div className="fw-lux-avatar-stage">
          <div className="fw-lux-avatar-halo" />
          <div className="fw-lux-avatar-large">
            {avatar ? (
              <img src={avatar} alt="الصورة الشخصية" />
            ) : (
              <span>{(form.fullName || "م").charAt(0)}</span>
            )}
          </div>
          <span className="fw-lux-avatar-badge">✓</span>
        </div>

        <div className="fw-lux-profile-meta">
          <span>PROFILE IMAGE</span>
          <h3>الصورة الشخصية</h3>
          <p>استخدم صورة واضحة ومميزة لحسابك.</p>

          <div className="fw-lux-profile-actions">
            <input
              ref={fileRef}
              hidden
              type="file"
              accept="image/*"
              onChange={uploadAvatar}
            />

            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className="fw-lux-mini-action"
            >
              تغيير الصورة
            </button>

            <button
              type="button"
              onClick={() => setAvatar(null)}
              className="fw-lux-mini-action danger"
            >
              حذف
            </button>
          </div>
        </div>
      </div>

      <LuxField
        icon="user"
        label="الاسم الكامل"
        value={form.fullName}
        onChange={(v) => setField("fullName", v)}
        placeholder="أدخل الاسم الكامل"
      />

      <LuxField
        icon="at"
        label="اسم المستخدم"
        value={form.username}
        onChange={(v) => setField("username", v)}
        placeholder="username"
        dir="ltr"
      />
    </div>
  );
}

function ContactSection({ form, setField }) {
  return (
    <div className="fw-lux-form-grid">
      <LuxField
        icon="mail"
        label="البريد الإلكتروني"
        type="email"
        value={form.email}
        onChange={(v) => setField("email", v)}
        placeholder="name@example.com"
        dir="ltr"
      />

      <LuxField
        icon="phone"
        label="رقم الهاتف"
        type="tel"
        value={form.phone}
        onChange={(v) => setField("phone", v)}
        placeholder="+967"
        dir="ltr"
      />

      <LuxField
        icon="location"
        label="العنوان"
        value={form.address}
        onChange={(v) => setField("address", v)}
        placeholder="أدخل العنوان"
        full
      />
    </div>
  );
}

function PersonalSection({ form, setField }) {
  return (
    <div className="fw-lux-form-grid">
      <div className="fw-lux-field">
        <label>الجنس</label>
        <div className="fw-lux-input-shell">
          <span className="fw-lux-field-icon">
            <Icon name="id" />
          </span>

          <select
            value={form.gender}
            onChange={(e) => setField("gender", e.target.value)}
          >
            <option value="">اختر الجنس</option>
            <option value="male">ذكر</option>
            <option value="female">أنثى</option>
          </select>
        </div>
      </div>

      <LuxField
        icon="calendar"
        label="تاريخ الميلاد"
        type="date"
        value={form.birthDate}
        onChange={(v) => setField("birthDate", v)}
      />

      <LuxField
        icon="id"
        label="الرقم الوطني"
        value={form.nationalId}
        onChange={(v) => setField("nationalId", v)}
        placeholder="أدخل الرقم الوطني"
        full
        dir="ltr"
      />
    </div>
  );
}

function SecuritySection({ form, setField, show, setShow }) {
  return (
    <div className="fw-lux-form-grid">
      <div className="fw-lux-security-banner fw-lux-span-2">
        <span className="fw-lux-security-icon">
          <Icon name="shield" />
        </span>

        <div>
          <span>SECURITY CENTER</span>
          <strong>حماية حسابك تبدأ من كلمة مرور قوية.</strong>
          <p>
            استخدم مزيجًا من الأحرف والأرقام والرموز، ولا تشارك كلمة المرور.
          </p>
        </div>
      </div>

      <PasswordField
        label="كلمة المرور الحالية"
        value={form.currentPassword}
        onChange={(v) => setField("currentPassword", v)}
        show={show.current}
        toggle={() =>
          setShow((p) => ({ ...p, current: !p.current }))
        }
        full
      />

      <PasswordField
        label="كلمة المرور الجديدة"
        value={form.newPassword}
        onChange={(v) => setField("newPassword", v)}
        show={show.next}
        toggle={() =>
          setShow((p) => ({ ...p, next: !p.next }))
        }
      />

      <PasswordField
        label="تأكيد كلمة المرور"
        value={form.confirmPassword}
        onChange={(v) => setField("confirmPassword", v)}
        show={show.confirm}
        toggle={() =>
          setShow((p) => ({ ...p, confirm: !p.confirm }))
        }
      />
    </div>
  );
}

function LuxField({
  icon,
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  full = false,
  dir,
}) {
  return (
    <div className={`fw-lux-field ${full ? "fw-lux-span-2" : ""}`}>
      <label>{label}</label>

      <div className="fw-lux-input-shell">
        <span className="fw-lux-field-icon">
          <Icon name={icon} />
        </span>

        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          dir={dir}
        />

        <span className="fw-lux-input-glow" />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  value,
  onChange,
  show,
  toggle,
  full = false,
}) {
  return (
    <div className={`fw-lux-field ${full ? "fw-lux-span-2" : ""}`}>
      <label>{label}</label>

      <div className="fw-lux-input-shell">
        <span className="fw-lux-field-icon">
          <Icon name="lock" />
        </span>

        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="••••••••"
        />

        <button
          type="button"
          className="fw-lux-eye"
          onClick={toggle}
          aria-label={show ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
        >
          <Icon name={show ? "eye-off" : "eye"} />
        </button>

        <span className="fw-lux-input-glow" />
      </div>
    </div>
  );
}

function detailSubtitle(id) {
  return {
    profile: "حدّث الصورة والاسم واسم المستخدم بأسلوب سريع وآمن.",
    contact: "أدر بيانات التواصل الأساسية المرتبطة بحسابك.",
    personal: "أكمل معلومات الهوية والبيانات الشخصية الأساسية.",
    security: "غيّر كلمة المرور واحتفظ بحسابك محميًا.",
  }[id];
}

function Icon({ name }) {
  const p = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round",
    "aria-hidden": "true",
  };

  const icons = {
    user: (
      <svg {...p}>
        <circle cx="12" cy="8" r="4" />
        <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
      </svg>
    ),
    mail: (
      <svg {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
    id: (
      <svg {...p}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <circle cx="8" cy="11" r="2" />
        <path d="M5.8 16c.8-1.5 2-2.2 3.2-2.2s2.4.7 3.2 2.2M14 10h4M14 14h4" />
      </svg>
    ),
    shield: (
      <svg {...p}>
        <path d="M12 3 5 6v5c0 4.5 2.8 8.2 7 10 4.2-1.8 7-5.5 7-10V6l-7-3Z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
    lock: (
      <svg {...p}>
        <rect x="5" y="10" width="14" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
    phone: (
      <svg {...p}>
        <path d="M6.5 3h3l1 5-2 1.5a15 15 0 0 0 6 6L16 13.5l5 1v3c0 1.4-1.1 2.5-2.5 2.5C10.5 20 4 13.5 4 5.5 4 4.1 5.1 3 6.5 3Z" />
      </svg>
    ),
    location: (
      <svg {...p}>
        <path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    ),
    calendar: (
      <svg {...p}>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M8 3v4M16 3v4M3 10h18" />
      </svg>
    ),
    at: (
      <svg {...p}>
        <circle cx="12" cy="12" r="4" />
        <path d="M16 12v1.5a2.5 2.5 0 0 0 5 0V12a9 9 0 1 0-3 6.7" />
      </svg>
    ),
    eye: (
      <svg {...p}>
        <path d="M2 12s3.5-6 10-6 10 6 10 6-3.5 6-10 6S2 12 2 12Z" />
        <circle cx="12" cy="12" r="2.5" />
      </svg>
    ),
    "eye-off": (
      <svg {...p}>
        <path d="M3 3l18 18" />
        <path d="M10.7 6.2A9.2 9.2 0 0 1 12 6c6.5 0 10 6 10 6" />
        <path d="M6.7 6.7C3.7 8.5 2 12 2 12s3.5 6 10 6c1.2 0 2.3-.2 3.4-.5" />
      </svg>
    ),
    "arrow-left": (
      <svg {...p}>
        <path d="m15 18-6-6 6-6" />
      </svg>
    ),
    "arrow-right": (
      <svg {...p}>
        <path d="m9 18 6-6-6-6" />
      </svg>
    ),
    check: (
      <svg {...p}>
        <path d="m5 12 4 4L19 6" />
      </svg>
    ),
  };

  return icons[name] || null;
}
