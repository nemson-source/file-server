const net = require('net');
const fs = require('fs');
const ping = require('ping');
const exec = require('child_process').exec;
const os = require('os');
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout
});

const responding = [];
const nonResponding = [];
const openPorts = {};

const getLocalIpAddress = () => {
  const ifaces = os.networkInterfaces();
  let ipAddress = '';
  Object.keys(ifaces).forEach((ifname) => {
    let alias = 0;
    ifaces[ifname].forEach((iface) => {
      if ('IPv4' !== iface.family || iface.internal !== false) {
        return;
      }
      if (alias >= 1) {
        console.log(ifname + ':' + alias, iface.address);
      } else {
        console.log(ifname, iface.address);
        ipAddress = iface.address;
      }
      alias++;
    });
  });
  return ipAddress;
};

console.log(`Local IP address: ${getLocalIpAddress()}`);
console.log('Enter the start IP address:');
readline.question('', (startIP) => {
  console.log('Enter the end IP address:');
  readline.question('', (endIP) => {
    console.log('Enter the start port:');
    readline.question('', (startPort) => {
      console.log('Enter the end port(puting in a larg number can cause them not to be writen in the file and console safe numer is 3000):');
      readline.question('', (endPort) => {
        scanPorts(startIP, endIP, startPort, endPort);
        readline.close();
      });
    });
  });
});

const scanPorts = (startIP, endIP, startPort, endPort) => {
  console.log('starting IP scan...')
  const startOctets = startIP.split('.');
  const endOctets = endIP.split('.');
  const startIPRange = parseInt(startOctets[3]);
  const endIPRange = parseInt(endOctets[3]);

  for (let i = startIPRange; i <= endIPRange; i++) {
    const host = `${startOctets[0]}.${startOctets[1]}.${startOctets[2]}.${i}`;

    ping.promise.probe(host)
      .then(res => {
        if (res.alive) {
          responding.push(`${res.host}: ${res.time} ms`);
          scanOpenPorts(res.host, startPort, endPort);
        } else {
          nonResponding.push(res.host);
        }

        if (responding.length + nonResponding.length === (endIPRange - startIPRange + 1)) {
          printResults();
          console.log('now pinging ')
        }
      });
  }
  console.log('IP scan complet')
  console.log('staring port scan...')
};

const scanOpenPorts = (ip, startPort, endPort) => {
  for (let port = startPort; port <= endPort; port++) {
    const socket = new net.Socket();

    socket.on('error', (err) => {
      socket.destroy();
    });

    socket.on('connect', () => {
      openPorts[ip] = openPorts[ip] || [];
      openPorts[ip].push({ port: port, function: getPortFunction(port) });
      socket.end();
    });

    socket.connect(port, ip);
  }
};

