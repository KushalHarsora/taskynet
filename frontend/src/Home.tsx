import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from './components/ui/button';

const Home = () => {
  const router = useNavigate();

  return (
    <React.Fragment>
      <main className=' h-screen w-screen flex justify-center items-center overflow-hidden py-6'>
        <section className="h-screen w-screen overflow-hidden flex flex-row max-md:flex-col justify-center items-center bg-white dark:bg-[#1a1a1a] transition-all">
          <div className="h-full max-md:h-3/5 w-3/5 max-md:w-full flex flex-col justify-center items-center px-8">
            <h1 className="text-5xl max-md:text-3xl font-extrabold text-center mb-4 bg-black text-white px-4 py-2 rounded-md shadow-md">
              Organize Smarter. Work Better
            </h1>
            <p className="text-lg max-md:text-base text-center mb-6 text-gray-700 dark:text-gray-300 max-w-xl">
              Taskify helps teams and individuals stay organized with effortless task management, smart reminders, and a beautifully simple interface.
            </p>
            <Button
              className="px-8 py-3.5 h-fit w-fit cursor-pointer border border-black dark:border-white hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition"
              onClick={() => router("/login")}
            >
              Join TaskyNet
            </Button>
          </div>

          <div className="h-full max-md:h-fit w-2/5 max-md:w-screen flex justify-center items-center pb-[7.5vh] max-md:pb-[5vh]">
            <video
              src="/assets/home.mp4"
              height={300}
              width={500}
              className=" max-md:w-4/5"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
        </section>
      </main>
    </React.Fragment>
  );
};

export default Home;
