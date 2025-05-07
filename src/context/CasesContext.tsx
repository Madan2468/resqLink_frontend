import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';
import { useAuth } from './AuthContext';

interface Case {
  _id: string;
  user: string;
  title?: string;
  description?: string;
  photo: string;
  location?: {
    lat: number;
    lng: number;
    address?: string;
  };
  urgency: 'low' | 'medium' | 'high';
  status: 'pending' | 'in-progress' | 'resolved';
  createdAt: string;
}

interface CaseFormData {
  title: string;
  description: string;
  photo: File;
  location: {
    lat: number;
    lng: number;
    address?: string;
  };
  urgency: 'low' | 'medium' | 'high';
}

interface CasesContextType {
  cases: Case[];
  userCases: Case[];
  loading: boolean;
  error: string | null;
  getCases: () => Promise<void>;
  getUserCases: () => Promise<void>;
  getCaseById: (id: string) => Promise<Case>;
  createCase: (caseData: CaseFormData) => Promise<Case>;
  updateCaseStatus: (id: string, status: 'pending' | 'in-progress' | 'resolved') => Promise<Case>;
}

interface CasesProviderProps {
  children: ReactNode;
}

const API_URL = 'https://resqlink-backend-owxa.onrender.com';

const CasesContext = createContext<CasesContextType | undefined>(undefined);

export const useCases = () => {
  const context = useContext(CasesContext);
  if (context === undefined) {
    throw new Error('useCases must be used within a CasesProvider');
  }
  return context;
};

export const CasesProvider: React.FC<CasesProviderProps> = ({ children }) => {
  const [cases, setCases] = useState<Case[]>([]);
  const [userCases, setUserCases] = useState<Case[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const { isAuthenticated, token } = useAuth();

  const getCases = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/cases`);
      setCases(res.data);
    } catch (err) {
      setError('Failed to fetch cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getUserCases = async () => {
    if (!isAuthenticated) return;
    
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/cases/user`);
      setUserCases(res.data);
    } catch (err) {
      setError('Failed to fetch user cases');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getCaseById = async (id: string): Promise<Case> => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/cases/${id}`);
      return res.data;
    } catch (err) {
      setError('Failed to fetch case details');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createCase = async (caseData: CaseFormData): Promise<Case> => {
    setLoading(true);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append('title', caseData.title);
      formData.append('description', caseData.description);
      formData.append('photo', caseData.photo);
      formData.append('location', JSON.stringify(caseData.location));
      formData.append('urgency', caseData.urgency);
      
      const res = await axios.post(`${API_URL}/api/cases`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${token}`
        }
      });
      
      // Add the new case to the cases array
      setCases(prevCases => [...prevCases, res.data]);
      setUserCases(prevCases => [...prevCases, res.data]);
      
      return res.data;
    } catch (err) {
      setError('Failed to create case');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateCaseStatus = async (id: string, status: 'pending' | 'in-progress' | 'resolved'): Promise<Case> => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await axios.patch(`${API_URL}/api/cases/${id}`, { status });
      
      // Update the case in the cases array
      setCases(prevCases => 
        prevCases.map(c => c._id === id ? { ...c, status } : c)
      );
      
      // Update the case in the userCases array if it exists there
      setUserCases(prevCases => 
        prevCases.map(c => c._id === id ? { ...c, status } : c)
      );
      
      return res.data;
    } catch (err) {
      setError('Failed to update case status');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };
  
  // Fetch initial cases data when the component mounts
  useEffect(() => {
    getCases();
    if (isAuthenticated) {
      getUserCases();
    }
  }, [isAuthenticated]);

  return (
    <CasesContext.Provider
      value={{
        cases,
        userCases,
        loading,
        error,
        getCases,
        getUserCases,
        getCaseById,
        createCase,
        updateCaseStatus
      }}
    >
      {children}
    </CasesContext.Provider>
  );
};