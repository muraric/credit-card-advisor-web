export const saveAuth = (token: string, email: string) => {
    if (typeof window === "undefined") return;
    localStorage.setItem("token", token);
    localStorage.setItem("email", email);
    document.cookie = `token=${token}; path=/`;
};

export const getAuth = () => {
    if (typeof window === "undefined") return { token: null, email: null };
    const token = localStorage.getItem("token");
    const email = localStorage.getItem("email");
    return { token, email };
};

export const clearAuth = () => {
    if (typeof window === "undefined") return;
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    document.cookie = "token=; Max-Age=0; path=/";
};
