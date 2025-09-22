// lib/auth.ts

export const saveAuth = (token: string, email: string) => {
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);

    // also save token in a cookie for middleware
    document.cookie = `token=${token}; path=/`;
};

export const getAuth = () => {
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    return { token, email };
};

export const clearAuth = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");

    // clear cookie
    document.cookie = "token=; Max-Age=0; path=/";
};
