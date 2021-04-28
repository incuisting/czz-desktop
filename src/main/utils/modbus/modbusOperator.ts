import CRC from 'crc';
import struct from 'python-struct';
import type { SocketConnectOpts } from 'net';
import { Socket } from 'net';

export const CONTROL: Record<string, number> = {
  ON: 0xff00,
  OFF: 0x0000,
  UP: 0x0016,
  DOWN: 0x0017,
  UP_STATUS: 0x0018,
  DOWN_STATUS: 0x0019,
};

export const STATUS_MAP: Record<string, boolean> = {
  '00': false,
  '01': true,
};

export const createControlCommand = (addr: number, value: number): Buffer => {
  const msgNotCrc = struct.pack('!BBHH', 0x1, 0x5, addr, value);
  const msgCrc = CRC.crc16modbus(msgNotCrc);
  const msgCrcPack = struct.pack('<H', msgCrc);
  const combine = Buffer.concat([msgNotCrc, msgCrcPack]);
  return combine;
};
export const createReadCommand = (
  startAddr: number,
  readNumber: number,
): Buffer => {
  const msgWithoutCrc = struct.pack('!BBHH', 0x1, 0x1, startAddr, readNumber);
  const crc_val = CRC.crc16modbus(msgWithoutCrc);
  const crcPack = struct.pack('<H', crc_val);
  const combine = Buffer.concat([msgWithoutCrc, crcPack]);
  return combine;
};
export function connect(
  connectInfo: {
    host: string;
    port: number;
  },
  command: Buffer,
  cb: (result: any) => void,
  err: (error: any) => void,
) {
  const socket = new Socket();
  const options: SocketConnectOpts = {
    ...connectInfo,
  };

  socket.on('connect', () => {
    socket.write(command);
  });

  socket.on('error', (error) => {
    console.error(error);
    err(error);
    socket.end();
  });
  socket.on('data', (data) => {
    console.log('data', data);
    cb(data);
    socket.end();
  });

  socket.connect(options);
}
export function parseRead(readBuf: Buffer): boolean {
  const read = readBuf.readUInt16BE(2);
  const status_code = Buffer.from([read]).toString('hex');
  return STATUS_MAP[status_code];
}
