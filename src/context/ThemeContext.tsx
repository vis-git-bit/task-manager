import { createContext, useState, useEffect, type ReactNode } from "react";

type ThemeContextType = {
  theme: "light" | "dark";
  // function that returns nothing 
  toggleTheme: () => void  //takes nothing & returns nothing
};

// create context (usecontext will read from this)
export const ThemeContext = createContext<ThemeContextType | null>(null);

// provider
type ThemeProviderProps = {
  children: ReactNode;
};

// provider
export const ThemeProvider = ({ children }: ThemeProviderProps) => {

  // get logged in user
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  // unique key for every user
  const themeKey = user?.email
    ? `theme_${user.email}`
    : "theme_guest";

   const [theme, setTheme] = useState<"light" | "dark">(() => {
    const savedTheme = localStorage.getItem(themeKey);

     return savedTheme === "dark" ? "dark" : "light";
  });


  //    // whenever theme changes save it
  useEffect(() => {
    localStorage.setItem(themeKey, theme);

  }, [theme, themeKey]);

  const toggleTheme = () => {
    setTheme(prev => (prev === "light" ? "dark" : "light")); 
  };

  return (
    // providing value
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};