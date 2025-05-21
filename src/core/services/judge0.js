import { LANGUAGES, DEFAULT_SUBMISSION_CONFIG, JUDGE0_ENDPOINTS } from '../constants';
import axios from 'axios';

class Judge0 {
  constructor() {
    this.apiKey = process.env.JUDGE0_API_KEY;
    this.baseUrl = process.env.JUDGE0_API_URL || 'https://judge0-ce.p.rapidapi.com';
  }

  getHeaders(includeContentType = true) {
    const headers = {
      'X-RapidAPI-Key': this.apiKey,
    };
    if (includeContentType) {
      headers['Content-Type'] = 'application/json';
    }
    return headers;
  }

  async createSubmission({ sourceCode, languageId, stdin = '', expectedOutput = '', config = {} }) {
    try {
      if (!sourceCode) throw new Error('Source code is required');
      if (!languageId) throw new Error('Language ID is required');

      const payload = {
        source_code: sourceCode,
        language_id: languageId,
        stdin,
        expected_output: expectedOutput,
        ...DEFAULT_SUBMISSION_CONFIG,
        ...config
      };

      const response = await fetch(`${this.baseUrl}${JUDGE0_ENDPOINTS.SUBMISSIONS}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Judge0 API error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Judge0 submission error:', error.message);
      throw error;
    }
  }

  async getSubmission(token) {
    try {
      if (!token) throw new Error('Submission token is required');

      const response = await fetch(`${this.baseUrl}${JUDGE0_ENDPOINTS.SUBMISSIONS}/${token}`, {
        method: 'GET',
        headers: this.getHeaders(false)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Judge0 API error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Judge0 get submission error:', error.message);
      throw error;
    }
  }

  async waitForSubmission(token, interval = 1000, timeout = 30000) {
    try {
      if (!token) throw new Error('Submission token is required');

      const startTime = Date.now();
      
      while (Date.now() - startTime < timeout) {
        const submission = await this.getSubmission(token);
        if (submission.status && submission.status.id > 2) {
          return submission;
        }
      
        await new Promise(resolve => setTimeout(resolve, interval));
      }
      
      throw new Error('Submission timeout');
    } catch (error) {
      console.error('Judge0 wait for submission error:', error.message);
      throw error;
    }
  }

  async runCode({ sourceCode, languageId, stdin, expectedOutput, cpuTimeLimit = 5, memoryLimit = 128000, wallTimeLimit = 10 }) {
    try {
      const createResponse = await axios.post(
        `${this.baseUrl}/submissions`,
        {
          source_code: sourceCode,
          language_id: languageId,
          stdin: stdin,
          expected_output: expectedOutput,
          cpu_time_limit: cpuTimeLimit,
          memory_limit: memoryLimit,
          wall_time_limit: wallTimeLimit,
          enable_network: false
        },
        {
          headers: {
            'Content-Type': 'application/json',
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      const token = createResponse.data.token;
      
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const getResponse = await axios.get(
        `${this.baseUrl}/submissions/${token}?fields=status_id,stdout,stderr,compile_output,message,time,memory,expected_output,exit_code,status`,
        {
          headers: {
            'X-RapidAPI-Key': this.apiKey,
            'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
          }
        }
      );

      return getResponse.data;
    } catch (error) {
      throw new Error(`Judge0 API error: ${error.response?.data?.error || error.message}`);
    }
  }

  async createBatchSubmissions(submissions) {
    try {
      if (!Array.isArray(submissions) || submissions.length === 0) {
        throw new Error('Submissions array is required and must not be empty');
      }

      const payload = submissions.map(sub => ({
        source_code: sub.sourceCode,
        language_id: sub.languageId,
        stdin: sub.stdin || '',
        expected_output: sub.expectedOutput || '',
        ...DEFAULT_SUBMISSION_CONFIG,
        ...(sub.config || {})
      }));

      const response = await fetch(`${this.baseUrl}${JUDGE0_ENDPOINTS.SUBMISSIONS_BATCH}`, {
        method: 'POST',
        headers: this.getHeaders(),
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Judge0 API error: ${error.message || response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Judge0 batch submission error:', error.message);
      throw error;
    }
  }

  processSubmissionResult(submission) {
    // Status IDs: https://github.com/judge0/judge0/blob/master/docs/api/statuses.md
    const isAccepted = submission.status_id === 3; // Accepted
    const isWrongAnswer = submission.status_id === 4; // Wrong Answer
    
    let output = '';
    let errorMessage = '';
    
    if (submission.stdout) {
      output = submission.stdout.trim();
    }
    
    if (submission.stderr) {
      errorMessage = submission.stderr;
    } else if (submission.compile_output) {
      errorMessage = submission.compile_output;
    } else if (submission.message) {
      errorMessage = submission.message;
    } else if (isWrongAnswer) {
      errorMessage = 'Wrong answer';
    }
    
    return {
      isCorrect: isAccepted,
      output,
      errorMessage,
      executionTime: parseFloat(submission.time) || 0,
      memorySpace: parseInt(submission.memory) || 0,
      exitCode: submission.exit_code,
      status: submission.status?.description || 'Unknown'
    };
  }

  async getLanguages() {
    try {
      const response = await fetch(`${this.baseUrl}${JUDGE0_ENDPOINTS.LANGUAGES}`, {
        method: 'GET',
        headers: this.getHeaders(false)
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(`Judge0 API error: ${error.message || response.statusText}`);
      }
      return await response.json();
    } catch (error) {
      console.error('Judge0 get languages error:', error.message);
      return Object.values(LANGUAGES).map(lang => ({ id: lang.id, name: lang.name }));
    }
  }
}

const judge0Service = new Judge0();
export default judge0Service;