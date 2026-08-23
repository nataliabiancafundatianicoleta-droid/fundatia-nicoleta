const OLD='https://fundatia-nicoleta-82nskjqd8.vercel.app';
module.exports=async function handler(req,res){
  try{
    const p=String(req.query.path||'').replace(/^\/+/, '');
    const qs=new URL(req.url,'https://x.local').searchParams;
    qs.delete('path');
    const extra=qs.toString();
    const target=OLD+'/'+p+(extra?'?'+extra:'');
    const r=await fetch(target,{headers:{'user-agent':'Mozilla/5.0 Fundația-Nicoleta-Proxy'}});
    const ct=r.headers.get('content-type')||'application/octet-stream';
    res.status(r.status); res.setHeader('content-type',ct); res.setHeader('cache-control','public, max-age=0, s-maxage=300');
    if(ct.includes('text/html')){
      let t=await r.text();
      t=t.replaceAll('https://www.fundatianicoleta.eu','https://fundatianicoleta.ro').replaceAll('https://fundatianicoleta.eu','https://fundatianicoleta.ro');
      const canonical='https://fundatianicoleta.ro/'+p;
      if(!/rel=["']canonical["']/i.test(t)) t=t.replace(/<\/head>/i,'<link rel="canonical" href="'+canonical+'"><meta property="og:url" content="'+canonical+'"></head>');
      return res.send(t);
    }
    return res.send(Buffer.from(await r.arrayBuffer()));
  }catch(e){res.status(502).send('Proxy error');}
};
