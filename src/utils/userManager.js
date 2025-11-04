// User management utilities for localStorage

const CURRENT_USER_KEY = 'triviaCurrentUser'
const USERS_KEY = 'triviaUsers'

/**
 * Get the currently logged-in user
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = () => {
  const userJson = localStorage.getItem(CURRENT_USER_KEY)
  return userJson ? JSON.parse(userJson) : null
}

/**
 * Save current user to localStorage
 * @param {Object} user - User object with name, email, etc.
 */
export const setCurrentUser = (user) => {
  localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
}

/**
 * Remove current user (logout)
 */
export const clearCurrentUser = () => {
  localStorage.removeItem(CURRENT_USER_KEY)
}

/**
 * Get all registered users
 * @returns {Array} Array of user objects
 */
export const getAllUsers = () => {
  const usersJson = localStorage.getItem(USERS_KEY)
  return usersJson ? JSON.parse(usersJson) : []
}

/**
 * Save all users to localStorage
 * @param {Array} users - Array of user objects
 */
const saveAllUsers = (users) => {
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

/**
 * Register a new user
 * @param {Object} userData - User data (name, email, password)
 * @returns {Object} Result object with success status and message
 */
export const registerUser = (userData) => {
  const users = getAllUsers()
  
  // Check if email already exists
  const existingUser = users.find(u => u.email.toLowerCase() === userData.email.toLowerCase())
  if (existingUser) {
    return { success: false, message: 'Email already registered' }
  }
  
  // Create new user
  const newUser = {
    id: Date.now().toString(),
    name: userData.name,
    email: userData.email.toLowerCase(),
    password: userData.password, // In production, this should be hashed
    createdAt: new Date().toISOString(),
    gamesPlayed: 0,
    totalScore: 0,
    highestScore: 0
  }
  
  users.push(newUser)
  saveAllUsers(users)
  
  return { success: true, message: 'Registration successful', user: newUser }
}

/**
 * Login user
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Result object with success status and user data
 */
export const loginUser = (email, password) => {
  const users = getAllUsers()
  const user = users.find(u => 
    u.email.toLowerCase() === email.toLowerCase() && 
    u.password === password
  )
  
  if (user) {
    setCurrentUser(user)
    return { success: true, message: 'Login successful', user }
  }
  
  return { success: false, message: 'Invalid email or password' }
}

/**
 * Update user stats after a game
 * @param {number} score - Score achieved in the game
 * @param {number} totalQuestions - Total questions in the game
 */
export const updateUserStats = (score, totalQuestions) => {
  const currentUser = getCurrentUser()
  if (!currentUser) return
  
  const users = getAllUsers()
  const userIndex = users.findIndex(u => u.id === currentUser.id)
  
  if (userIndex !== -1) {
    users[userIndex].gamesPlayed += 1
    users[userIndex].totalScore += score
    users[userIndex].highestScore = Math.max(users[userIndex].highestScore, score)
    users[userIndex].lastPlayed = new Date().toISOString()
    
    saveAllUsers(users)
    setCurrentUser(users[userIndex])
  }
}

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = () => {
  return getCurrentUser() !== null
}
