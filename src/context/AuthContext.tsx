import { createContext, useContext, useState, useEffect, type ReactNode } from "react";  //ReactNode = rendereable react content    

type User = {  // Type for user object fields
     id: string;
    name: string;
    email: string;
    password: string;
    role?: string;
};

type AuthContextType = {  // Type for all auth context data/functions
    user: User | null;
    role: string | null;
    token: string | null;  
    loading: boolean;
    login: (userData: User, userRole: string, userToken: string) => void;
    logout: () => void;
};

// creating context
const AuthContext = createContext<AuthContextType | null>(null); 

// custom hook
export const useAuth = () => {
    const context = useContext(AuthContext); 

     if (!context) {  //If context is missing
        throw new Error( "useAuth must be used inside AuthProvider" );  // Stops execution with custom error 
    }
    return context;  //return auth context data back
};
 
type AuthProviderProps = {   
    children: ReactNode;  
};

// provider component 
export const AuthProvider = ({ children }: AuthProviderProps) => {  
    // globalstate (these stores current login data)  

    const [user, setUser] = useState<User | null>(null);
    const [role, setRole] = useState<string | null>(null);
    const [token, setToken] = useState<string | null>(null); 

    const [loading, setLoading] = useState(true);   //loading state is true till the data loads

    useEffect(() => {
        // load from localstorage when app starts
        const StoredUser = JSON.parse(localStorage.getItem("user") || "null");
        const StoredRole = localStorage.getItem("role");
        const StoredToken = localStorage.getItem("token");

        if (StoredUser) setUser(StoredUser);
        if (StoredRole) setRole(StoredRole);
        if (StoredToken) setToken(StoredToken);

        setLoading(false);  //lodig false after data loads
    }, []);

    // login fn.
    const login = (userData: User, userRole: string, userToken: string) => {
        setUser(userData);
        setRole(userRole);
        setToken(userToken);

        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("role", userRole);
        localStorage.setItem("token", userToken);
    };

    // logout fn.
    const logout = () => {
        setUser(null);
        setRole(null);
        setToken(null);

        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("token"); 
    };

// creating a object to share globally bcz Provider can pass only ONE value prop
    const value: AuthContextType = {
        user,
        role,
        token,
        loading,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>
          {/* rendering all child components inside provider */}
            {children} 
        </AuthContext.Provider>
    );
};