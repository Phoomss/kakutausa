import http from './http-common'

const login = (loginData) => {
    if (!loginData.emailOrUsername) {
        throw new Error('Email or username is required');
    }

    const isEmail = loginData.emailOrUsername.includes('@');

    const payload = {
        login: loginData.emailOrUsername,
        password: loginData.password
    }

    if (isEmail) {
        payload.email = loginData.emailOrUsername
    } else {
        payload.username = loginData.emailOrUsername
    }

    return http.post('/api/auth/login', payload, { withCredentials: true })
}

const authService = { login }

export default authService