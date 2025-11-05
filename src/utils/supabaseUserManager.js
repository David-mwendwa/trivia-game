import { supabase } from '../lib/supabase';

/**
 * Register a new user with Supabase Auth
 * @param {Object} userData - User data (name, email, password)
 * @returns {Object} Result object with success status and message
 */
export const registerUser = async (userData) => {
  try {
    console.log('Attempting to register user:', {
      email: userData.email,
      name: userData.name,
    });

    // 1. Register user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: userData.email.trim().toLowerCase(),
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    });

    console.log('Supabase auth response:', { authData, authError });

    if (authError) {
      console.error('Auth error:', authError);
      return { success: false, message: authError.message };
    }

    // 2. Create profile record
    if (authData.user) {
      const { error: profileError } = await supabase.from('profiles').insert({
        id: authData.user.id,
        name: userData.name,
        email: userData.email,
        games_played: 0,
        total_score: 0,
        highest_score: 0,
      });

      if (profileError) {
        console.error('Profile creation error:', profileError);
        // Auth user was created but profile failed - this is okay, we can handle it later
      }
    }

    return {
      success: true,
      message:
        'Registration successful! Please check your email to verify your account.',
      user: authData.user,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Login user with Supabase Auth
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Object} Result object with success status and user data
 */
export const loginUser = async (email, password) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return { success: false, message: error.message };
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', data.user.id)
      .single();

    return {
      success: true,
      message: 'Login successful',
      user: data.user,
      profile,
    };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Get the currently logged-in user
 * @returns {Object|null} User object or null if not logged in
 */
export const getCurrentUser = async () => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) return null;

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    return { user, profile };
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};

/**
 * Logout user
 */
export const logoutUser = async () => {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      return { success: false, message: error.message };
    }
    return { success: true, message: 'Logged out successfully' };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Update user stats after a game
 * @param {string} userId - User ID
 * @param {number} score - Score achieved in the game
 * @param {number} totalQuestions - Total questions in the game
 */
export const updateUserStats = async (userId, score, totalQuestions) => {
  try {
    // Get current stats
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('games_played, total_score, highest_score')
      .eq('id', userId)
      .single();

    if (!currentProfile) return;

    // Calculate new stats
    const newGamesPlayed = currentProfile.games_played + 1;
    const newTotalScore = currentProfile.total_score + score;
    const newHighestScore = Math.max(currentProfile.highest_score, score);

    // Update profile
    const { error } = await supabase
      .from('profiles')
      .update({
        games_played: newGamesPlayed,
        total_score: newTotalScore,
        highest_score: newHighestScore,
        updated_at: new Date().toISOString(),
      })
      .eq('id', userId);

    if (error) {
      console.error('Error updating user stats:', error);
    }
  } catch (error) {
    console.error('Error updating user stats:', error);
  }
};

/**
 * Check if user is logged in
 * @returns {boolean}
 */
export const isLoggedIn = async () => {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return !!user;
};
