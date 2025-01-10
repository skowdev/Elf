import React from 'react';
import { motion } from 'framer-motion';

function Snowflake() {
  return (
    <motion.div
      className="snowflake"
      animate={{ y: "100vh", x: ["-20px", "20px"] }}
      transition={{ repeat: Infinity, duration: Math.random() * 5 + 5 }}
      style={{ left: Math.random() * 100 + "%" }}
    >
      ❄️
    </motion.div>
  );
}

export default Snowflake;
