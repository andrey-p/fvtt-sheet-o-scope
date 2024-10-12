enum SocketAction {
  Reattach = 'reattach',
  Refresh = 'refresh',

  // for checking whether the secondary window is still open
  Ping = 'ping',
  PingAck = 'pingAck',

  // dev mode only, to make logging in the secondary window
  // less dependent on having 2 devtools open
  Log = 'log'
}

export default SocketAction;
