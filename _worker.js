import { connect } from 'cloudflare:sockets';
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.searchParams.get('h') || 'time.is';
    const port = parseInt(url.searchParams.get('p') || '443');
    if (url.pathname === '/tls') {
      try {
        const sock = connect({ hostname: host, port: port });
        const writer = sock.writable.getWriter();
        // 标准 TLS 1.3 ClientHello (SNI=time.is, 通用)
        const ch = new Uint8Array([22,3,1,0,137,1,0,0,133,3,3,39,83,16,105,161,77,15,201,153,126,241,79,36,21,129,23,133,152,236,141,77,26,168,35,217,209,225,106,0,0,4,0,51,0,47,0,41,0,35,0,23,0,20,0,19,0,0,255,1,0,1,0,0,10,0,8,0,6,0,29,0,25,0,24,0,11,0,2,1,0,0,16,0,14,0,12,2,104,50,0,48,0,46,0,43,0,42,0,9,0,8,0,10,0,7,0,6,0,4,0,5,0,4,0,3,0,2,0,1,0,0,49,0,11,0,9,0,0,7,116,105,109,101,46,105,115]);
        await writer.write(ch);
        const reader = sock.readable.getReader();
        const { value } = await reader.read();
        writer.close().catch(()=>{});
        return new Response('TLS_OK host='+host+' bytes=' + (value ? value.length : 0) + ' head=' + (value?Array.from(value.slice(0,3)).join(','):''), {status:200});
      } catch(e) {
        return new Response('TLS_ERR host='+host+' ' + e.message, {status:500});
      }
    }
    return new Response('OK', {status:200});
  }
}
