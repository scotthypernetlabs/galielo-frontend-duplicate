export class Logger {
  public log_level: boolean;
  constructor(log_level: boolean = false){
    this.log_level = log_level;
  }
  log(...args: any[]){
    if(this.log_level){
      const chromeRegex = new RegExp('^\\s*?at\\s*(\\S*?)\\s')
        const firefoxRegex = new RegExp('^\\s*(\\S*?)@\\S*\\/(\\S*)\\.')
        let stackframe = (new Error()).stack.split('\n')
        let match = chromeRegex.exec(stackframe[2])
        let callee = match ? match[1] : null;
        if (!callee) { // try firefox
          match = firefoxRegex.exec(stackframe[1])
          callee = match ? `${match[2]}.${match[1]}` : ''
        }
        console.log(`${callee}`, ...args);
    }
  }
  setLogLevel(log_level:boolean){
    this.log_level = log_level;
  }
}

export const logService = new Logger(true);
window.logger = logService;
