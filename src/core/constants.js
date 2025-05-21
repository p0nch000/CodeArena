// Judge0 
export const LANGUAGES = {
  JAVASCRIPT_NODE: {
    id: 63, // Judge0 ID for Node.js 12.14.0
    name: "JavaScript (Node.js 12.14.0)",
    extension: "js"
  },
  JAVASCRIPT_NODE_LATEST: {
    id: 93, // Judge0 ID for Node.js 22.08.0 (or latest available)
    name: "JavaScript (Node.js 22.08.0)",
    extension: "js"
  },
  PYTHON: {
    id: 71, // Judge0 ID for Python 3.8.1
    name: "Python (3.8.1)",
    extension: "py"
  },
  PYTHON_LATEST: {
    id: 92, // Judge0 ID for Python 3.12.5 (or latest available)
    name: "Python (3.12.5)",
    extension: "py"
  },
  CPP: {
    id: 54, // Judge0 ID for C++ (GCC 9.2.0)
    name: "C++ (GCC 9.2.0)",
    extension: "cpp"
  },
  CPP_LATEST: {
    id: 95, // Judge0 ID for C++ (GCC 14.1.0)
    name: "C++ (GCC 14.1.0)",
    extension: "cpp"
  }
};

export const STATUS = {
  IN_QUEUE: { id: 1, description: "In Queue" },
  PROCESSING: { id: 2, description: "Processing" },
  ACCEPTED: { id: 3, description: "Accepted" },
  WRONG_ANSWER: { id: 4, description: "Wrong Answer" },
  TIME_LIMIT_EXCEEDED: { id: 5, description: "Time Limit Exceeded" },
  COMPILATION_ERROR: { id: 6, description: "Compilation Error" },
  RUNTIME_ERROR_SIGSEGV: { id: 7, description: "Runtime Error (SIGSEGV)" },
  RUNTIME_ERROR_SIGXFSZ: { id: 8, description: "Runtime Error (SIGXFSZ)" },
  RUNTIME_ERROR_SIGFPE: { id: 9, description: "Runtime Error (SIGFPE)" },
  RUNTIME_ERROR_SIGABRT: { id: 10, description: "Runtime Error (SIGABRT)" },
  RUNTIME_ERROR_NZEC: { id: 11, description: "Runtime Error (NZEC)" },
  RUNTIME_ERROR_OTHER: { id: 12, description: "Runtime Error (Other)" },
  INTERNAL_ERROR: { id: 13, description: "Internal Error" },
  EXEC_FORMAT_ERROR: { id: 14, description: "Exec Format Error" },
};

export const DEFAULT_SUBMISSION_CONFIG = {
  cpu_time_limit: 2,
  cpu_extra_time: 0.5,
  wall_time_limit: 5,
  memory_limit: 128000, 
  stack_limit: 64000, 
  max_processes_and_or_threads: 30,
  enable_per_process_and_thread_time_limit: false,
  enable_per_process_and_thread_memory_limit: true,
  max_file_size: 1024, 
};

export const JUDGE0_ENDPOINTS = {
  SUBMISSIONS: '/submissions',
  SUBMISSIONS_BATCH: '/submissions/batch',
  LANGUAGES: '/languages',
  STATUSES: '/statuses',
};
