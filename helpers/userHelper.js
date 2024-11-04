// exports.comparePassword = (password, confirmPassword) => {};

// authHelpers.js
const bcrypt = require("bcrypt");
const saltRounds = 10; // Define the number of salt rounds for hashing

// Function to hash a plain text password
const hashPassword = async (plainPassword) => {
  try {
    // bcrypt.hash hashes the plain password with the specified number of salt rounds
    return await bcrypt.hash(plainPassword, saltRounds);
  } catch (error) {
    console.error("Error hashing password:", error);
    throw new Error("Password hashing failed");
  }
};

// Function to compare plain text password with hashed password
const comparePassword = async (plainPassword, hashedPassword) => {
  try {
    return await bcrypt.compare(plainPassword, hashedPassword);
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};

// authHelpers.js

// Function to compare plain text password directly without hashing
const comparePasswordWithoutHashing = async (
  passwordEntered,
  databasePassword
) => {
  try {
    // Directly compare the entered password with the database password
    return passwordEntered === databasePassword; // returns true if they are equal, false otherwise
  } catch (error) {
    console.error("Error comparing passwords:", error);
    throw new Error("Password comparison failed");
  }
};

module.exports = {
  hashPassword,
  comparePassword,
  comparePasswordWithoutHashing,
};
