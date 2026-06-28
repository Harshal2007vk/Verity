// Custom base44Client wrapper pointing to local Express API
// All base44.entities.* and base44.auth.* calls are forwarded to /api/

const API_BASE = '/api';

export const base44 = {
  entities: {
    Candidate: {
      list: async (sort = '') => {
        const res = await fetch(`${API_BASE}/candidates`);
        if (!res.ok) throw new Error('Failed to fetch candidates');
        return res.json();
      },
      create: async (data) => {
        const res = await fetch(`${API_BASE}/candidates`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create candidate');
        return res.json();
      },
      update: async (id, data) => {
        const res = await fetch(`${API_BASE}/candidates/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update candidate');
        return res.json();
      },
      delete: async (id) => {
        const res = await fetch(`${API_BASE}/candidates/${id}`, { method: 'DELETE' });
        if (!res.ok) throw new Error('Failed to delete candidate');
        return res.json();
      },
      get: async (id) => {
        const res = await fetch(`${API_BASE}/candidates`);
        const list = await res.json();
        return list.find((c) => c.id === id);
      },
      filter: async (query) => {
        const res = await fetch(`${API_BASE}/candidates`);
        const list = await res.json();
        if (!query) return list;
        return list.filter(c => Object.entries(query).every(([k, v]) => c[k] === v));
      }
    },
    Job: {
      list: async (sort = '') => {
        const res = await fetch(`${API_BASE}/jobs`);
        if (!res.ok) throw new Error('Failed to fetch jobs');
        return res.json();
      },
      get: async (id) => {
        const res = await fetch(`${API_BASE}/jobs`);
        const list = await res.json();
        return list.find((j) => j.id === id);
      },
      create: async (data) => {
        const res = await fetch(`${API_BASE}/jobs`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to create job');
        return res.json();
      },
      filter: async (query) => {
        const res = await fetch(`${API_BASE}/jobs`);
        const list = await res.json();
        if (!query) return list;
        return list.filter(j => Object.entries(query).every(([k, v]) => j[k] === v));
      }
    },
    RankingResult: {
      list: async (sort = '') => {
        // Fetch all rankings — no simple "list all" endpoint, returns empty
        return [];
      },
      filter: async (query) => {
        if (query && query.job_id) {
          const res = await fetch(`${API_BASE}/rankings/${query.job_id}`);
          if (!res.ok) throw new Error('Failed to fetch rankings');
          return res.json();
        }
        return [];
      },
      bulkCreate: async (rankingsArray) => {
        // Rankings are saved individually during the ranking POST call
        // This is a no-op because /api/rankings/rank-candidates already saves them
        return rankingsArray;
      },
      deleteMany: async (query) => {
        // No-op — backend upserts rankings on re-rank
        return { success: true };
      }
    }
  },
  integrations: {
    Core: {
      // InvokeLLM routes to our custom AI backend endpoint
      InvokeLLM: async ({ prompt, response_json_schema, model }) => {
        const res = await fetch(`${API_BASE}/ai/invoke-llm`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt, response_json_schema, model })
        });
        if (!res.ok) throw new Error('LLM invocation failed');
        return res.json();
      }
    }
  },
  auth: {
    // Called by AuthContext to get current user
    me: async () => ({ id: 'demo-user', email: 'demo@verity.ai', full_name: 'Demo User' }),

    // Called on app load to listen for auth state
    onAuthStateChanged: (cb) => {
      cb({ id: 'demo-user', email: 'demo@verity.ai', full_name: 'Demo User' });
      return () => {};
    },

    // Login.jsx: base44.auth.loginViaEmailPassword(email, password)
    loginViaEmailPassword: async (email, password) => {
      return { user: { id: 'demo-user', email }, access_token: 'demo-token' };
    },

    // Login.jsx / Register.jsx: base44.auth.loginWithProvider("google", "/")
    loginWithProvider: (provider, redirect) => {
      window.location.href = redirect || '/';
    },

    // Register.jsx: base44.auth.register({ email, password })
    register: async ({ email, password }) => {
      return { user: { id: 'demo-user', email } };
    },

    // Register.jsx: base44.auth.verifyOtp({ email, otpCode })
    verifyOtp: async ({ email, otpCode }) => {
      return { access_token: 'demo-token', user: { id: 'demo-user', email } };
    },

    // Register.jsx: base44.auth.resendOtp(email)
    resendOtp: async (email) => ({ success: true }),

    // Register.jsx: base44.auth.setToken(token)
    setToken: (token) => {},

    // ForgotPassword.jsx: base44.auth.resetPasswordRequest(email)
    resetPasswordRequest: async (email) => ({ success: true }),

    // ResetPassword.jsx: base44.auth.resetPassword({ resetToken, newPassword })
    resetPassword: async ({ resetToken, newPassword }) => ({ success: true }),

    // AuthContext / Sidebar: base44.auth.logout(redirect)
    logout: async (redirect) => {
      window.location.href = redirect || '/login';
    },

    // AuthContext: base44.auth.redirectToLogin(returnUrl)
    redirectToLogin: (returnUrl) => {
      window.location.href = '/login';
    },

    // Kept for backward compat
    login: async ({ email, password }) => ({ user: { id: 'demo-user', email } }),
    signOut: async () => { window.location.href = '/'; },
    sendPasswordResetEmail: async () => {},
    confirmPasswordReset: async () => {},
    session: { user: { id: 'demo-user', email: 'demo@verity.ai' } }
  }
};
