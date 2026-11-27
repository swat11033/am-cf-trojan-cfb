import { connect } from 'cloudflare:sockets';
export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const host = url.searchParams.get('h') || 'time.is';
    if (url.pathname === '/sock') {
      try {
        const sock = connect({ hostname: host, port: 443 });
        const reader = sock.readable.getReader();
        const { value } = await reader.read();
        sock.close().catch(()=>{});
        return new Response('SOCKET_OK host='+host+' firstbytes=' + (value ? Array.from(value.slice(0,5)).join(',') : 'none'), {status:200});
      } catch(e) {
        return new Response('SOCKET_ERR host='+host+' ' + e.message, {status:500});
      }
    }
    return new Response('PAGES_OK', {status:200});
  }
}
