import { LANGUAGES, STATUS, DEFAULT_SUBMISSION_CONFIG, JUDGE0_ENDPOINTS } from '../constants';

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
      console.error('Judge0 submission error:', error);
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
      console.error('Judge0 get submission error:', error);
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
      console.error('Judge0 wait for submission error:', error);
      throw error;
    }
  }

  async runCode(options) {
    const submission = await this.createSubmission(options);
    return this.waitForSubmission(submission.token);
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
      console.error('Judge0 batch submission error:', error);
      throw error;
    }
  }

  processSubmissionResult(result) {
    if (!result) {
      return {
        isCorrect: false,
        status: STATUS.INTERNAL_ERROR.description,
        errorMessage: 'No result received from Judge0',
        executionTime: 0,
        memorySpace: 0,
        output: '',
        compileOutput: '',
      };
    }

    const statusId = result.status?.id;
    const statusDescription = Object.values(STATUS).find(s => s.id === statusId)?.description;
    const isCorrect = statusId === STATUS.ACCEPTED.id;

    return {
      isCorrect,
      status: statusDescription,
      errorMessage: result.stderr || result.message || null,
      executionTime: result.time || 0,
      memorySpace: result.memory || 0,
      output: result.stdout || '',
      compileOutput: result.compile_output || '',
      exitCode: result.exit_code,
      exitSignal: result.exit_signal,
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
      console.error('Judge0 get languages error:', error);
      return Object.values(LANGUAGES).map(lang => ({ id: lang.id, name: lang.name }));
    }
  }
}

export default new Judge0();