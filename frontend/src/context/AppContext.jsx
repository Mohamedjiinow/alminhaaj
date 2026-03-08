import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const backendUrl = "http://localhost:3000";

    // --- STATES-KA ---
    const [token, setToken] = useState(localStorage.getItem('token') || "");
    const [userData, setUserData] = useState(() => {
        const savedUser = localStorage.getItem('user');
        return savedUser ? JSON.parse(savedUser) : null;
    });

    const [students, setStudents] = useState([]);
    const [teachers, setTeachers] = useState([]); // Waa inuu jiraa state-kan
    const [subjects, setSubjects] = useState([]);
    const [loading, setLoading] = useState(false);

    // --- FUNCTIONS-KA ---

    const getStudents = async () => {
        if (!token) return; 
        try {
            const { data } = await axios.get(`${backendUrl}/api/student/list`, { headers: { token } });
            if (data.success) setStudents(data.data);
        } catch (error) {
            if (error.response?.status === 401) logout();
        }
    };

    const getTeachers = async () => {
        if (!token || userData?.role !== 'admin') return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/user/teachers`, { headers: { token } });
            if (data.success) {
                setTeachers(data.teachers);
            }
        } catch (error) {
            console.log("Error fetching teachers:", error.message);
        }
    };

    const getSubjects = async () => {
        if (!token) return;
        try {
            const { data } = await axios.get(`${backendUrl}/api/subject/list`, { headers: { token } });
            if (data.success) setSubjects(data.data);
        } catch (error) {
            console.log("Maaddooyinka lama soo heli karo");
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setToken("");
        setUserData(null);
        setStudents([]);
        setTeachers([]); // Hadda ma crash-garaynayo maadaama aan kor ku soo qeexnay
        setSubjects([]);
        toast.info("Si guul leh ayaad uga baxday");
    };

    // --- USEEFFECT ---
    useEffect(() => {
        if (token) {
            getStudents();
            getSubjects();
            if (userData?.role === 'admin') {
                getTeachers();
            }
            localStorage.setItem('token', token);
        }
    }, [token, userData?.role]); 

    // --- VALUE-HA ---
    const value = {
        backendUrl, 
        token, 
        setToken, 
        userData, 
        setUserData,
        students, 
        getStudents, 
        teachers,      // Ku dar halkan
        getTeachers,   // Ku dar halkan
        subjects, 
        getSubjects,
        loading, 
        setLoading, 
        logout
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;