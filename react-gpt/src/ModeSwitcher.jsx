import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form"

function ModeSwitcher() {
    const [theme, setTheme] = useState(() => {
        const osThemePreference = (window.matchMedia('(prefers-color-scheme: dark)').matches) ? "dark" : "light";
        return localStorage.getItem("theme") || osThemePreference;
    });

    useEffect(() => {
        document.documentElement.setAttribute('data-bs-theme', theme);
        localStorage.setItem("theme", theme);
    }, [theme])

    function handleToggleTheme() {
        setTheme(currentTheme => (currentTheme === 'light' ? 'dark' : 'light'));
    }

    return (
        <div className="mode-switcher">
            <div
                className="mode-switcher-header fs-1 mt-3 text-center">
                    {(theme === "dark") ? "Dark Mode" : "Light Mode"}
            </div>

            <div
                className="mode-switcher-body d-flex flex-column align-items-center rounded-4 mt-4 shadow border p-4">
                
                <img
                    src="/Globe_Icon.png"
                    className="mode-switcher-body-icon p-4"
                    alt=""
                    style={{width: "200px", height: "200px"}}></img>

                <div
                    className="mode-switcher-body-language d-flex justify-content-center mx-3 border rounded-4 shadow">
                        <p className="p-2 text-body fs-4 text-center m-0">English (US)</p>
                </div>

                <div
                    className="mode-switcher-body-settings-panel mt-4 fs-5">
                    <p className="fw-bold">Settings</p>
                    <ul className="list-group">
                        <li className="list-group-item">Display & Brightness</li>
                        <li className="list-group-item">Notifications</li>
                        <li className="list-group-item">Privacy</li>
                        <li className="list-group-item">Language</li>
                        <li className="list-group-item d-flex justify-content-between">
                            Dark Mode
                            <Form.Check
                                type="switch"
                                id="switch-mode-toggle"
                                onChange={ handleToggleTheme }
                                checked={theme === "dark"} />
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    )
}

export default ModeSwitcher;