import { React, useEffect, useState } from "react";
import '../Assets/Styles/Register.css'
import user from '../Assets/Images/user.png'
import username from '../Assets/Images/username.png'
import unlock from '../Assets/Images/unlock.png'
import { Link, useNavigate } from "react-router-dom";
import { validPassword, validNames, validUsername } from "./Regex";
import { bgImg, InputField, inputField, signUpBgVideo } from "../utils/utils"
import { GoogleLogin } from '@react-oauth/google'
import { jwtDecode } from 'jwt-decode'
import { signUpBgImage } from "../utils/utils"
import { User, Lock } from "lucide-react";
import { registerApi } from "../api/auth/authApi";

const FACEBOOK_APP_ID = process.env.REACT_APP_FACEBOOK_APP_ID;

const Register = () => {
    const [signupData, setSignupData] = useState({
        id: "",
        firstname: "",
        lastname: "",
        username: "",
        password: "",
        users: [],
        confirmpassword: ""
    });

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

        // VALIDATIONS

        if (
            !signupData.firstname ||
            !signupData.lastname ||
            !signupData.username ||
            !signupData.password ||
            !signupData.confirmpassword
        ) {
            setError('Fill all the details!');
            return;
        }

        if (
            validNames.test(signupData.firstname) ||
            validNames.test(signupData.lastname)
        ) {
            setError(
                'Firstname or lastname is invalid!'
            );
            return;
        }

        if (
            validUsername.test(
                signupData.username
            )
        ) {
            setError('Username is invalid!');
            return;
        }

        if (
            !validPassword.test(
                signupData.password
            )
        ) {
            setError('Password is invalid');
            return;
        }

        if (
            signupData.password !==
            signupData.confirmpassword
        ) {
            setError(
                'Passwords do not match'
            );
            return;
        }

        // API PAYLOAD

        const payload = {
            name: `${signupData.firstname} ${signupData.lastname}`,
            email: signupData.username,
            password: signupData.password,
        };

        // API CALL

        const response =
            await registerApi(payload);

        console.log(
            'REGISTER RESPONSE:',
            response
        );

        alert('User registered successfully');

        navigate('/');

    } catch (error) {

        console.log(error);

        setError(
            error.response?.data?.message ||
            error.message
        );
    }
};

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
                <div className="flex w-full max-w-5xl overflow-hidden rounded-3xl shadow-2xl">

                    {/* Left Image */}
                    <div className="hidden md:block md:w-1/2">
                        <img
                            src={bgImg}
                            alt="Register"
                            className="h-full w-full object-cover"
                        />
                    </div>

                    {/* Right Form */}
                    <div className="w-full md:w-1/2 bg-white/10 backdrop-blur-md p-8 sm:p-10">
                        <h1 className="text-3xl font-bold text-white mb-6">Register</h1>

                        <form onSubmit={handleSubmit} className="space-y-4">

                            {/* First Name */}
                            <InputField
                                placeholder="First Name"
                                name="firstname"
                                value={signupData.firstname}
                                onChange={handleChange}
                            />

                            {/* Last Name */}
                            <InputField
                                placeholder="Last Name"
                                name="lastname"
                                value={signupData.lastname}
                                onChange={handleChange}
                            />

                            {/* Username */}
                            <InputField
                                placeholder="Username"
                                name="username"
                                value={signupData.username}
                                onChange={handleChange}
                            />

                            {/* Password */}
                            <InputField
                                type="password"
                                placeholder="Password"
                                name="password"
                                value={signupData.password}
                                onChange={handleChange}
                            />

                            {/* Confirm Password */}
                            <InputField
                                type="password"
                                placeholder="Confirm Password"
                                name="confirmpassword"
                                value={signupData.confirmpassword}
                                onChange={handleChange}
                            />

                            {/* Error */}
                            {error && (
                                <div className="text-red-300 text-sm">{error}</div>
                            )}

                            {/* Button */}
                            <button
                                type="submit"
                                className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700"
                            >
                                Sign up
                            </button>
                        </form>

                        {/* Login Link */}
                        <p className="mt-5 text-sm text-white">
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
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Register;