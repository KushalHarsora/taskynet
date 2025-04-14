import React from 'react'
import { Task } from './lib/types';
import axios, { AxiosResponse } from 'axios';
import { domain } from './lib/consts';
import { useNavigate } from 'react-router-dom';
import TaskTable from './components/table/task-table';
import { Button } from './components/ui/button';
import { toast } from 'sonner';

const Dashboard = () => {

    const router = useNavigate();
    const [task, setTasks] = React.useState<Task[]>([]);

    React.useEffect(() => {
        const getTasks = async () => {
            try {
                const email = window.localStorage.getItem("email");
                const response = await axios.get(`${domain}/api/task/${email}`, {
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                const data = response.data;
                if (response.status === 200) {
                    setTasks(data.tasks);
                } else {
                    console.error("Error fetching tasks:", data.message);
                }
            } catch (error) {
                console.error("Error fetching tasks:", error);
            }
        }

        getTasks();
    }, []);

    React.useEffect(() => {
        const name = window.localStorage.getItem("name");
        if (!name) router("/login");
    });

    const handleLogout = async () => {
        try {
            const response: AxiosResponse = await axios.post(`${domain}/api/auth/logout`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });

            const data = response.data;

            if (response.status === 200) {
                window.localStorage.removeItem("name");
                window.localStorage.removeItem("email");
                toast.success(data.message || "Logged out successfully", {
                    style: {
                        "backgroundColor": "#D5F5E3",
                        "color": "black",
                        "border": "none"
                    },
                    duration: 1500
                });
                router('/login');
            }
        } catch (error) {
            if (axios.isAxiosError(error) && error.response) {
                const data = error.response;
                if (data.status === 500) {
                    toast.error("An unexpected error occurred. Please try again.", {
                        style: {
                            "backgroundColor": "#FADBD8",
                            "color": "black",
                            "border": "none"
                        },
                        duration: 2500
                    });
                }
            }
        }
    }

    return (
        <React.Fragment>
            <main className="min-h-screen w-full flex flex-col bg-gray-100 px-6 py-8 overflow-x-hidden">
                {/* Header */}
                <div className="flex justify-between items-center bg-white shadow-md px-8 py-4 rounded-md mb-6 sticky top-0 z-10">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-800 underline decoration-wavy decoration-gray-400">
                        TaskyNet
                    </h1>
                    <Button variant="destructive" onClick={handleLogout}>
                        Sign Out
                    </Button>
                </div>

                {/* Task Table */}
                <div className="w-full max-w-7xl mx-auto">
                    <TaskTable data={task} />
                </div>
            </main>
        </React.Fragment>
    )
}

export default Dashboard