// foundry types that this project uses but don't match up with foundry-vtt-types
// due to version mismatch etc

declare global {
  var CONFIG: Config;

  namespace foundry {
    namespace utils {
      declare function throttle<T extends (...args: any[]) => unknown>(
        callback: T,
        delay: number
      ): (...args: Parameters<T>) => void;
    }
  }
}

export default global;
