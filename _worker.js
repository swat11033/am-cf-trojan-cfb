import { connect } from 'cloudflare:sockets';
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === '/sock') {
      try {
        const sock = connect({ hostname: 'time.is', port: 443 });
        const writer = sock.writable.getWriter();
        await writer.write(new Uint8Array([22,3,3,0,32]));
        const reader = sock.readable.getReader();
        const { value } = await reader.read();
        writer.close().catch(()=>{});
        return new Response('SOCKET_OK bytes=' + (value ? value.length : 0), {status:200});
      } catch(e) {
        return new Response('SOCKET_ERR ' + e.message, {status:500});
      }
    }
    return new Response('PAGES_OK', {status:200});
  }
}
