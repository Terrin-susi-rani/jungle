import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Editor from '@monaco-editor/react';

const AdminCreateLevel = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    difficulty: 'beginner',
    starterCode: '# Write your Python code here\nprint("Hello, World!")',
    expectedOutput: '',
    points: 10,
    order: 1,
    hints: [],
    testCases: []
  });
  
  const [newHint, setNewHint] = useState('');
  const [newTestCase, setNewTestCase] = useState({ input: '', expectedOutput: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleEditorChange = (value) => {
    setFormData({
      ...formData,
      starterCode: value
    });
  };

  const addHint = () => {
    if (newHint.trim()) {
      setFormData({
        ...formData,
        hints: [...formData.hints, newHint.trim()]
      });
      setNewHint('');
    }
  };

  const removeHint = (index) => {
    setFormData({
      ...formData,
      hints: formData.hints.filter((_, i) => i !== index)
    });
  };

  const addTestCase = () => {
    if (newTestCase.input.trim() && newTestCase.expectedOutput.trim()) {
      setFormData({
        ...formData,
        testCases: [...formData.testCases, newTestCase]
      });
      setNewTestCase({ input: '', expectedOutput: '' });
    }
  };
  const removeTestCase = (index) => {
    setFormData({
      ...formData,
      testCases: formData.testCases.filter((_, i) => i !== index)
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Validation
    if (!formData.title || !formData.description || !formData.expectedOutput) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE_URL}/levels`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('Level created successfully!');
        setTimeout(() => {
          navigate('/admin/levels');
        }, 2000);
      } else {
        setError(data.message || 'Failed to create level');
      }
    } catch (error) {
      setError('Failed to create level');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-tech-900 py-8">
      <div className="backdrop-blur-md bg-tech-800/70 border border-tech-400 rounded-2xl shadow-tech max-w-3xl w-full space-y-8 p-8">
        {/* Header */}
        <div className="text-center mb-4">
          <div className="text-4xl mb-2 text-accent-cyan">🚀</div>
          <h1 className="text-3xl font-inter font-bold text-tech-100 mb-1">
            Create New Challenge
          </h1>
          <p className="text-tech-300 font-inter">
            Design a new Python coding challenge for students
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              {success}
            </div>
          )}

          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="title" className="block text-sm font-inter font-medium text-tech-200 mb-1">
                Title *
              </label>
              <input
                id="title"
                name="title"
                type="text"
                required
                value={formData.title}
                onChange={handleChange}
                className="tech-input w-full"
                placeholder="Enter challenge title"
              />
            </div>
            <div>
              <label htmlFor="difficulty" className="block text-sm font-inter font-medium text-tech-200 mb-1">
                Difficulty
              </label>
              <select
                id="difficulty"
                name="difficulty"
                value={formData.difficulty}
                onChange={handleChange}
                className="tech-input w-full"
              >
                <option value="beginner">Beginner</option>
                <option value="intermediate">Intermediate</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
            <div>
              <label htmlFor="points" className="block text-sm font-inter font-medium text-tech-200 mb-1">
                Points
              </label>
              <input
                id="points"
                name="points"
                type="number"
                min="1"
                value={formData.points}
                onChange={handleChange}
                className="tech-input w-full"
              />
            </div>
            <div>
              <label htmlFor="order" className="block text-sm font-inter font-medium text-tech-200 mb-1">
                Order
              </label>
              <input
                id="order"
                name="order"
                type="number"
                min="1"
                value={formData.order}
                onChange={handleChange}
                className="tech-input w-full"
              />
            </div>
          </div>

          <div>
            <label htmlFor="description" className="block text-sm font-inter font-medium text-tech-200 mb-1">
              Description *
            </label>
            <textarea
              id="description"
              name="description"
              required
              rows="3"
              value={formData.description}
              onChange={handleChange}
              className="tech-input w-full"
              placeholder="Describe the challenge and what students need to accomplish"
            />
          </div>

          <div>
            <label htmlFor="expectedOutput" className="block text-sm font-inter font-medium text-tech-200 mb-1">
              Expected Output *
            </label>
            <input
              id="expectedOutput"
              name="expectedOutput"
              type="text"
              required
              value={formData.expectedOutput}
              onChange={handleChange}
              className="tech-input w-full"
              placeholder="What should the code output when correct?"
            />
          </div>

          {/* Starter Code */}
          <div>
            <label className="block text-sm font-inter font-medium text-tech-200 mb-1">
              Starter Code
            </label>
            <div className="border-2 border-tech-400 rounded-lg overflow-hidden">
              <Editor
                height="200px"
                language="python"
                theme="vs-dark"
                value={formData.starterCode}
                onChange={handleEditorChange}
                options={{
                  minimap: { enabled: false },
                  fontSize: 14,
                  tabSize: 4,
                  wordWrap: 'on',
                  automaticLayout: true,
                  scrollBeyondLastLine: false,
                  lineNumbers: 'on'
                }}
              />
            </div>
          </div>

          {/* Hints */}
          <div>
            <label className="block text-sm font-inter font-medium text-tech-200 mb-1">
              Hints (Optional)
            </label>
            <div className="flex gap-2 mb-4">
              <input
                type="text"
                value={newHint}
                onChange={(e) => setNewHint(e.target.value)}
                className="tech-input flex-1"
                placeholder="Add a helpful hint"
                onKeyPress={(e) => e.key === 'Enter' && addHint()}
              />
              <button
                type="button"
                onClick={addHint}
                className="tech-button px-4 py-2"
              >
                Add Hint
              </button>
            </div>
            {formData.hints.length > 0 && (
              <div className="space-y-2">
                {formData.hints.map((hint, index) => (
                  <div key={index} className="flex items-center justify-between bg-tech-700 text-tech-100 p-3 rounded-lg">
                    <span>{hint}</span>
                    <button
                      type="button"
                      onClick={() => removeHint(index)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Test Cases */}
          <div>
            <label className="block text-sm font-inter font-medium text-tech-200 mb-1">
              Test Cases
            </label>
            <div className="flex flex-col gap-2 mb-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <input
                  type="text"
                  value={newTestCase.input}
                  onChange={e => setNewTestCase({ ...newTestCase, input: e.target.value })}
                  className="tech-input"
                  placeholder="Test case input (e.g. 1, 2)"
                />
                <input
                  type="text"
                  value={newTestCase.expectedOutput}
                  onChange={e => setNewTestCase({ ...newTestCase, expectedOutput: e.target.value })}
                  className="tech-input"
                  placeholder="Expected output (e.g. 3)"
                />
              </div>
              <button
                type="button"
                onClick={addTestCase}
                className="tech-button px-4 py-2 w-fit"
              >
                Add Test Case
              </button>
            </div>
            {formData.testCases.length > 0 && (
              <div className="space-y-2">
                {formData.testCases.map((tc, idx) => (
                  <div key={idx} className="flex flex-col md:flex-row gap-2 bg-tech-700 text-tech-100 p-3 rounded-lg items-center justify-between">
                    <div className="flex-1">
                      <div className="font-bold text-tech-200">Test Case {idx + 1}</div>
                      <div className="text-xs font-code text-tech-300"><span className="font-semibold">Input:</span> {tc.input}</div>
                      <div className="text-xs font-code text-tech-300"><span className="font-semibold">Expected Output:</span> {tc.expectedOutput}</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeTestCase(idx)}
                      className="text-red-400 hover:text-red-600"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-between gap-4">
            <button
              type="button"
              onClick={() => navigate('/admin/levels')}
              className="bg-tech-700 hover:bg-tech-600 text-tech-100 px-6 py-3 rounded-lg font-inter shadow-tech"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="tech-button px-6 py-3"
            >
              {loading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Creating...
                </div>
              ) : (
                'Create Challenge'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdminCreateLevel; 