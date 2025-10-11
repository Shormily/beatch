// src/components/SignUp.jsx
import React, { useEffect, useState } from "react";
import login from "../LandingPages/assets/login.svg";
import { FcGoogle } from "react-icons/fc";
import { FaFacebook, FaApple } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import Explore from "../LandingPages/Explore";
import { useDispatch, useSelector } from "react-redux";
import {
  signupCustomer,
  verifySignupCode,
  loginCustomer,
  selectSignupPending,
  selectVerifyState,
  selectIsAuthenticated,
} from "../../redux/slices/authSlice";

const SignUp = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const isAuthed = useSelector(selectIsAuthenticated);
  const pending = useSelector(selectSignupPending);
  const { status: verifyStatus, error: verifyError } =
    useSelector(selectVerifyState);
  const userStatus = useSelector((s) => s.auth?.user?.status || "idle");
  const userError = useSelector((s) => s.auth?.user?.error || "");

  const [step, setStep] = useState("form");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPwd, setShowPwd] = useState(false);

  const loadingForm = userStatus === "loading";
  const loadingOTP = verifyStatus === "loading";

  useEffect(() => {
    if (isAuthed) navigate("/", { replace: true });
  }, [isAuthed, navigate]);

  const onSubmitForm = async (e) => {
    e.preventDefault();
    const [firstName, ...rest] = String(name).trim().split(/\s+/);
    const lastName = rest.join(" ");

    const res = await dispatch(
      signupCustomer({
        email,
        mobile,
        password, // ✅ send actual password
        name,
        optionalFields: { firstName, lastName },
      })
    );

    if (signupCustomer.fulfilled.match(res)) {
      setStep("otp");
    }
  };

  const onVerify = async (e) => {
    e.preventDefault();
    if (!pending?.email) return;

    const v = await dispatch(
      verifySignupCode({ code: otp, email: pending.email })
    );

    if (verifySignupCode.fulfilled.match(v)) {
      const lg = await dispatch(
        loginCustomer({ email: pending.email, password })
      );
      if (loginCustomer.fulfilled.match(lg)) {
        navigate("/", { replace: true });
      }
    }
  };

  const onResend = async () => {
    if (!pending?.email) return;
    await dispatch(verifySignupCode({ resend: true, email: pending.email }));
  };

  return (
    <section>
      <div
        className="relative min-h-screen flex items-center justify-center font-murecho bg-cover bg-center"
        style={{ backgroundImage: `url(${login})` }}
      >
        <div className="w-[380px] mx-4 max-w-md rounded-2xl bg-white shadow-2xl p-8 md:mr-24">
          {step === "form" && (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-900">
                Sign up
              </h2>
              <p className="text-sm text-center text-gray-600 mt-1 mb-6">
                Create an account
              </p>

              {/* Full Name */}
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                placeholder="Shanto Dev"
                className="w-full border text-[12px] border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 mb-4"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              {/* Email */}
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                placeholder="youremail@email.com"
                className="w-full border text-[12px] border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 mb-4"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              {/* Mobile */}
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Mobile Number <span className="text-red-600">*</span>
              </label>
              <div className="flex text-[12px] items-center border border-gray-300 rounded-md overflow-hidden mb-4">
                <div className="flex items-center gap-2 pl-3 pr-2 bg-gray-50 text-sm text-gray-700">
                  <span className="inline-block w-2 h-2 rounded-full bg-green-500" />
                  <span className="text-gray-600">+880</span>
                </div>
                <input
                  type="tel"
                  placeholder="XXXX-XXXXXXX"
                  className="flex-1 px-3 py-2 outline-none"
                  value={mobile}
                  onChange={(e) => setMobile(e.target.value)}
                  required
                />
              </div>

              {/* ✅ Password */}
              <label className="block text-sm font-medium text-gray-800 mb-1">
                Password <span className="text-red-600">*</span>
              </label>
              <div className="relative mb-4">
                <input
                  type={showPwd ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full border text-[12px] border-gray-300 rounded-md px-4 py-2 pr-10 outline-none focus:ring-2 focus:ring-red-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPwd((p) => !p)}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-gray-500"
                >
                  {showPwd ? "Hide" : "Show"}
                </button>
              </div>

              {!!userError && (
                <p className="mt-3 text-[12px] text-red-600">{userError}</p>
              )}

              <button
                onClick={onSubmitForm}
                disabled={
                  loadingForm || !name || !email || !mobile || !password
                }
                className="mt-4 w-full bg-red-700 text-[14px] text-white font-normal py-2 rounded-md transition disabled:opacity-60"
              >
                {loadingForm ? "Sending OTP..." : "Send OTP"}
              </button>

              <p className="text-center text-sm text-gray-800 mt-4">
                Already have an account?{" "}
                <Link
                  to="/sign"
                  className="text-red-600 font-semibold underline"
                >
                  Sign in
                </Link>
              </p>

              <div className="flex items-center my-4">
                <div className="flex-grow border-t border-gray-300"></div>
                <span className="mx-3 text-sm text-gray-600">
                  Or Sign up with
                </span>
                <div className="flex-grow border-t border-gray-300"></div>
              </div>

              <div className="flex justify-center gap-4">
                <button className="border border-gray-300 rounded-md p-2">
                  <FcGoogle size={22} />
                </button>
                <button className="border border-gray-300 rounded-md p-2 text-blue-600">
                  <FaFacebook size={22} />
                </button>
                <button className="border border-gray-300 rounded-md p-2 text-black">
                  <FaApple size={22} />
                </button>
              </div>

              <p className="text-[12px] text-center text-gray-600 mt-5 leading-relaxed">
                By signing up you agree to our{" "}
                <a
                  href="#"
                  className="text-red-600 font-semibold hover:underline"
                >
                  Terms &amp; Conditions
                </a>{" "}
                and{" "}
                <a
                  href="#"
                  className="text-red-600 font-semibold hover:underline"
                >
                  Privacy Policy
                </a>
                .
              </p>
            </>
          )}

          {step === "otp" && (
            <>
              <h2 className="text-2xl font-bold text-center text-gray-900">
                Verify Email
              </h2>
              <p className="text-sm text-center text-gray-600 mt-1 mb-6">
                We sent a 6-digit code to <b>{pending?.email}</b>. Enter it
                below.
              </p>

              <label className="block text-sm font-medium text-gray-800 mb-1">
                Verification Code
              </label>
              <input
                type="text"
                maxLength={6}
                placeholder="------"
                className="w-full border tracking-widest text-[14px] border-gray-300 rounded-md px-4 py-2 outline-none focus:ring-2 focus:ring-red-500 mb-3"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
              />

              {!!verifyError && (
                <p className="mb-2 text-[12px] text-red-600">{verifyError}</p>
              )}

              <button
                onClick={onVerify}
                disabled={loadingOTP || otp.length < 4}
                className="w-full bg-red-700 text-[14px] text-white font-normal py-2 rounded-md transition disabled:opacity-60"
              >
                {loadingOTP ? "Verifying..." : "Verify & Create Account"}
              </button>

              <button
                onClick={onResend}
                disabled={loadingOTP}
                className="mt-3 w-full border border-gray-300 text-[14px] rounded-md py-2 hover:bg-gray-50 transition disabled:opacity-60"
              >
                Resend Code
              </button>

              <p className="text-center text-sm text-gray-800 mt-4">
                Wrong email?{" "}
                <button
                  type="button"
                  onClick={() => {
                    setStep("form");
                    setOtp("");
                  }}
                  className="text-red-600 font-semibold underline"
                >
                  Edit details
                </button>
              </p>
            </>
          )}
        </div>
      </div>
      <Explore />
    </section>
  );
};

export default SignUp;
