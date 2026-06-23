import '../Assets/Styles/Login.css'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { signUpBgVideo } from "../utils/utils"
import { User, Lock } from "lucide-react";
import { loginApi } from '../api/auth/authApi'
import { connectSocket } from '../socket/socket'

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

const Login = () => {
    const [loginData, setLoginData] = useState({
        email: '',
        password: ''
    })
    const [error, setError] = useState('')
    const [focusedField, setFocusedField] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isloggedIn')
        if (isLoggedIn === 'true') {
            navigate('/dashboard')
        }
    }, [navigate])

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

    const handleChange = (e) => {
        setError('')
        setLoginData({
            ...loginData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError('');

        try {

            if (
                !loginData.email ||
                !loginData.password
            ) {
                setError(
                    'Enter email and password'
                );
                return;
            }

            const payload = {
                email: loginData.email,
                password: loginData.password,
            };

            const response =
                await loginApi(payload);

            console.log(
                'LOGIN RESPONSE:',
                response
            );

            // 2FA CHECK

            if (
                response.user?.twoFactorRequired
            ) {

                navigate('/verify-otp', {
                    state: {
                        userId:
                            response?.user?.id,
                    },
                });

                return;
            }

            connectSocket(response?.accessToken || '');

            // STORE TOKEN

            localStorage.setItem(
                'accessToken',
                response?.accessToken
            );

            localStorage.setItem(
                'Currentuser',
                JSON.stringify(
                    response?.user
                )
            );

            localStorage.setItem(
                'isloggedIn',
                'true'
            );

            navigate('/dashboard');

        } catch (error) {

            console.log(error);

            setError(
                error.response?.data?.message ||
                'Invalid email or password'
            );
        }
    };

    console.log("LINE149", loginData);


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

    // const handleLogout = () => {
    //     if (window.FB) {
    //         window.FB.logout(() => {
    //         })
    //     }
    // }

    return (
        <div className="relative min-h-screen w-full overflow-hidden">
            {/* Single Full Page Background */}
            <video
                src={signUpBgVideo}
                autoPlay
                loop
                muted
                playsInline
                preload="auto"
                className="absolute inset-0 h-full w-full object-cover blur-md scale-110"
            />

            {/* Dark overlay for readability */}
            <div className="absolute inset-0 bg-black/20"></div>

            {/* Main centered layout */}
            <div className="relative z-10 flex min-h-screen items-center justify-center px-4 py-6">

                <div className="w-full max-w-md bg-white/10 backdrop-blur-md rounded-3xl shadow-2xl p-8 sm:p-10">

                    {/* Logo */}
                    <h1 className="text-center text-4xl font-extrabold text-white mb-2">
                        WhaleIQ
                    </h1>

                    {/* Page Title */}
                    <h2 className="text-center text-2xl font-bold text-white mb-6">
                        Login
                        {/* Change to Register in Register page */}
                    </h2>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div
                            className={`group flex items-center rounded-xl bg-white px-3 py-2 shadow-md transition-all duration-300 ${focusedField === "email"
                                ? "ring-2 ring-blue-500 shadow-blue-200/50"
                                : "hover:shadow-lg"
                                }`}
                        >
                            <div
                                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${focusedField === "email"
                                    ? "bg-blue-100 scale-110 -translate-y-1"
                                    : "bg-gray-100"
                                    }`}
                            >
                                <User
                                    size={20}
                                    className={`transition-all duration-300 ${focusedField === "email"
                                        ? "text-blue-600 scale-110"
                                        : "text-gray-500"
                                        }`}
                                />
                            </div>

                            <input
                                type="text"
                                name="email"
                                value={loginData.email}
                                placeholder="Enter email"
                                className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                                onFocus={() => setFocusedField("email")}
                                onBlur={() => setFocusedField("")}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Password */}
                        <div
                            className={`group flex items-center rounded-xl bg-white px-3 py-2 shadow-md transition-all duration-300 ${focusedField === "password"
                                ? "ring-2 ring-blue-500 shadow-blue-200/50"
                                : "hover:shadow-lg"
                                }`}
                        >
                            <div
                                className={`mr-3 flex h-10 w-10 items-center justify-center rounded-full transition-all duration-300 ${focusedField === "password"
                                    ? "bg-blue-100 scale-110 -translate-y-1"
                                    : "bg-gray-100"
                                    }`}
                            >
                                <Lock
                                    size={20}
                                    className={`transition-all duration-300 ${focusedField === "password"
                                        ? "text-blue-600 scale-110"
                                        : "text-gray-500"
                                        }`}
                                />
                            </div>

                            <input
                                type="password"
                                name="password"
                                value={loginData.password}
                                placeholder="Enter Password"
                                className="w-full bg-transparent text-gray-800 outline-none placeholder:text-gray-400"
                                onFocus={() => setFocusedField("password")}
                                onBlur={() => setFocusedField("")}
                                onChange={handleChange}
                            />
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="text-sm text-red-300">
                                {error}
                            </div>
                        )}

                        {/* Login Button */}
                        <button
                            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white transition hover:bg-blue-700"
                            type="submit"
                        >
                            Sign in
                        </button>
                    </form>

                    {/* Register Link */}
                    <div className="mt-5 text-sm text-white">
                        <p>
                            Don&apos;t have an account?{" "}
                            <Link
                                to="/register"
                                className="font-medium text-blue-300 hover:underline"
                            >
                                Register
                            </Link>
                        </p>
                    </div>

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
    )
}

export default Login