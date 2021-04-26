import CRC from 'crc';
import struct from 'python-struct';
import type { SocketConnectOpts } from 'net';
import { Socket } from 'net';

const MAP = {
  ON: 0xff00,
  OFF: 0x0000,
  UP: 0x0016,
  DOWN: 0x0017,
  UP_STATUS: 0x0018,
  DOWN_STATUS: 0x0019,
};

const STATUS_MAP = {
  '00': 'OFF',
  '01': 'ON',
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
function connect(host: string, port: number, command: Buffer) {
  const socket = new Socket();
  const options = {
    host,
    port,
  };

  socket.on('connect', () => {
    socket.write(command);
  });

  socket.on('error', console.error);
  socket.on('data', (data) => {
    console.log('data', data);
  });

  socket.connect(options);
}

function up(host: string, port: number) {
  connect(host, port, createControlCommand(MAP.UP, MAP.OFF));
  connect(host, port, createControlCommand(MAP.UP, MAP.ON));
}
function down(host: string, port: number) {
  connect(host, port, createControlCommand(MAP.DOWN, MAP.OFF));
  connect(host, port, createControlCommand(MAP.DOWN, MAP.ON));
}
function query(host: string, port: number) {
  const upStatus = connect(host, port, createReadCommand(MAP.UP_STATUS, 1));
  const downStatus = connect(host, port, createReadCommand(MAP.DOWN_STATUS, 1));
}
export const readCoils = (
  scope: { host: string; port: number },
  coilValue: { start: number; count: number },
  cb: (result: any) => void,
  err: (error: any) => void,
) => {
  const socket = new Socket();

  const options: SocketConnectOpts = {
    ...scope,
  };

  try {
    socket.on('connect', () => {
      // socket.write(command);
    });

    socket.on('error', (...error) => {
      console.error(...error);
      err(...error);
    });
    socket.connect(options);
  } catch (e) {
    console.log(e);
  }
};

export const writeSingleCoil = (
  scope: { host: string; port: number },
  coilValue: { address: number; value: boolean | 0 | 1 },
  cb: (value: any) => void,
  err: (error: any) => void,
) => {
  const socket = new Socket();

  const options: SocketConnectOpts = {
    ...scope,
  };

  socket.on('connect', () => {});

  socket.on('error', (...error) => {
    console.error(...error);
    err(...error);
  });
  socket.connect(options);
};
