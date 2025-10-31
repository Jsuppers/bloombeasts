/**
 * Logger
 *
 * Professional logging system with configurable log levels.
 * Replaces console.log statements throughout the codebase.
 */

export enum LogLevel {
  DEBUG = 0,
  INFO = 1,
  WARN = 2,
  ERROR = 3,
  NONE = 4,
}

export interface LoggerConfig {
  level: LogLevel;
  prefix?: string;
  timestamps?: boolean;
  colors?: boolean;
}

class LoggerClass {
  private config: LoggerConfig = {
    level: LogLevel.INFO,
    timestamps: true,
    colors: true,
  };

  /**
   * Configure the logger
   * @param config Logger configuration
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Set log level
   * @param level The minimum log level to display
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Get current log level
   * @returns Current log level
   */
  getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * Format log message with timestamp and prefix
   */
  private format(level: string, message: string, prefix?: string): string {
    const parts: string[] = [];

    if (this.config.timestamps) {
      const timestamp = new Date().toISOString();
      parts.push(`[${timestamp}]`);
    }

    parts.push(`[${level}]`);

    if (prefix || this.config.prefix) {
      parts.push(`[${prefix || this.config.prefix}]`);
    }

    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Log debug message
   * @param message Message to log
   * @param data Optional data to log
   */
  debug(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.DEBUG) {
      const formatted = this.format('DEBUG', message);
      console.log(formatted, ...data);
    }
  }

  /**
   * Log info message
   * @param message Message to log
   * @param data Optional data to log
   */
  info(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.INFO) {
      const formatted = this.format('INFO', message);
      console.log(formatted, ...data);
    }
  }

  /**
   * Log warning message
   * @param message Message to log
   * @param data Optional data to log
   */
  warn(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.WARN) {
      const formatted = this.format('WARN', message);
      console.warn(formatted, ...data);
    }
  }

  /**
   * Log error message
   * @param message Message to log
   * @param data Optional data to log
   */
  error(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.ERROR) {
      const formatted = this.format('ERROR', message);
      console.error(formatted, ...data);
    }
  }

  /**
   * Create a child logger with a specific prefix
   * @param prefix Prefix for all logs from this logger
   * @returns New logger instance with prefix
   */
  child(prefix: string): ChildLogger {
    return new ChildLogger(this, prefix);
  }

  private timers: Map<string, number> = new Map();

  /**
   * Group related logs together (simplified for basic console support)
   * @param label Group label
   * @param collapsed Whether group should be collapsed by default (ignored)
   */
  group(label: string, collapsed: boolean = false): void {
    if (this.config.level <= LogLevel.INFO) {
      const formatted = this.format('GROUP', `>>> ${label}`);
      console.log(formatted);
    }
  }

  /**
   * End a log group (simplified for basic console support)
   */
  groupEnd(): void {
    if (this.config.level <= LogLevel.INFO) {
      const formatted = this.format('GROUP', `<<<`);
      console.log(formatted);
    }
  }

  /**
   * Log a table (simplified for basic console support)
   * @param data Data to display as table
   */
  table(data: any): void {
    if (this.config.level <= LogLevel.INFO) {
      const formatted = this.format('TABLE', JSON.stringify(data, null, 2));
      console.log(formatted);
    }
  }

  /**
   * Start a performance timer
   * @param label Timer label
   */
  time(label: string): void {
    if (this.config.level <= LogLevel.DEBUG) {
      this.timers.set(label, Date.now());
      const formatted = this.format('TIMER', `${label}: started`);
      console.log(formatted);
    }
  }

  /**
   * End a performance timer and log the result
   * @param label Timer label
   */
  timeEnd(label: string): void {
    if (this.config.level <= LogLevel.DEBUG) {
      const startTime = this.timers.get(label);
      if (startTime) {
        const duration = Date.now() - startTime;
        this.timers.delete(label);
        const formatted = this.format('TIMER', `${label}: ${duration}ms`);
        console.log(formatted);
      }
    }
  }

  /**
   * Assert a condition and log error if false
   * @param condition Condition to check
   * @param message Error message if condition is false
   */
  assert(condition: boolean, message: string): void {
    if (this.config.level <= LogLevel.ERROR) {
      if (!condition) {
        const formatted = this.format('ASSERT', message);
        console.error(formatted);
      }
    }
  }
}

/**
 * Child logger with a specific prefix
 */
class ChildLogger {
  constructor(
    private parent: LoggerClass,
    private prefix: string
  ) {}

  debug(message: string, ...data: any[]): void {
    this.parent.debug(`[${this.prefix}] ${message}`, ...data);
  }

  info(message: string, ...data: any[]): void {
    this.parent.info(`[${this.prefix}] ${message}`, ...data);
  }

  warn(message: string, ...data: any[]): void {
    this.parent.warn(`[${this.prefix}] ${message}`, ...data);
  }

  error(message: string, ...data: any[]): void {
    this.parent.error(`[${this.prefix}] ${message}`, ...data);
  }

  group(label: string, collapsed?: boolean): void {
    this.parent.group(`[${this.prefix}] ${label}`, collapsed);
  }

  groupEnd(): void {
    this.parent.groupEnd();
  }

  table(data: any): void {
    this.parent.table(data);
  }

  time(label: string): void {
    this.parent.time(`[${this.prefix}] ${label}`);
  }

  timeEnd(label: string): void {
    this.parent.timeEnd(`[${this.prefix}] ${label}`);
  }
}

// Export singleton instance
export const Logger = new LoggerClass();

// Configure based on environment
// if (typeof process !== 'undefined' && process.env) {
//   const env = 'development';

//   if (env === 'production') {
//     Logger.setLevel(LogLevel.WARN);
//   } else if (env === 'test') {
//     Logger.setLevel(LogLevel.ERROR);
//   } else {
    Logger.setLevel(LogLevel.DEBUG);
//   }
// }
