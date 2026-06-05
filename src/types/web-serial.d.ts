// Web Serial API 타입 선언 (Chrome 전용)
interface SerialPort {
  open(options: { baudRate: number }): Promise<void>;
  close(): Promise<void>;
  readonly writable: WritableStream;
  readonly readable: ReadableStream;
}

interface Serial {
  requestPort(options?: object): Promise<SerialPort>;
  getPorts(): Promise<SerialPort[]>;
}

interface Navigator {
  readonly serial: Serial;
}
