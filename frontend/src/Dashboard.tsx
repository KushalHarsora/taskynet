import React from 'react'
import { Task } from './lib/types';
import axios from 'axios';
import { domain } from './lib/consts';
import { useNavigate } from 'react-router-dom';
import TaskTable from './components/table/task-table';

const Dashboard = () => {

    const router = useNavigate();
    const [task, setTasks] = React.useState<Task []>([]);

    React.useEffect(() => {
        const getTasks = async () => {
            try {
                const response = await axios.get(`${domain}/api/tasks`, {
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

  return (
    <React.Fragment>
        <main className=' h-screen w-screen flex justify-center items-center overflow-hidden px-28'>
            <h1 className=' absolute top-[5vh] text-center text-4xl font-bold underline decoration-wavy decoration-gray-400'>TaskyNet</h1>
            <TaskTable data={task} />
        </main>
    </React.Fragment>
  )
}

export default Dashboard