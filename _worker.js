export default {
  async fetch(request, env) {
    return new Response("PAGES_DEPLOY_OK", { status: 200 });
  }
}
