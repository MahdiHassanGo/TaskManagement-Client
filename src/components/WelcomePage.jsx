import { motion } from "framer-motion";
import React from "react";
import { Link } from "react-router-dom";
import { AuroraBackground } from "../components/ui/aurora-background"; // Ensure the path is correct

const WelcomePage = () => {
  return (
    <AuroraBackground>
      <motion.div
        initial={{ opacity: 0.0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{
          delay: 0.3,
          duration: 0.8,
          ease: "easeInOut",
        }}
        className="relative flex flex-col gap-4 items-center justify-center px-4"
      >
        <h1 className="text-3xl md:text-7xl font-bold dark:text-white text-center">
          Welcome to the Task Management System
        </h1>
        <p className="font-extralight text-base md:text-4xl dark:text-neutral-200 py-4">
          Click Here to continue
        </p>
        <Link to="/auth/login">
          <button className="bg-black dark:bg-white rounded-full w-fit text-white dark:text-black px-4 py-2">
            Click Me
          </button>
        </Link>
      </motion.div>
    </AuroraBackground>
  );
};

export default WelcomePage;
