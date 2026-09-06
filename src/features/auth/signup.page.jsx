import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../core/auth/AuthContext";
import {
  ArrowLeft,
  ArrowRight,
  Camera,
  Eye,
  EyeOff,
  IdCard,
  Lock,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

const initialData = {
  avatar: "",
  fullName: "",
  username: "",
  email: "",
  phone: "",
  nationalId: "",
  gender: "",
  birthDate: "",
  address: "",
  password: "",
  confirmPassword: "",
};

export function SignupPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [data, setData] = useState(initialData);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const update = (name, value) => {
    setData((prev) => ({ ...prev, [name]: value }));
    setError("");
  };

  const uploadAvatar = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => update("avatar", reader.result);
    reader.readAsDataURL(file);
  };

  const validate = () => {
    if (step === 1 && (!data.fullName.trim() || !data.username.trim())) {
      setError("أكمل الاسم الكامل واسم المستخدم.");
      return false;
    }

    if (
      step === 2 &&
      (!data.email.trim() || !data.phone.trim() || !data.nationalId.trim())
    ) {
      setError("أكمل البريد الإلكتروني ورقم الهاتف والرقم الوطني.");
      return false;
    }

    if (
      step === 3 &&
      (!data.gender || !data.birthDate || !data.address.trim())
    ) {
      setError("أكمل الجنس وتاريخ الميلاد والعنوان.");
      return false;
    }

    if (step === 4) {
      if (!data.password || !data.confirmPassword) {
        setError("أدخل كلمة المرور وتأكيدها.");
        return false;
      }

      if (data.password !== data.confirmPassword) {
        setError("كلمتا المرور غير متطابقتين.");
        return false;
      }
    }

    return true;
  };

  const next = () => {
    if (validate()) setStep((prev) => prev + 1);
  };

  const back = () => {
    setError("");
    setStep((prev) => prev - 1);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (step < 4) {
      next();
      return;
    }

    if (!validate()) return;

    try {
      const payload = { ...data };
      delete payload.confirmPassword;

      if (typeof register === "function") {
        await register(payload);
      } else {
        console.log("Signup data:", payload);
      }

      navigate("/login");
    } catch (err) {
      setError(err?.message || "حدث خطأ أثناء إنشاء الحساب.");
    }
  };

  return (
    <div className="form signin signup-page" dir="rtl">
      <div className="form-logo">
        <img src="/fwallet-icon.svg" alt="FWallet" />
        <p>FWallet</p>
      </div>

      <div className="form-title">إنشاء حساب جديد</div>
      <div className="signup-step-title">الخطوة {step} من 4</div>

      <form onSubmit={handleSubmit} className="login-form">
        {step === 1 && (
          <>
            <div className="signup-avatar">
              <label className="signup-avatar-box">
                {data.avatar ? (
                  <img src={data.avatar} alt="الصورة الشخصية" />
                ) : (
                  <Camera />
                )}
                <input type="file" accept="image/*" onChange={uploadAvatar} hidden />
              </label>
              <span>الصورة الشخصية</span>
            </div>

            <Field label="الاسم الكامل" name="fullName" value={data.fullName} onChange={update} icon={<User />} />
            <Field label="اسم المستخدم" name="username" value={data.username} onChange={update} icon={<User />} />
          </>
        )}

        {step === 2 && (
          <>
            <Field label="البريد الإلكتروني" name="email" type="email" value={data.email} onChange={update} icon={<Mail />} />
            <Field label="رقم الهاتف" name="phone" type="tel" value={data.phone} onChange={update} icon={<Phone />} />
            <Field label="الرقم الوطني" name="nationalId" value={data.nationalId} onChange={update} icon={<IdCard />} />
          </>
        )}

        {step === 3 && (
          <>
            <div className="input">
              <label htmlFor="gender">الجنس</label>
              <div className="signup-input-wrapper">
                <User className="signup-field-icon" />
                <select
                  id="gender"
                  value={data.gender}
                  onChange={(e) => update("gender", e.target.value)}
                >
                  <option value="">اختر الجنس</option>
                  <option value="male">ذكر</option>
                  <option value="female">أنثى</option>
                </select>
              </div>
            </div>

            <Field label="تاريخ الميلاد" name="birthDate" type="date" value={data.birthDate} onChange={update} icon={<IdCard />} />
            <Field label="العنوان" name="address" value={data.address} onChange={update} icon={<MapPin />} />
          </>
        )}

        {step === 4 && (
          <>
            <PasswordField
              label="كلمة المرور"
              name="password"
              value={data.password}
              onChange={update}
              visible={showPassword}
              onToggle={() => setShowPassword((prev) => !prev)}
            />

            <PasswordField
              label="تأكيد كلمة المرور"
              name="confirmPassword"
              value={data.confirmPassword}
              onChange={update}
              visible={showConfirm}
              onToggle={() => setShowConfirm((prev) => !prev)}
            />
          </>
        )}

        {error && <div className="error-message">{error}</div>}

        <div className="signup-buttons">
          {step > 1 && (
            <button type="button" className="signup-back" onClick={back}>
              <ArrowRight />
              السابق
            </button>
          )}

          <button className="submit" type="submit">
            {step === 4 ? "إنشاء الحساب" : "التالي"}
            <ArrowLeft />
          </button>
        </div>
      </form>

      <div className="create-account-link">
        <p>لديك حساب؟</p>
        <NavLink className="link" to="/login">تسجيل الدخول</NavLink>
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, icon, type = "text" }) {
  return (
    <div className="input">
      <label htmlFor={name}>{label}</label>
      <div className="signup-input-wrapper">
        <span className="signup-field-icon">{icon}</span>
        <input
          id={name}
          name={name}
          type={type}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          required
        />
      </div>
    </div>
  );
}

function PasswordField({
  label,
  name,
  value,
  onChange,
  visible,
  onToggle,
}) {
  return (
    <div className="input">
      <label htmlFor={name}>{label}</label>
      <div className="signup-input-wrapper">
        <Lock className="signup-field-icon" />
        <input
          id={name}
          name={name}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(name, e.target.value)}
          required
        />
        <button
          type="button"
          className="signup-password-toggle"
          onClick={onToggle}
        >
          {visible ? <EyeOff /> : <Eye />}
        </button>
      </div>
    </div>
  );
}
