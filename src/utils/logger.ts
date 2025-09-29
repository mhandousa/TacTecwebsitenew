type LogLevel = 'debug' | 'info' | 'warn' | 'error';

interface LoggerConfig {
  enableInProduction?: boolean;
  minLevel?: LogLevel;
}

class Logger {
  private config: LoggerConfig;
  private levels: Record<LogLevel, number> = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
  };

  constructor(config: LoggerConfig = {}) {
    this.config = {
      enableInProduction: false,
      minLevel: 'debug',
      ...config,
    };
  }

  private shouldLog(level: LogLevel): boolean {
    if (process.env.NODE_ENV === 'production' && !this.config.enableInProduction) {
      return level === 'error' || level === 'warn';
    }
    return this.levels[level] >= this.levels[this.config.minLevel || 'debug'];
  }

  private formatMessage(level: LogLevel, message: string, ...args: any[]): string {
    const timestamp = new Date().toISOString();
    const prefix = `[${timestamp}] [${level.toUpperCase()}]`;
    return `${prefix} ${message}`;
  }

  debug(message: string, ...args: any[]): void {
    if (this.shouldLog('debug')) {
      console.log(this.formatMessage('debug', message), ...args);
    }
  }

  info(message: string, ...args: any[]): void {
    if (this.shouldLog('info')) {
      console.info(this.formatMessage('info', message), ...args);
    }
  }

  warn(message: string, ...args: any[]): void {
    if (this.shouldLog('warn')) {
      console.warn(this.formatMessage('warn', message), ...args);
    }
  }

  error(message: string, ...args: any[]): void {
    if (this.shouldLog('error')) {
      console.error(this.formatMessage('error', message), ...args);
    }
  }
}

// Export singleton instance
export const logger = new Logger({
  enableInProduction: false,
  minLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
});

// Export for custom configurations
export { Logger };
