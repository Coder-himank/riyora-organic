import { useContext } from "react";
import { ThemeContext } from "@/components/themeContext";

const ThemeSwitcher = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);

    return (
        <select
            value={theme}
            onChange={(e) => toggleTheme(e.target.value)}>
            <option value="organic">Organic Theme</option>
            <option value="dark">Dark Theme</option>
            <option value="Oceanic">Oceanic Theme</option>
        </select>
    );
};

export default ThemeSwitcher;
