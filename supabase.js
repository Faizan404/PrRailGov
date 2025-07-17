// Supabase Client Configuration
import { createClient } from 'https://cdn.skypack.dev/@supabase/supabase-js';
console.log('supabase.js loaded', createClient);


// Replace these with your actual Supabase URL and anon key
const supabaseUrl = 'https://wbqumxtskgjmbhowaazn.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndicXVteHRza2dqbWJob3dhYXpuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2MTc0MjIsImV4cCI6MjA2ODE5MzQyMn0.obEW-zi8XtyzkHUKJLtWyQx01dwhUn0-LQxpqGDDi7s';

// Initialize the Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('supabase', supabase);


// User authentication functions
async function signIn(username, password) {
    try {
        // Query the users table to find a matching username/password
        const { data, error } = await supabase
            .from('employees')
            .select('*')
            .eq('username', username)
            .single();

        console.log('Query result:', data);
        
        if (error) throw error;
        
        // Check if user exists and password matches
        if (data && Object.keys(data).length > 0 && data.password === password) {
            return { success: true, user: { username: data.username } };
        } else {
            return { success: false, message: 'Invalid username or password' };
        }
    } catch (error) {
        console.error('Error signing in:', error);
        return { success: false, message: 'An error occurred during sign in' };
    }
}

// Function to get all users
async function getAllUsers() {
    try {
        const { data, error } = await supabase
            .from('employees')
            .select('*');
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching users:', error);
        return { success: false, message: 'Failed to fetch users' };
    }
}

// Auto-execute function to get all users when this module loads
(async function loadUsers() {
    console.log('Loading users from database...');
    const result = await getAllUsers();
    if (result.success) {
        console.log('Users loaded successfully:', result.data);
    } else {
        console.error('Failed to load users:', result.message);
    }
})();

// Schedule management functions
async function getSchedules(routeKey = null) {
    try {
        let {data, error} = await supabase.from('schedules').select('*').eq('route', routeKey);
        console.log(data, 'DATA');
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error fetching schedules:', error);
        return { success: false, message: 'Failed to fetch schedules' };
    }
}

async function addSchedule(scheduleData) {
    try {
        const { data, error } = await supabase
            .from('schedules')
            .insert([scheduleData]);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error adding schedule:', error);
        return { success: false, message: 'Failed to add schedule' };
    }
}

async function updateSchedule(id, scheduleData) {
    try {
        const { data, error } = await supabase
            .from('schedules')
            .update(scheduleData)
            .eq('id', id);
        
        if (error) throw error;
        return { success: true, data };
    } catch (error) {
        console.error('Error updating schedule:', error);
        return { success: false, message: 'Failed to update schedule' };
    }
}

async function deleteSchedule(id, route = null, train_number = null) {
    try {
        console.log("Delete parameters:", { id, route, train_number });
        
        let {data, error} = await supabase
            .from('schedules')
            .delete()
            .eq('id', id);
    
        console.log(data, 'DELETE DATA');
        
        if (error) throw error;
        return { success: true, data }; // Add this line back to return success property
    } catch (error) {
        console.error('Error deleting schedule:', error);
        return { success: false, message: 'Failed to delete schedule: ' + error.message };
    }
}

export { 
    supabase, 
    signIn, 
    getAllUsers,
    getSchedules, 
    addSchedule, 
    updateSchedule, 
    deleteSchedule 
}; 