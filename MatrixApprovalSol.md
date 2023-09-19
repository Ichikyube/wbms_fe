syncronize master data product with semai
kita asumsikan user tidak akan mengubah-ubah date pada sistem komputernya
   Pada komponen dengan temporary config, buat state bernama <configItem> dan array yang diambil berdasarkan storage item"tempConfig", tempConfig ini diambil dari memfetch config. tempConfig.include(<configItem>) apabila true maka component active.
   fetch config.status filter hanya yang status tidak sama dengan default. Apabila date.now melampaui nilai end maka status kembali ke default, start menjadi kosong, end menjadi kosong.

   apabila status configRequest approve maka kirim scedhule to config start, update status config menjadi kebalikan default, nilai end menjadi start ditambah livespan.



 **Checking if the Feature is Active**:
Remember to adjust the date and time formats to match your specific requirements and the way dates are handled in your application.

   Once you have `activationTime` and `expirationTime` defined, you can use them to determine if the feature is currently active or not.

   ```javascript
   const now = new Date(); // Get the current date and time

   if (now >= activationTime && now <= expirationTime) {
     // The feature is currently active
     console.log('Feature is active!');
   } else {
     // The feature is not active
     console.log('Feature is inactive.');
   }


 **Using Cache-Control Headers**:

   If you're serving the configuration through a web server, you can set Cache-Control headers to specify the time duration for which the configuration should be considered valid by the client's cache.

The `Cache-Control` headers method is a way to control how caching is handled by the client's browser or other caching intermediaries (like proxy servers). It's typically used when serving resources through a web server.

Here's an explanation of how it works:

1. **Cache-Control Header**:

   The `Cache-Control` header is an HTTP header that defines caching policies. It provides directives to specify how a response should be cached. One of the directives is `max-age`.

2. **`max-age` Directive**:

   The `max-age` directive specifies the maximum amount of time in seconds that a resource is considered fresh or valid. If the resource is requested again within this time period, the client's browser will use the cached version instead of making a new request to the server.

   For example, setting `max-age=86400` means that the resource is considered valid for 24 hours.

3. **Implementation Example**:

   In a Node.js web server (using a framework like Express), you can set the `Cache-Control` header for a specific route or resource. Here's an example:

   app.get('/config-item', (req, res) => {
     const configItem = {
       id: 1,
       name: 'Config Item 1',
       activationTime: new Date(),
       expirationTime: new Date(Date.now() + 24 * 60 * 60 * 1000)
     };
     expirationTime=Date.parse(activationTime + config.lifespan(24 * 60 * 60 * 1000) - now)
     res.setHeader('Cache-Control', 'max-age=expirationTime, private=true, immutable=true'); // Cache for 24 hours
     res.json(configItem);
   });

   In this example, when a client requests the `config-item` route, the server responds with the `configItem` object and sets the `Cache-Control` header to `max-age=86400`, indicating that the response can be cached for up to 24 hours.

4. **Client Behavior**:

   When a client (like a browser) receives a response with `Cache-Control` headers, it will store the response in its cache. If the client requests the same resource again within the specified `max-age` time, it will use the cached version instead of making a new request to the server.

   This can help improve performance by reducing the number of requests made to the server for resources that are not expected to change frequently.

Keep in mind that while `Cache-Control` headers can improve performance, they should be used judiciously. It's important to consider factors like the nature of the resource, how frequently it's expected to change, and whether caching it is appropriate for your specific use case.





GetTim


Buat Notifikasi + add message
Notifikasi hanya dapat dibaca oleh yang terdaftar dalam array target. notification.target.include(userinfo.id)?
