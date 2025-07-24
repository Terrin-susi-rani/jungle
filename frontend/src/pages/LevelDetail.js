import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Editor from '@monaco-editor/react';
import TestCaseChecklist from '../components/TestCaseChecklist';
import { motion, AnimatePresence } from 'framer-motion';

const LevelDetail = () => {
  const { id } = useParams();
  const { user, token, updateUser } = useAuth();
  const navigate = useNavigate();
  
  const [level, setLevel] = useState(null);
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [runResult, setRunResult] = useState(null);
  const [error, setError] = useState('');
  const [runMessage, setRunMessage] = useState('');

  const pyodideRef = useRef(null);

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  useEffect(() => {
    fetchLevel();
  }, [id]);

  // Load Pyodide on mount
  useEffect(() => {
    const loadPyodide = async () => {
      if (!window.loadPyodide) {
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/pyodide.js';
        script.onload = async () => {
          pyodideRef.current = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
        };
        document.body.appendChild(script);
      } else {
        pyodideRef.current = await window.loadPyodide({ indexURL: 'https://cdn.jsdelivr.net/pyodide/v0.24.1/full/' });
      }
    };
    loadPyodide();
  }, []);

  const fetchLevel = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/levels/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLevel(data.level);
        setCode(data.level.starterCode);
      } else {
        setError('Failed to load level');
      }
    } catch (error) {
      setError('Failed to load level');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setError('Please write some code before submitting');
      return;
    }
    setSubmitting(true);
    setError('');
    setResult(null);
    try {
      const response = await fetch(`${API_BASE_URL}/submissions/${id}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ code })
      });
      const data = await response.json();
      if (response.ok) {
        setResult(data);
        // If submission is correct, update user progress in AuthContext
        if (data.submission && data.submission.isCorrect && data.user) {
          updateUser(data.user);
        }
      } else {
        setError(data.message || 'Submission failed');
      }
    } catch (error) {
      setError('Failed to submit code');
    } finally {
      setSubmitting(false);
    }
  };

  const handleRun = async () => {
    setRunResult(null);
    setRunMessage('');
    if (!code.trim()) {
      setRunMessage('Please write some code before running.');
      return;
    }
    if (!pyodideRef.current) {
      setRunMessage('Pyodide is still loading. Please wait...');
      return;
    }
    try {
      let output = '';
      pyodideRef.current.setStdout({
        batched: (data) => { output += data; },
      });
      pyodideRef.current.setStderr({
        batched: (data) => { output += data; },
      });
      await pyodideRef.current.runPythonAsync(code);
      setRunMessage(output ? `Output:\n${output}` : 'No output.');
    } catch (err) {
      setRunMessage(`Error:\n${err}`);
    }
  };

  const handleEditorChange = (value) => {
    setCode(value);
  };

  // Add a function to handle back navigation (already at top, now also at bottom)
  const handleBack = () => navigate('/dashboard');

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-tech-900">
        <div className="text-tech-100 text-2xl font-inter">Loading challenge...</div>
      </div>
    );
  }

  if (error && !level) {
    return (
      <div className="bg-tech-800 text-tech-100 rounded-xl p-8 text-center shadow-tech">
        <div className="text-4xl mb-4">😔</div>
        <h2 className="text-2xl font-inter font-bold text-tech-100 mb-4">Challenge Not Found</h2>
        <p className="text-tech-200 mb-4">{error}</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="bg-accent-cyan hover:bg-accent-purple text-white px-6 py-2 rounded-lg font-inter"
        >
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <><div className="absolute left-3 top-17 z-50 mb-3">
  <button 
    onClick={handleBack} 
    className="bg-tech-700 hover:bg-tech-600 text-tech-100 px-6 py-2 rounded-lg font-inter shadow-tech transition-colors duration-200"
  >
    ← Back to Dashboard
  </button>
</div>
    <div className="flex flex-col md:flex-row gap-6 min-h-[70vh] bg-tech-900 p-4 rounded-xl shadow-tech relative mt-10">
      {/* Back Button and Description */}
     {/* Back Button - Positioned absolutely at the top-left with high z-index */}

      {/* Left: Editor */}
      <div className="flex-1 bg-tech-800 rounded-xl shadow-tech p-4 flex flex-col">
        <div className="mb-2">
          <h2 className="text-lg font-inter font-bold text-tech-100 mb-1">
            {level.title}
          </h2>
          <p className="text-tech-300 font-inter mb-4">{level.description}</p>
        </div>
        <div className="flex items-center justify-between mb-4">
          <div />
          <div className="flex gap-2">
            <button
              onClick={handleRun}
              disabled={submitting}
              className="bg-accent-cyan hover:bg-accent-purple text-white px-4 py-2 rounded-lg font-inter"
              type="button"
            >
              {submitting ? 'Running...' : 'Run'}
            </button>
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="bg-accent-purple hover:bg-accent-cyan text-white px-4 py-2 rounded-lg font-inter"
              type="button"
            >
              {submitting ? 'Submitting...' : 'Submit'}
            </button>
          </div>
        </div>
        <div className="flex-1 border-2 border-tech-700 rounded-lg overflow-hidden">
          <Editor
            height="400px"
            language="python"
            theme="vs-dark"
            value={code}
            onChange={handleEditorChange}
            options={{
              minimap: { enabled: false },
              fontSize: 15,
              fontFamily: 'JetBrains Mono',
              tabSize: 4,
              wordWrap: 'on',
              automaticLayout: true,
              scrollBeyondLastLine: false,
              lineNumbers: 'on',
              roundedSelection: false,
              scrollbar: {
                vertical: 'visible',
                horizontal: 'visible'
              }
            }}
          />
        </div>
      </div>
      {/* Right: Test Cases & Results */}
      <div className="w-full md:w-[400px] flex-shrink-0 bg-tech-800 rounded-xl shadow-tech p-4 flex flex-col gap-4">
        <div className="mb-2">
          <h3 className="text-md font-inter font-bold text-accent-cyan mb-2">Test Cases</h3>
          {level.testCases && level.testCases.length > 0 ? (
            <div className="space-y-2">
              {level.testCases.slice(0, 5).map((tc, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-tech-700 text-tech-100 p-2 rounded">
                  <span className="font-code text-xs">Input: {tc.input}</span>
                  <span className="font-code text-xs">Expected: {tc.expectedOutput}</span>
                </div>
              ))}
              {level.testCases.length > 5 && (
                <div className="text-tech-300 text-xs">...and {level.testCases.length - 5} more test cases</div>
              )}
            </div>
          ) : (
            <div className="text-tech-300 text-xs">No test cases defined.</div>
          )}
        </div>
        {/* Run Results (does not update progress) */}
        {runMessage && (
          <div className="bg-tech-700 rounded-lg p-4 text-accent-cyan font-bold mb-2 whitespace-pre-line">{runMessage}</div>
        )}
        <AnimatePresence>
        {runResult && (
          <motion.div className="bg-tech-700 rounded-lg p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <h4 className="text-accent-cyan font-bold mb-2">Run Results</h4>
            {runResult.submission.testResults && runResult.submission.testResults.length > 0 && (
              <TestCaseChecklist testResults={runResult.submission.testResults} />
            )}
            <div className={`p-2 rounded-lg mt-2 text-xs font-bold ${
              runResult.submission.isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {runResult.message}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
        {/* Results (Submit) */}
        <AnimatePresence>
        {result && (
          <motion.div className="bg-tech-700 rounded-lg p-4" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}>
            <h4 className="text-accent-purple font-bold mb-2">Submission Results</h4>
            {result.submission.testResults && result.submission.testResults.length > 0 && (
              <TestCaseChecklist testResults={result.submission.testResults} />
            )}
            <div className={`p-2 rounded-lg mt-2 text-xs font-bold ${
              result.submission.isCorrect 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              {result.submission.isCorrect ? 'Done! All test cases passed.' : result.message}
            </div>
          </motion.div>
        )}
        </AnimatePresence>
      </div>
      {/* Remove the back button at the bottom */}
    </div>
    </>
  );
};

export default LevelDetail; 