import { supabase } from '../lib/supabase';

/**
 * Register a new user with Supabase Auth
 * @param {Object} userData - User data (name, email, password)
 * @returns {Object} Result object with success status and message
 */
export const registerUser = async (userData) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
      options: {
        data: {
          name: userData.name,
        },
      },
    });

    if (error) throw error;

    // The trigger will handle profile creation
    return {
      success: true,
      message:
        'Registration successful! Please check your email to verify your account.',
      user: data.user,
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message || 'Failed to register user',
    };
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
    let { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, create it
    if (profileError || !profile) {
      console.log('Profile not found, creating new profile...');
      const { data: newProfile, error: createError } = await supabase
        .from('profiles')
        .insert({
          id: user.id,
          name: user.user_metadata?.name || user.email,
          email: user.email,
          games_played: 0,
          total_score: 0,
          highest_score: 0,
        })
        .select()
        .single();

      if (createError) {
        console.error('Error creating profile:', createError);
        // Return default profile if creation fails
        profile = {
          id: user.id,
          name: user.user_metadata?.name || user.email,
          email: user.email,
          games_played: 0,
          total_score: 0,
          highest_score: 0,
        };
      } else {
        profile = newProfile;
      }
    }

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
