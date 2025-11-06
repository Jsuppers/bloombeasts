/**
 * Logger
 *
 * Simple logging system with configurable log levels.
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
}

class LoggerClass {
  private config: LoggerConfig = {
    level: LogLevel.INFO,
    timestamps: true,
  };

  /**
   * Configure the logger
   */
  configure(config: Partial<LoggerConfig>): void {
    this.config = { ...this.config, ...config };
  }

  /**
   * Set log level
   */
  setLevel(level: LogLevel): void {
    this.config.level = level;
  }

  /**
   * Get current log level
   */
  getLevel(): LogLevel {
    return this.config.level;
  }

  /**
   * Format log message with timestamp and prefix
   */
  private format(level: string, message: string): string {
    const parts: string[] = [];

    if (this.config.timestamps) {
      const timestamp = new Date().toISOString();
      parts.push(`[${timestamp}]`);
    }

    parts.push(`[${level}]`);

    if (this.config.prefix) {
      parts.push(`[${this.config.prefix}]`);
    }

    parts.push(message);

    return parts.join(' ');
  }

  /**
   * Log debug message
   */
  debug(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.DEBUG) {
      const formatted = this.format('DEBUG', message);
      console.log(formatted, ...data);
    }
  }

  /**
   * Log info message
   */
  info(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.INFO) {
      const formatted = this.format('INFO', message);
      console.log(formatted, ...data);
    }
  }

  /**
   * Log warning message
   */
  warn(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.WARN) {
      const formatted = this.format('WARN', message);
      console.warn(formatted, ...data);
    }
  }

  /**
   * Log error message
   */
  error(message: string, ...data: any[]): void {
    if (this.config.level <= LogLevel.ERROR) {
      const formatted = this.format('ERROR', message);
      console.error(formatted, ...data);
    }
  }
}

// Export singleton instance
export const Logger = new LoggerClass();

// Set default log level
Logger.setLevel(LogLevel.DEBUG);