const getPortFunction = (port) => {
  switch (port) {
    case 1:
        return "TCPMUX";
    case 2:
        return "compressnet (Management Utility)";
    case 3:
        return "compressnet (Compression Process)";
      case 5:
        return "RJE";
      case 7:
        return "Echo";
      case 9:
        return "discard";
      case 11:
        return "systat";
      case 13:
        return "daytime";
      case 15:
        return "Previously netstat service"
      case 17:
        return "qotd";       
      case 18:
        return "msp";
      case 19:
        return "chargen";  
      case 20:
        return "FTP - Data";
      case 21:
        return "FTP - Control";
      case 22:
        return "SSH";
      case 23:
        return "Telnet";
      case 25:
        return "SMTP";
      case 29:
        return "MSG ICP";
      case 31:
        return "msg-auth";
      case 33:
        return "DSP";
      case 37:
        return "Time Protocol";
      case 39:
        return "RLP";
      case 41:
        return "graphics";
      case 42:
        return "Host Name Server Protocol";
      case 43:
        return "WHOIS";
      case 49:
        return "TACACS Login Host";
      case 50:
        return "re-mail-ck";  
      case 53:
        return "DNS";
      case 67:
        return "bootps";
      case 68:
        return "bootpc";    
      case 69:
        return "TFTP";
      case 70:
        return "Gopher";
      case 79:
        return "Finger";
      case 80:
        return "HTTP";
      case 88:
        return "kerberos";  
      case 101:
        return "hostname";
      case 102:
        return "Iso-tsap";  
      case 103:
        return "X.400 Standard";
      case 105:
        return "csnet-ns";
      case 107:
        return "rtelnet	";    
      case 108:
        return "SNA Gateway Access Server";
      case 109:
        return "POP2";
      case 110:
        return "POP3";
      case 111:
        return "sunrpc";
      case 113:
        return "auth";    
      case 115:
        return "SFTP";
      case 117:
        return "uucp-path";  
      case 118:
        return "SQL Services";
      case 119:
        return "NNTP";
      case 123:
        return "ntp";  
      case 135:
        return "RPC";    
      case 137:
        return "netbios-ns";
      case 138:
        return "netbios-dgm"  
      case 139:
        return "NetBIOS Datagram Service";
      case 143:
        return "IMAP";
      case 161:
        return "SNMP";
      case 162:
        return "snmptrap";
      case 177:
        return "xdmcp";    
      case 179:
        return "BGP";
      case 190:
        return "GACP";
      case 194:
        return "IRC";
      case 201:
        return "z39.50";
      case 213:
        return "ipx";    
      case 220:
        return "IMAP3";
      case 369:
        return "rpc2portmap";
      case 370:
        return "codaauth2"    
      case 389:
        return "LDAP";
      case 427:
        return "svrloc";  
      case 443:
        return "HTTPS";
      case 444:
        return "SNPP";
      case 445:
        return "Microsoft-DS";
      case 458:
        return "Apple QuickTime";
      case 515:
        return "printer";
      case 517:
        return "talk";
      case 518:
        return "ntalk"
      case 520:
        return "router";
      case 521:
        return "ripng";
      case 530:
        return "courier";
      case 531:
        return "conference";
      case 532:
        return "netnews";
      case 533:
        return "netwall";
      case 540:
        return "uucp";
      case 543:
        return "klogin";
      case 544:
        return "kshell";                          
      case 546:
        return "DHCPv6 Client";
      case 547:
        return "DHCPv6 Server";
      case 548:
        return "afpovertcp";
      case 554:
        return "rtsp";
      case 556:
        return "remotefs";  
      case 563:
        return "SNEWS";  
      case 569:
        return "MSN";
      case 587:
        return "submission";
      case 631:
        return "ipp";
      case 636:
        return "idaps";
      case 674:
        return "acap";
      case 694:
        return "ha-cluster";
      case 749:
        return "kerberos-adm";
      case 750:
        return "kerberos-iv";
      case 873:
        return "rsync";
      case 903:
        return "VMware ESXi";
      case 913:
        return "apex-edge";    
      case 992:
        return "telnets";
      case 993:
        return "imaps"
      case 995:
        return "pop3s"                      
      case 1080:
        return "Socks";
      case 1287:
        return "routematch";
      case 1288:
        return "navbuddy";
      case 1400:
        return "cadkey-tablet	";
      case 1410:
        return "hiq";
      case 1433:
        return "ms-sql-s";
      case 1434:
        return "ms-sql-m";
      case 1443:
        return "ies-lm";
      case 1494:
        return "ica";
      case 1512:
        return "wins";
      case 1524:
        return "ingreslock";
      case 1701:
        return "l2tp";
      case 1719:
        return "h323gatestat";
      case 1720:
        return "h323hostcall";
      case 1812:
        return "radius";
      case 1813:
        return "radius-acct";
      case 1843:
        return "netopia-vo5";
      case 1985:
        return "hsrp";
      case 2008:
        return "Teamspeak 3 Accounting (non officiel)";
      case 2010:
        return "Teamspeak 3 Weblist (non officiel)";
      case 2049:
        return "nfs";
      case 2102:
        return "zephyr-srv";
      case 2103:
        return "zephyr-clt";
      case 2104:
        return "zephyr-hm";
      case 2401:
        return "cvspserver";
      case 2809:
        return "corbaloc";
      case 3306:
        return "mysql";
      case 4321:
        return "rwhois";
      case 5999:
        return "cvsup";
      case 6000:
        return "X11";
      case 11371:
        return "pgpkeyserver";
      case 13720:
        return "bprd";
      case 13721:
        return "bpdbm";
      case 13724:
        return "vnetd";
      case 13782:
        return "bpcd";
      case 13783:
        return "vopied";
      case 22273:
        return "wnn6";
      case 23399:
        return "Skype (non officiel)";
      case 25565:
        return "Minecraft";
      case 26000:
        return "quake and other multiplayer games";
      case 27017:
        return "MongoDB";
      case 33434:
        return "traceroute";
      default:
        return "unknown";
  }
}

const printResults = () => {
  console.log('port scan complet')
  console.log('clearing files')
  console.log('writing to files')
  console.log(`Number of responding IP addresses: ${responding.length}`);
  fs.writeFileSync('responding.txt', responding.join('\n'));
  fs.writeFileSync('nonResponding.txt', nonResponding.join('\n'));
  fs.writeFileSync('openPorts.json', JSON.stringify(openPorts, null, 2));
  fs.appendFile('log.txt', `scan made at ${new Date()} number of responces: ${responding.length}\n\n`, (err) => {
    if (err) throw err;
  });
  console.log('scan is done results are in the folwoing files nonResponding.txt, responding.txt and openPorts.json')
  console.log(`these are the responding ip's`, responding)
  console.log(`these are the responding ip's with open ports`, openPorts)
  setTimeout(() => {
    console.log('opening files')
    exec('start responding.txt', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    });
    exec('start openPorts.json', (err, stdout, stderr) => {
      if (err) {
        console.log(err);
        return;
      }
      console.log(stdout);
    });
  }, 3000)
  setTimeout(() => {
    process.exit()
  }, 10000)
};
