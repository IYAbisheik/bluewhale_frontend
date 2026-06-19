import { React, useEffect, useState } from "react";
import '../Assets/Styles/Register.css'
import { Link, useNavigate } from "react-router-dom";
import { validPassword, validNames, validUsername, validEmail } from "./Regex";
import { InputField, signUpBgVideo } from "../utils/utils"
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { registerApi } from "../api/auth/authApi";
import { toast } from "sonner";
import Loading from "../components/loading";
import { User, Mail, AtSign, Lock, BadgeCheck, Eye, EyeOff } from "lucide-react";

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

const Register = () => {
    const [signupData, setSignupData] = useState({
        id: "",
        firstname: "",
        lastname: "",
        email: "",
        username: "",
        password: "",
        users: [],
        confirmpassword: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [focusedField, setFocusedField] = useState("");
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("");

    const navigate = useNavigate();

    useEffect(() => {
        const initFacebookSDK = () => {
            if (window.FB) {
                window.FB.init({
                    appId: FACEBOOK_APP_ID,
                    cookie: true,
                    xfbml: true,
                    version: 'v22.0'
                })

                window.FB.getLoginStatus((response) => {
                    console.log('FB Login Status:', response)
                })
            }
        }

        if (!document.getElementById('facebook-jssdk')) {
            const script = document.createElement('script')
            script.id = 'facebook-jssdk'
            script.src = 'https://connect.facebook.net/en_US/sdk.js'
            script.async = true
            script.defer = true
            script.crossOrigin = 'anonymous'
            script.onload = initFacebookSDK
            document.body.appendChild(script)
        } else if (window.FB) {
            initFacebookSDK()
        }
    }, [])

    const handleGoogleSuccess = (credentialResponse) => {
        try {
            const decodedUser = jwtDecode(credentialResponse.credential)

            const userData = JSON.parse(localStorage.getItem('Users')) || []

            const existingUser = userData.find(
                (u) => u.email === decodedUser.email
            )

            let currentUser

            if (existingUser) {
                currentUser = existingUser
            } else {
                const generateId = Date.now().toString()

                const nameParts = decodedUser?.name?.trim().split(' ') || []
                const firstname = nameParts[0] || ''
                const lastname = nameParts.slice(1).join(' ') || ''

                const newUser = {
                    id: generateId,
                    firstname,
                    lastname,
                    username: decodedUser.email,
                    password: '',
                    provider: 'google',
                    email: decodedUser.email,
                    profile: decodedUser.picture || '',
                    users: []
                }

                userData.push(newUser)
                localStorage.setItem('Users', JSON.stringify(userData))
                currentUser = newUser
            }

            localStorage.setItem('Currentuser', JSON.stringify(currentUser))
            localStorage.setItem('isloggedIn', 'true')

            navigate('/dashboard')
        } catch (err) {
            console.error('Google Login Error:', err)
            setError('Google login failed')
        }
    }

    const handleGoogleError = () => {
        setError('Google login failed')
    }

    const handleFacebookLogin = () => {
        setError('')

        if (!window.FB) {
            setError('Facebook SDK not loaded yet')
            return
        }

        window.FB.login(
            function (loginResponse) {
                console.log('FB Login Response:', loginResponse)

                if (loginResponse.authResponse) {
                    window.FB.api(
                        '/me',
                        { fields: 'id,name,email,picture' },
                        function (response) {
                            console.log('Facebook User Profile:', response)

                            if (!response?.id) {
                                setError('Facebook login failed')
                                return
                            }
                        }
                    )
                } else {
                    setError('Facebook login cancelled or failed')
                }
            },
            { scope: 'public_profile,email' }
        )
    }

    const handleLogout = () => {
        if (window.FB) {
            window.FB.logout(() => {
            })
        }
    }

    const handleChange = (e) => {
        setSignupData({
            ...signupData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        try {

            if (
                !signupData.firstname ||
                !signupData.lastname ||
                !signupData.username ||
                !signupData.email ||
                !signupData.password ||
                !signupData.confirmpassword
            ) {
                toast.error("Fill all the details!")
            } else if (
                !validNames.test(signupData.firstname) ||
                !validNames.test(signupData.lastname)
            ) {
                toast.error("Firstname or lastname is invalid!");
            } else if (!validUsername.test(signupData.username)) {
                toast.error(
                    "Username must be 3-20 characters and contain only letters, numbers, and underscores."
                );
            } else if (!validEmail.test(signupData.email)) {
                toast.error("Please enter a valid email address.");
            } else if (!validPassword.test(signupData.password)) {
                toast.error(
                    "Password must be 8-16 characters and contain at least one uppercase letter, one lowercase letter, and one number."
                );
            } else if (signupData.password !== signupData.confirmpassword) {
                toast.error("Passwords do not match");
            } else {
                const payload = {
                    name: `${signupData.firstname} ${signupData.lastname}`,
                    userName: signupData.username,
                    email: signupData.email,
                    password: signupData.password,
                };

                setLoading(true);   // Start loader

                const response = await registerApi(payload);

                console.log("Register response :", response);

                toast.success("User registered successfully");

                navigate("/");
            }
        } catch (error) {
            console.log(error);

            toast.error(
                error.response?.data?.message ||
                error.message
            );
        } finally {
            setLoading(false);  // Stop loader
        }
    };

    console.log("LINE251", validNames.test(signupData.firstname), validNames.test(signupData.lastname));

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Background */}
            <video
                src={signUpBgVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover blur-md scale-110"
            />

            <div className="absolute inset-0 bg-black/20"></div>

            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">
                {loading && (
                    <Loading
                        fullScreen
                        text="Registering..."
                    />
                )}
                <div className="w-full max-w-4xl bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10">

                    {/* Logo */}
                    <h1 className="text-center text-4xl font-extrabold text-white mb-2">
                        WhaleIQ
                    </h1>

                    {/* Page Title */}
                    <h2 className="text-center text-2xl font-bold text-white mb-6">
                        Register
                        {/* Change to Register in Register page */}
                    </h2>

                    <form
                        onSubmit={handleSubmit}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    >

                        {/* First Name */}
                        <InputField
                            icon={User}
                            name="firstname"
                            value={signupData.firstname}
                            placeholder="Enter First Name"
                            onChange={handleChange}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                        />

                        {/* Last Name */}
                        <InputField
                            icon={BadgeCheck}
                            name="lastname"
                            value={signupData.lastname}
                            placeholder="Enter Last Name"
                            onChange={handleChange}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                        />

                        {/* Email */}
                        <InputField
                            icon={Mail}
                            name="email"
                            value={signupData.email}
                            placeholder="Enter Email"
                            onChange={handleChange}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                        />

                        {/* Username */}
                        <InputField
                            icon={AtSign}
                            name="username"
                            value={signupData.username}
                            placeholder="Enter Username"
                            onChange={handleChange}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                        />

                        {/* Password */}
                        <InputField
                            icon={Lock}
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={signupData.password}
                            placeholder="Enter Password"
                            onChange={handleChange}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            endIcon={
                                showPassword ? (
                                    <EyeOff
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-blue-600"
                                        onClick={() => setShowPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-blue-600"
                                        onClick={() => setShowPassword(true)}
                                    />
                                )
                            }
                        />

                        {/* Confirm Password */}
                        <InputField
                            icon={Lock}
                            type={showConfirmPassword ? "text" : "password"}
                            name="confirmpassword"
                            value={signupData.confirmpassword}
                            placeholder="Confirm Password"
                            onChange={handleChange}
                            focusedField={focusedField}
                            setFocusedField={setFocusedField}
                            endIcon={
                                showConfirmPassword ? (
                                    <EyeOff
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-blue-600"
                                        onClick={() => setShowConfirmPassword(false)}
                                    />
                                ) : (
                                    <Eye
                                        size={20}
                                        className="cursor-pointer text-gray-500 hover:text-blue-600"
                                        onClick={() => setShowConfirmPassword(true)}
                                    />
                                )
                            }
                        />

                        {error && (
                            <div className="md:col-span-2 text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={loading}
                            className={`md:col-span-2 w-full rounded-lg py-3 font-semibold text-white ${loading
                                ? "bg-blue-400 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Signing up..." : "Sign Up"}
                        </button>
                    </form>

                    {/* Login Link */}
                    <p className="mt-3 text-sm text-white">
                        Already have an account?{" "}
                        <Link to="/" className="text-blue-300 hover:underline">
                            Login
                        </Link>
                    </p>

                    {/* Social Login */}
                    <div className="mt-8 text-center">
                        <p className="mb-4 text-sm text-white">Or continue with</p>

                        <div className="flex flex-col items-center gap-3">
                            {/* Google Button */}
                            <div className="w-full max-w-[320px] flex justify-center">
                                <GoogleLogin
                                    onSuccess={handleGoogleSuccess}
                                    onError={handleGoogleError}
                                    width="320"
                                    logo_alignment="center"
                                    text="signin"
                                />
                            </div>

                            {/* Facebook Button */}
                            <button
                                onClick={handleFacebookLogin}
                                type="button"
                                className="w-full max-w-[320px] h-[40px] flex items-center justify-center gap-2 rounded-lg bg-[#1877F2] px-5 text-white transition hover:opacity-90"
                            >
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="currentColor"
                                    className="h-5 w-5"
                                >
                                    <path d="M24 12.073C24 5.405 18.627 0 12 0S0 5.405 0 12.073c0 6.019 4.388 11.009 10.125 11.927v-8.437H7.078v-3.49h3.047V9.413c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953h-1.514c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.49h-2.796V24C19.612 23.082 24 18.092 24 12.073z" />
                                </svg>
                                Sign in
                            </button>
                        </div>
                    </div>

                    {/* Form Here */}
                </div>

            </div>
        </div>
    );
}

export default Register;